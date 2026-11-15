// After `vite build`: inject prerendered HTML + JSON-LD into dist/index.html,
// write robots.txt, sitemap.xml and llms.txt. Site URL comes from .env (VITE_SITE_URL).
import { readFile, writeFile, rm } from 'node:fs/promises'
import { loadEnv } from 'vite'

const SITE = (loadEnv('production', process.cwd()).VITE_SITE_URL || '').replace(/\/$/, '')
if (!SITE) throw new Error('Set VITE_SITE_URL in .env')
const { render, data } = await import('../.ssr/entry-server.js')
const { person, seo, faq, projects, experience, education, publications } = data
const today = new Date().toISOString().slice(0, 10)

const graph = [
  {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: person.name,
    url: `${SITE}/`,
    image: `${SITE}/og.jpg`,
    email: `mailto:${person.email}`,
    description: seo.description,
    jobTitle: 'Student medycyny, magister farmacji',
    address: { '@type': 'PostalAddress', addressLocality: 'Gdańsk', addressCountry: 'PL' },
    knowsLanguage: ['pl', 'en'],
    knowsAbout: ['Medycyna', 'Farmacja', 'Badania kliniczne', 'ICH-GCP', 'Medical writing', 'Health-tech', 'Genetyka kliniczna'],
    alumniOf: [...new Set(education.map((e) => e.org))].map((name) => ({ '@type': 'CollegeOrUniversity', name })),
    worksFor: experience.filter((e) => e.to === null).map((e) => ({ '@type': 'Organization', name: e.org.split(',')[0] })),
    ...(seo.sameAs.length ? { sameAs: seo.sameAs } : {}),
  },
  { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: person.name, inLanguage: 'pl-PL', publisher: { '@id': `${SITE}/#person` } },
  {
    '@type': 'ProfilePage',
    '@id': `${SITE}/#webpage`,
    url: `${SITE}/`,
    name: seo.title,
    description: seo.description,
    inLanguage: 'pl-PL',
    dateModified: today,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntity: { '@id': `${SITE}/#person` },
  },
  ...projects.filter((p) => p.description).map((p) => ({
    '@type': 'SoftwareApplication',
    name: p.name.join(''),
    description: p.description,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    author: { '@id': `${SITE}/#person` },
    ...(p.url ? { url: p.url } : {}),
  })),
  ...publications.map((p) => ({
    '@type': 'ScholarlyArticle',
    headline: p.title,
    datePublished: p.year,
    author: { '@id': `${SITE}/#person` },
    ...(p.url ? { url: p.url } : {}),
  })),
  { '@type': 'FAQPage', '@id': `${SITE}/#faq`, mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
]
// "<" escaped so content can never close the script tag
const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')

let html = await readFile('dist/index.html', 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
html = html
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
  .replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n  </head>`)
await writeFile('dist/index.html', html)

const hidden = (loadEnv('production', process.cwd()).VITE_ROBOTS || '').includes('noindex') // review copies stay out of search
await writeFile('dist/robots.txt', hidden ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
)
await writeFile(
  'dist/llms.txt',
  [
    `# ${person.name}`,
    '',
    `> ${seo.description}`,
    '',
    `Kontakt: ${person.email} · ${person.city} · ${SITE}/`,
    '',
    '## Projekty',
    ...projects.filter((p) => p.description).map((p) => `- ${p.name.join('')}: ${p.description}`),
    '',
    '## Doświadczenie',
    ...experience.map((e) => `- ${e.from}${e.to === undefined ? '' : `–${e.to ?? 'obecnie'}`}: ${e.role}, ${e.org}`),
    '',
    '## Wykształcenie',
    ...education.map((e) => `- ${e.from}–${e.to ?? 'obecnie'}: ${e.role}, ${e.org}`),
    '',
    '## Publikacje',
    ...publications.map((p) => `- ${p.year}: ${p.title} (${p.venue})`),
    '',
    '## FAQ',
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, '']),
  ].join('\n'),
)
await rm('.ssr', { recursive: true, force: true })
console.log(`prerendered → dist/index.html (${(html.length / 1024).toFixed(1)} kB), robots.txt, sitemap.xml, llms.txt`)
