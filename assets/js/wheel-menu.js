/* Menú móvil tipo rueda (< 992px). Controla el botón #nav-toggle. */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.querySelectorAll('#nav .nav__link');
  if (!toggle || !navLinks.length) return;

  var mqDesktop = window.matchMedia('(min-width: 992px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return mqReduce.matches; };

  // Items a partir de los enlaces existentes
  var items = Array.prototype.map.call(navLinks, function (a) {
    var href = a.getAttribute('href') || '';
    return { label: a.textContent.trim(), href: href, id: href.charAt(0) === '#' ? href.slice(1) : '' };
  });
  var N = items.length;

  // Imágenes de vista previa
  var brands = Array.isArray(window.CREATIVE_BRANDS) ? window.CREATIVE_BRANDS : [];
  function brandPost() {
    for (var i = 0; i < brands.length; i++) {
      var b = brands[i];
      if (b && b.posts && b.posts[0] && b.posts[0].images && b.posts[0].images[0] && b.posts[0].images[0].src) return b.posts[0].images[0].src;
    }
    return 'assets/img/angel-hero.webp';
  }
  function brandMockup() {
    for (var i = 0; i < brands.length; i++) {
      var b = brands[i];
      if (b && b.mockups && b.mockups[0] && b.mockups[0].src) return b.mockups[0].src;
    }
    return 'assets/img/angel-hero.webp';
  }
  var previewMap = {
    'inicio': { src: 'assets/img/angel-hero.webp' },
    'sobre-mi': { src: 'assets/img/angel-hero-wide.webp', pos: '70% center' },
    'trabajos': { src: brandPost() },
    'servicios': { src: 'assets/img/projects/realstate.webp' },
    'ubicacion': { src: brandMockup() }
  };

  var overlay, closeBtn, listEl, imgEls = [], itemEls = [], offsets = [];
  var active = 0, isOpen = false, savedScroll = 0, closeTimer = null, navTimer = null;
  var lastStep = 0;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'wheel-menu';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Menú');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'wheel-menu__close';
    closeBtn.setAttribute('aria-label', 'Cerrar menú');
    closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

    var preview = document.createElement('div');
    preview.className = 'wheel-menu__preview';
    items.forEach(function (it, i) {
      var p = previewMap[it.id] || { src: 'assets/img/angel-hero.webp' };
      var img = document.createElement('img');
      img.className = 'wheel-menu__img';
      img.alt = '';
      img.decoding = 'async';
      img.src = p.src;
      if (p.pos) img.style.objectPosition = p.pos;
      preview.appendChild(img);
      imgEls.push(img);
    });

    var wheel = document.createElement('nav');
    wheel.className = 'wheel-menu__wheel';
    wheel.setAttribute('aria-label', 'Menú móvil');
    listEl = document.createElement('ul');
    items.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'wheel-menu__item';
      li.style.setProperty('--i', i);
      var a = document.createElement('a');
      a.className = 'wheel-menu__link';
      a.href = it.href;
      a.textContent = it.label;
      a.addEventListener('click', function (e) { e.preventDefault(); onItemTap(i); });
      li.appendChild(a);
      listEl.appendChild(li);
      itemEls.push(li);
      offsets.push(null);
    });
    wheel.appendChild(listEl);

    var hint = document.createElement('p');
    hint.className = 'wheel-menu__hint';
    hint.textContent = 'Desliza para girar';

    overlay.appendChild(closeBtn);
    overlay.appendChild(preview);
    overlay.appendChild(wheel);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', function () { close(); });
    overlay.addEventListener('wheel', onWheel, { passive: false });
    overlay.addEventListener('touchstart', onTouchStart, { passive: true });
    overlay.addEventListener('touchmove', onTouchMove, { passive: false });
  }

  // Distancia circular más corta al índice activo (-2..+2 con 5 items)
  function circ(i) {
    var d = ((i - active) % N + N) % N;
    if (d > N / 2) d -= N;
    return d;
  }

  function render(instant) {
    var half = Math.floor(N / 2);
    itemEls.forEach(function (li, i) {
      var o = circ(i);
      var prev = offsets[i];
      var wrapped = prev !== null && Math.abs(o - prev) > half;
      var abs = Math.abs(o);
      var op = abs === 0 ? 1 : abs === 1 ? 0.45 : abs === 2 ? 0.22 : 0.1;
      if (wrapped && !instant && !reduced()) {
        // Salto de un extremo al otro: aparece con fundido sin cruzar la rueda
        li.classList.add('is-jump');
        li.style.opacity = 0;
        li.style.setProperty('--o', o);
        void li.offsetWidth;
        li.classList.remove('is-jump');
        li.style.opacity = op;
      } else {
        if (instant) li.classList.add('is-jump');
        li.style.setProperty('--o', o);
        li.style.opacity = op;
        if (instant) { void li.offsetWidth; li.classList.remove('is-jump'); }
      }
      offsets[i] = o;
      var link = li.firstChild;
      var on = i === active;
      li.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      imgEls[i].classList.toggle('is-on', on);
    });
  }

  function setActive(i) {
    active = ((i % N) + N) % N;
    render(false);
  }

  // Bloqueo de scroll del body
  function lockScroll() {
    savedScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    var b = document.body.style;
    b.position = 'fixed';
    b.top = -savedScroll + 'px';
    b.left = '0';
    b.right = '0';
    b.width = '100%';
  }
  function unlockScroll() {
    var b = document.body.style;
    b.position = b.top = b.left = b.right = b.width = '';
    window.scrollTo({ top: savedScroll, left: 0, behavior: 'instant' });
  }

  function setToggleState(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  function open() {
    if (isOpen || mqDesktop.matches) return;
    if (!overlay) build();
    clearTimeout(closeTimer);
    clearTimeout(navTimer);
    isOpen = true;
    var cur = -1;
    navLinks.forEach(function (a, i) { if (a.classList.contains('is-active')) cur = i; });
    active = cur >= 0 ? cur : 0;
    offsets = offsets.map(function () { return null; });
    lockScroll();
    overlay.hidden = false;
    render(true);
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    setToggleState(true);
    closeBtn.focus({ preventScroll: true });
  }

  function close(afterUnlock, noFocus) {
    if (!isOpen) return;
    isOpen = false;
    clearTimeout(navTimer);
    overlay.classList.remove('is-open');
    unlockScroll();
    setToggleState(false);
    if (!noFocus) toggle.focus({ preventScroll: true });
    closeTimer = setTimeout(function () { overlay.hidden = true; }, reduced() ? 200 : 360);
    if (afterUnlock) afterUnlock();
  }

  function goTo(i) {
    var it = items[i];
    close(function () {
      var el = it.id ? document.getElementById(it.id) : null;
      if (!el) return;
      el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', it.href); } catch (e) { /* sin historial */ }
    });
  }

  function onItemTap(i) {
    if (i === active) { goTo(i); return; }
    setActive(i);
    clearTimeout(navTimer);
    navTimer = setTimeout(function () { if (isOpen) goTo(i); }, reduced() ? 0 : 350);
  }

  // Rueda del ratón (con límite de frecuencia)
  var wheelLock = 0;
  function onWheel(e) {
    e.preventDefault();
    var now = Date.now();
    if (now - wheelLock < 280 || Math.abs(e.deltaY) < 4) return;
    wheelLock = now;
    clearTimeout(navTimer);
    setActive(active + (e.deltaY > 0 ? 1 : -1));
  }

  // Deslizamiento táctil: cada ~45px = un paso
  var touchY = null;
  function onTouchStart(e) { touchY = e.touches[0].clientY; }
  function onTouchMove(e) {
    e.preventDefault();
    if (touchY === null) return;
    var y = e.touches[0].clientY;
    var dy = touchY - y;
    while (Math.abs(dy) >= 45) {
      var dir = dy > 0 ? 1 : -1;
      clearTimeout(navTimer);
      setActive(active + dir);
      touchY -= dir * 45;
      dy = touchY - y;
    }
  }

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      clearTimeout(navTimer);
      setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (e.key === 'Tab') {
      // Atrapar el foco dentro del overlay
      var f = overlay.querySelectorAll('button, a[href]');
      var first = f[0], last = f[f.length - 1];
      if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  toggle.addEventListener('click', function () { if (isOpen) close(); else open(); });

  // Cerrar si la ventana pasa a escritorio
  var onMq = function (e) { if (e.matches && isOpen) close(null, true); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onMq);
  else if (mqDesktop.addListener) mqDesktop.addListener(onMq);
})();
