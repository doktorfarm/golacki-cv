/** Dot grid behind the white sections. The second layer (brighter dots) is masked to a
 *  circle around the cursor: components/Chrome.jsx writes --mx / --my. */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <i className="base" />
      <i className="lit" />
    </div>
  )
}
