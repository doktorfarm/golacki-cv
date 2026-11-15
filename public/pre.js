// Tiny blocking script (kept external so CSP can stay script-src 'self').
// Arms the intro before first paint; guarantees content shows even if the app bundle fails.
(function (d) {
  var c = d.classList
  c.add('js')
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) c.add('pre')
  setTimeout(function () {
    c.remove('pre')
    if (!window.__app) c.add('no-anim')
  }, 4000)
})(document.documentElement)
