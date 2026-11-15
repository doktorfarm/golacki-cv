import { useMemo } from 'react'

// Project previews: real screenshot where available (media/ → npm run images), abstract stand-in otherwise.

function GenArt() {
  const rows = useMemo(() => {
    const b = 'ACGT'
    let seed = 1521 // fixed seed: same markup on server and client
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 60 }, (_, i) => ({ c: b[(rnd() * 4) | 0], hit: r === 3 && i > 18 && i < 24 })),
    )
  }, [])
  return (
    <div className="art art-gen">
      <div className="seq">
        {rows.map((row, r) => (
          <div key={r}>{row.map((x, i) => (x.hit ? <mark key={i}>{x.c}</mark> : x.c))}</div>
        ))}
      </div>
      <span className="relative">GenCode, raport</span>
      <span className="relative">Wariant c.1521_1523del</span>
    </div>
  )
}

function CalArt() {
  const events = [3, 9, 10, 16, 24, 30]
  return (
    <div className="art art-cal">
      <span>Listopad</span>
      <div className="grid7">
        {Array.from({ length: 35 }, (_, i) => (
          <i key={i} className={i === 17 ? 'a' : events.includes(i) ? 'e' : ''} />
        ))}
      </div>
      <span>6 zajęć, 1 kolokwium</span>
    </div>
  )
}

const arts = { gen: GenArt, cal: CalArt }

export default function ProjectArt({ id }) {
  const Art = arts[id]
  return Art ? <Art /> : <div className="art bg-bg-2" />
}
