/**
 * Renders the 3D heart model (assets/heart.bin + heart.webp, prepared by scripts/heart.mjs)
 * with plain WebGL into an off-screen canvas; components/Network.jsx copies that canvas into
 * the sphere every frame. No 3D library: one mesh, one texture, one light.
 * Returns null when WebGL is unavailable.
 */
const VS = `
attribute vec3 p; attribute vec3 n; attribute vec2 uv;
uniform float ry; uniform float rx;
varying vec2 vuv; varying vec3 vn;
vec3 rot(vec3 v) {
  float s = sin(ry), c = cos(ry);
  v = vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
  s = sin(rx); c = cos(rx);
  return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}
void main() {
  vec3 q = rot(p * 0.82);
  vn = rot(n);
  vuv = uv;
  float w = 1.0 - q.z * 0.25;
  gl_Position = vec4(q.x, q.y, -q.z * 0.6 * w, w);
}`
const FS = `
precision mediump float;
uniform sampler2D t;
varying vec2 vuv; varying vec3 vn;
void main() {
  vec3 c = texture2D(t, vuv).rgb;
  vec3 n = normalize(vn);
  if (!gl_FrontFacing) n = -n;
  vec3 l = normalize(vec3(-0.45, 0.55, 0.7));
  float d = max(dot(n, l), 0.0);
  float s = pow(max(dot(n, normalize(l + vec3(0.0, 0.0, 1.0))), 0.0), 28.0);
  float rim = pow(1.0 - max(n.z, 0.0), 3.0);
  gl_FragColor = vec4(c * (0.62 + 0.75 * d) + vec3(0.26) * s + vec3(0.25, 0.45, 1.0) * rim * 0.55, 1.0);
}`

export function createHeart(buffer, img, size = 720) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false })
  if (!gl) return null

  // file layout: see scripts/heart.mjs
  const [nv, ni] = new Uint32Array(buffer, 0, 2)
  const pad = (v) => (v + 3) & ~3
  let o = 8
  const P = new Int16Array(buffer, o, nv * 3)
  o += pad(nv * 6)
  const U = new Uint16Array(buffer, o, nv * 2)
  o += nv * 4
  const I = new Uint16Array(buffer, o, ni)
  o += pad(ni * 2)
  const N = new Int8Array(buffer, o, nv * 4)

  const sh = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  for (const [name, data, n, type, stride] of [['p', P, 3, gl.SHORT, 0], ['uv', U, 2, gl.UNSIGNED_SHORT, 0], ['n', N, 3, gl.BYTE, 4]]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, name)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, n, type, true, stride, 0)
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, I, gl.STATIC_DRAW)
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
  gl.generateMipmap(gl.TEXTURE_2D) // the texture is 1024 x 1024
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)
  const uRy = gl.getUniformLocation(prog, 'ry')
  const uRx = gl.getUniformLocation(prog, 'rx')

  return {
    canvas,
    render(ry, rx) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.uniform1f(uRy, ry)
      gl.uniform1f(uRx, rx)
      gl.drawElements(gl.TRIANGLES, ni, gl.UNSIGNED_SHORT, 0)
    },
  }
}
