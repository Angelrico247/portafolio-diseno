/* Hero + Sobre mí: efecto de scroll apilado.
   p va de 0 a 1 mientras se recorre la altura del hero:
   - hero:     scale 1 → .8, rotate 0 → -5deg
   - Sobre mí: scale .8 → 1, rotate 5deg → 0 */
(function () {
  'use strict';
  const stack = document.getElementById('stack');
  if (!stack) return;
  const hero = stack.querySelector('.hero');
  const about = stack.querySelector('.about');
  if (!hero || !about) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  function update() {
    ticking = false;
    const h = hero.offsetHeight || window.innerHeight;
    const top = stack.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / h));
    hero.style.transform = 'scale(' + (1 - 0.2 * p).toFixed(4) + ') rotate(' + (-5 * p).toFixed(3) + 'deg)';
    about.style.transform = p >= 1 ? 'none' : 'scale(' + (0.8 + 0.2 * p).toFixed(4) + ') rotate(' + (5 - 5 * p).toFixed(3) + 'deg)';
    stack.classList.toggle('is-settled', p >= 1);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
