/* Título del hero: intro de dibujo de trazo + aura/contorno con el cursor */
(function () {
  var hero = document.getElementById('inicio');
  var h1 = hero && hero.querySelector('.hero__name');
  if (!hero || !h1) return;

  var NS = 'http://www.w3.org/2000/svg';
  var TEXT = (h1.textContent || 'Angel Rico').trim();
  var RADIUS = 120;          // radio del círculo en px de pantalla
  var INTRO_MS = 3700;       // trazo (~3s) + relleno (0.7s)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Oculta el texto original y retiene el subtítulo mientras se prepara el SVG
  hero.classList.add('title-drawing');

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function finish() {
    hero.classList.remove('title-drawing');
    hero.classList.add('title-drawn');
  }

  function build() {
    h1.setAttribute('aria-label', TEXT);
    h1.textContent = '';

    var svg = el('svg', { 'aria-hidden': 'true', focusable: 'false' }, h1);
    var defs = el('defs', {}, svg);

    // Degradado violeta -> rosa -> azul, continuo a lo largo de todo el título
    var grad = el('linearGradient', { id: 'title-grad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 100, y2: 0 }, defs);
    el('stop', { offset: '0', 'stop-color': '#A58BFF' }, grad);
    el('stop', { offset: '.5', 'stop-color': '#E07BFF' }, grad);
    el('stop', { offset: '1', 'stop-color': '#6E9BFF' }, grad);

    // Texto de medida para obtener la posición de cada letra (respeta el kerning)
    var probe = el('text', { x: 0, y: 0 }, svg);
    probe.textContent = TEXT;
    var len = probe.getComputedTextLength();
    var xs = [];
    for (var i = 0; i < TEXT.length; i++) xs.push(probe.getStartPositionOfChar(i).x);
    svg.removeChild(probe);

    // 100 unidades = 1em; viewBox vertical fijo (mayúsculas/ascendentes arriba, descendentes abajo)
    var vx = -4, vy = -84, vw = len + 8, vh = 118;
    svg.setAttribute('viewBox', vx + ' ' + vy + ' ' + vw + ' ' + vh);
    svg.style.width = (vw / 100) + 'em';
    svg.style.height = (vh / 100) + 'em';
    grad.setAttribute('x1', vx);
    grad.setAttribute('x2', vx + vw);

    // Máscara: rectángulo blanco (se ve) + círculo negro (agujero que deja solo el contorno)
    var mask = el('mask', { id: 'title-mask', maskUnits: 'userSpaceOnUse', x: vx - 20, y: vy - 20, width: vw + 40, height: vh + 40 }, defs);
    el('rect', { x: vx - 20, y: vy - 20, width: vw + 40, height: vh + 40, fill: '#fff' }, mask);
    var hole = el('circle', { cx: 0, cy: 0, r: 0, fill: '#000' }, mask);

    // Capas: relleno (con máscara) y trazo (encima)
    var fillG = el('g', { 'class': 'title__fill', mask: 'url(#title-mask)' }, svg);
    var strokeG = el('g', { 'class': 'title__stroke' }, svg);
    var n = 0;
    for (var j = 0; j < TEXT.length; j++) {
      if (TEXT[j] === ' ') continue;
      var a = { x: xs[j], y: 0 };
      el('text', a, fillG).textContent = TEXT[j];
      var t = el('text', a, strokeG);
      t.style.setProperty('--i', n++);
      t.textContent = TEXT[j];
    }

    // Aura detrás de las letras
    var aura = document.createElement('span');
    aura.className = 'title__aura';
    aura.setAttribute('aria-hidden', 'true');
    h1.insertBefore(aura, svg);

    return { svg: svg, hole: hole, aura: aura };
  }

  // Aura + contorno con el cursor (solo punteros finos con hover)
  function initHover(p) {
    var svg = p.svg, hole = p.hole, aura = p.aura;
    var r = 0, target = 0, cx = 0, cy = 0, raf = 0, first = true;
    var cur = { x: 0, y: 0 };      // centro suavizado en px de cliente

    function frame() {
      raf = 0;
      var ctm = svg.getScreenCTM();
      if (!ctm) return;
      // Entrada: el centro salta al cursor; después sigue con lerp suave
      if (first) { cur.x = cx; cur.y = cy; first = false; }
      else { cur.x += (cx - cur.x) * 0.35; cur.y += (cy - cur.y) * 0.35; }
      r += (target - r) * 0.15;
      if (Math.abs(target - r) < 0.2) r = target;

      var pt = new DOMPoint(cur.x, cur.y).matrixTransform(ctm.inverse());
      hole.setAttribute('cx', pt.x);
      hole.setAttribute('cy', pt.y);
      hole.setAttribute('r', r / ctm.a);   // px de pantalla -> unidades del SVG

      var box = h1.getBoundingClientRect();
      var k = r / RADIUS;
      aura.style.opacity = k;
      aura.style.transform = 'translate(' + (cur.x - box.left) + 'px,' + (cur.y - box.top) + 'px) scale(' + (0.4 + 0.6 * k) + ')';

      if (r !== target || Math.abs(cx - cur.x) > 0.3 || Math.abs(cy - cur.y) > 0.3) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    h1.addEventListener('mouseenter', function (e) {
      cx = e.clientX; cy = e.clientY; target = RADIUS;
      if (r === 0) first = true;
      kick();
    });
    h1.addEventListener('mousemove', function (e) { cx = e.clientX; cy = e.clientY; target = RADIUS; kick(); });
    h1.addEventListener('mouseleave', function () { target = 0; kick(); });
  }

  function run() {
    var parts;
    try { parts = build(); } catch (e) {
      // Si algo falla, se restaura el título normal y se muestra el subtítulo
      h1.textContent = TEXT; h1.removeAttribute('aria-label'); finish(); return;
    }
    var svg = parts.svg;
    var hoverOK = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function done() {
      svg.classList.add('title--drawn');
      h1.classList.add('title--drawn');
      finish();
      if (hoverOK) initHover(parts);
    }
    if (reduce) { done(); return; }
    // Fin de la secuencia (timer: no depende de animationend)
    setTimeout(done, INTRO_MS);
  }

  // Espera a la fuente antes de medir; con tope de 2.5s por si no carga
  var ready = Promise.resolve();
  if (document.fonts && document.fonts.load) {
    ready = Promise.race([
      document.fonts.load('700 100px Poppins').then(function () { return document.fonts.ready; }),
      new Promise(function (res) { setTimeout(res, 2500); })
    ]).catch(function () {});
  }
  ready.then(run);
})();
