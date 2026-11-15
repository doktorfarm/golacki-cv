/** Thin concentric orbits with small bodies travelling on them: a quiet, moving
 *  echo of the sphere for the white sections. Pure SVG + CSS. */
export default function Orbits({ className = '' }) {
  return (
    <svg className={`orbits ${className}`} viewBox="-300 -300 600 600" aria-hidden="true">
      {[110, 170, 230, 290].map((r, i) => (
        <g key={r} className={`orbit o${i}`}>
          <circle r={r} />
          <circle className="body" cx={r} r={i % 2 ? 5 : 3.5} />
          {i > 1 && <circle className="body soft" cx={-r} r="3" />}
        </g>
      ))}
    </svg>
  )
}
