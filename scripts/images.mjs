// media/* → public/assets/img/{name}-{w}.{avif,webp,jpg|png} + src/images.json (dimensions for CLS=0)
// Run: npm run images  (only after changing files in media/)
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

const OUT = 'public/assets/img'
// Widths are capped so nothing is ever upscaled on screen (the sources are small).
const jobs = [
  // App screenshots, captured at 2x
  { name: 'gencode-app', src: 'media/gencode-app.png', widths: [700, 1400] },
  { name: 'gencode-start', src: 'media/gencode-start.png', widths: [700, 1400] },
  { name: 'gencode-phone', src: 'media/gencode-phone.png', widths: [300, 600] },
  { name: 'infectio-screens', src: 'media/infectio-screens.png', widths: [700, 1400] },
  { name: 'startownia-panel', src: 'media/startownia-panel.png', widths: [700, 1400] },
  { name: 'startownia-start', src: 'media/startownia-start.png', widths: [700, 1400] },
  { name: 'startownia-plan', src: 'media/startownia-plan.png', widths: [300, 600] },
]

await mkdir(OUT, { recursive: true })
const manifest = {}
for (const j of jobs) {
  // cut-outs: trim the empty margin so the figure can be centred
  const input = j.crop ? await sharp(j.src).extract(j.crop).toBuffer() : j.alpha ? await sharp(j.src).trim().toBuffer() : j.src
  const meta = await sharp(input).metadata()
  const fallback = j.alpha ? 'png' : 'jpg'
  manifest[j.name] = { width: meta.width, height: meta.height, widths: j.widths, fallback }
  for (const w of j.widths) {
    const base = sharp(input).resize({ width: w })
    await base.clone().avif({ quality: 55 }).toFile(`${OUT}/${j.name}-${w}.avif`)
    await base.clone().webp({ quality: 78 }).toFile(`${OUT}/${j.name}-${w}.webp`)
    if (w === j.widths.at(-1)) {
      if (j.alpha) await base.clone().png({ palette: true, quality: 80 }).toFile(`${OUT}/${j.name}-${w}.png`)
      else await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}/${j.name}-${w}.jpg`)
    }
  }
}
await writeFile('src/images.json', JSON.stringify(manifest, null, 2))

// Social share image 1200×630
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F5F8FF"/>
  <circle cx="84" cy="92" r="9" fill="#1F47D6"/>
  <text x="106" y="101" font-family="Helvetica Neue, Arial, sans-serif" font-size="26" font-weight="600" fill="#0A1A4A">Krzysztof Gołacki</text>
  <text font-family="Helvetica Neue, Arial, sans-serif" font-size="60" font-weight="700" fill="#0A1A4A" letter-spacing="-2">
    <tspan x="72" y="290">Idę w stronę</tspan><tspan x="72" y="362">kardiochirurgii. Po drodze</tspan>
    <tspan x="72" y="434">buduję narzędzia.</tspan>
  </text>
  <text x="72" y="548" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" fill="#4A5A85">Kardiochirurgia, medycyna, badania kliniczne, health-tech</text>
</svg>`)
await sharp(text).jpeg({ quality: 84 }).toFile('public/og.jpg')
console.log('images ok', Object.keys(manifest))
