// Prepares the 3D heart for the page:  node scripts/heart.mjs path/to/human-heart.glb
// The source model (CC0, grab3d.com) is 26 MB / 800k triangles. This reduces it to a few
// hundred kB: simplified mesh, quantised to src/assets/heart.bin, plus a small colour texture.
import { readFile, writeFile } from 'node:fs/promises'
import { MeshoptSimplifier } from 'meshoptimizer'
import sharp from 'sharp'

const TRIANGLES = 36000
const glb = await readFile(process.argv[2])
const jsonLen = glb.readUInt32LE(12)
const g = JSON.parse(glb.subarray(20, 20 + jsonLen).toString())
const bin = glb.subarray(20 + jsonLen + 8)
const view = (acc, T, n) => {
  const a = g.accessors[acc]
  const bv = g.bufferViews[a.bufferView]
  const size = T.BYTES_PER_ELEMENT
  const stride = bv.byteStride || size * n
  const off = (bv.byteOffset || 0) + (a.byteOffset || 0)
  const out = new T(a.count * n)
  const read = T === Float32Array ? (o) => bin.readFloatLE(o) : (o) => bin.readUInt32LE(o)
  for (let i = 0; i < a.count; i++) for (let k = 0; k < n; k++) out[i * n + k] = read(off + i * stride + k * size)
  return out
}
const prim = g.meshes[0].primitives[0]
const pos = view(prim.attributes.POSITION, Float32Array, 3)
const nor = view(prim.attributes.NORMAL, Float32Array, 3)
const uv = view(prim.attributes.TEXCOORD_0, Float32Array, 2)
const idx = view(prim.indices, Uint32Array, 1)

await MeshoptSimplifier.ready
const [simple, err] = MeshoptSimplifier.simplify(idx, pos, 3, TRIANGLES * 3, 0.02)
// keep only the vertices still in use
const remap = new Int32Array(pos.length / 3).fill(-1)
let n = 0
for (const i of simple) if (remap[i] < 0) remap[i] = n++
if (n > 65535) throw new Error('too many vertices for 16-bit indices')
const { min, max } = g.accessors[prim.attributes.POSITION]
const c = min.map((v, k) => (v + max[k]) / 2)
const half = Math.max(...min.map((v, k) => (max[k] - v) / 2))
const P = new Int16Array(n * 3)
const N = new Int8Array(n * 4)
const U = new Uint16Array(n * 2)
remap.forEach((to, from) => {
  if (to < 0) return
  for (let k = 0; k < 3; k++) {
    P[to * 3 + k] = Math.round(((pos[from * 3 + k] - c[k]) / half) * 32767)
    N[to * 4 + k] = Math.round(nor[from * 3 + k] * 127)
  }
  U[to * 2] = Math.round(Math.min(1, Math.max(0, uv[from * 2])) * 65535)
  U[to * 2 + 1] = Math.round(Math.min(1, Math.max(0, uv[from * 2 + 1])) * 65535)
})
const I = Uint16Array.from(simple, (i) => remap[i])
// layout: [vertices, indices] as uint32, then positions (int16 x3), uvs (uint16 x2), indices (uint16), normals (int8 x4)
const pad = (b) => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4)])
const out = Buffer.concat([Buffer.from(new Uint32Array([n, I.length]).buffer), pad(Buffer.from(P.buffer)), Buffer.from(U.buffer), pad(Buffer.from(I.buffer)), Buffer.from(N.buffer)])
await writeFile('src/assets/heart.bin', out)

const tex = g.textures[g.materials[prim.material].pbrMetallicRoughness.baseColorTexture.index]
const bv = g.bufferViews[g.images[tex.source].bufferView]
// Colour grade: the scan texture is brown with yellow fat. Fat becomes red, everything gets
// lighter and more saturated, blue vessels stay blue, so the heart reads against the navy page.
const { data: px, info } = await sharp(bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength)).resize(1024, 1024).removeAlpha().raw().toBuffer({ resolveWithObject: true })
for (let i = 0; i < px.length; i += 3) {
  const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  let h = 0
  if (d) h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  h *= 60
  let s = mx ? d / mx : 0
  let v = mx
  if (h >= 15 && h <= 75) h = 4 + (h - 15) * 0.1 // yellow and tan -> red
  if (h > 340 || h < 22) s = Math.min(1, s * 1.25 + 0.12) // reds richer
  v = Math.min(1, Math.pow(v, 0.78) * 1.18)
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c
  const [rr, gg, bb] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  px[i] = Math.round((rr + m) * 255)
  px[i + 1] = Math.round((gg + m) * 255)
  px[i + 2] = Math.round((bb + m) * 255)
}
await sharp(px, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 84 }).toFile('src/assets/heart.webp')
console.log(`heart: ${n} vertices, ${I.length / 3} triangles, error ${err.toFixed(4)}, ${(out.length / 1024) | 0} kB mesh`)
