/* Portafolio — Angel Rico. JS plano, sin build. Todas las rutas son relativas. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Configuración editable
     ------------------------------------------------------------------ */

  // Solo se muestra la ubicación; el sitio no publica datos de contacto.
  const LOCATION = 'Guadalajara, Jalisco, México';

  // Habilidades: edita etiqueta y porcentaje aquí.
  const SKILLS = [
    { label: 'Diseño para redes sociales', value: 95 },
    { label: 'Identidad visual', value: 85 },
    { label: 'Diseño web y UI', value: 90 },
    { label: 'Adobe / Figma', value: 90 }
  ];

  const PROJECTS = [
    { name: 'Tertulia GDL', category: 'Catering', url: 'https://angelrico247.github.io/tertulia_catering/', image: 'assets/img/projects/tertulia.webp', description: 'Sitio para servicio de catering con menú, paquetes por evento y formulario de contacto, más su sistema de publicaciones y carruseles para Instagram.' },
    { name: 'Lalo', category: 'Marca Personal', url: 'https://angelrico247.github.io/portafolio-lalo/', image: 'assets/img/projects/lalo.webp', description: 'Portafolio de marca personal para un director creativo, con presentación de proyectos y métricas destacadas.' },
    { name: 'Dental Clinic', category: 'Dental', url: 'https://dentaldemo-steel.vercel.app', image: 'assets/img/projects/dental.webp', description: 'Landing para clínica dental y un sistema completo de piezas para redes: publicaciones, carruseles, stories destacadas y portadas de reel.' },
    { name: 'MovIng', category: 'Mudanzas', url: 'https://angelrico247.github.io/moving/', image: 'assets/img/projects/moving.webp', description: 'Landing de mudanzas con hero animado, paquetes por horas y cotizador.' },
    { name: 'Terra Inmobiliaria', category: 'Inmobiliaria', url: 'https://real-statedemo.vercel.app', image: 'assets/img/projects/realstate.webp', description: 'Sitio inmobiliario con catálogo de propiedades y una línea gráfica para redes en cuatro estilos de publicación, carruseles y mockups.' },
    { name: 'VOLUME', category: 'Interiorismo', url: 'https://volume-interiores.vercel.app', image: 'assets/img/projects/volume.webp', description: 'Sitio editorial para estudio de interiorismo y su set de publicaciones y carruseles para Instagram.' },
    { name: 'Rental Cars', category: 'Renta de Autos', url: 'https://angelrico247.github.io/Rental-Cars/', image: 'assets/img/projects/rentalcars.webp', description: 'Plataforma de renta de autos con catálogo de vehículos y reservas.' },
    { name: 'TWID 3D', category: 'Experiencia 3D', url: 'https://angelrico247.github.io/twid-landing-3d/landing_3d.html', image: 'assets/img/projects/twid3d.webp', description: 'Landing experimental con un cubo de vóxeles 3D animado en la paleta de la marca.' }
  ];

  const BRANDS = Array.isArray(window.CREATIVE_BRANDS) ? window.CREATIVE_BRANDS : [];

  /* ------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------ */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

  function h(tag, attrs) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(function (kv) {
      const k = kv[0], v = kv[1];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (let i = 2; i < arguments.length; i++) {
      [].concat(arguments[i]).forEach(function (c) {
        if (c == null || c === false) return;
        el.append(c.nodeType ? c : document.createTextNode(c));
      });
    }
    return el;
  }

  const ICONS = {
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 13c0-1.7 1-2.6 2.3-2.6S16.5 11.3 16.5 13V16"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    prev: '<path d="m15 6-6 6 6 6"/>',
    next: '<path d="m9 6 6 6-6 6"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>'
  };

  function icon(name) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    s.innerHTML = ICONS[name]; // cadenas estáticas definidas arriba
    return s;
  }

  function img(src, alt, extra) {
    return h('img', Object.assign({ src: src, alt: alt, loading: 'lazy', decoding: 'async' }, extra || {}));
  }

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapTab(e, container) {
    const items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* Bloqueo de scroll (contador, para modal + lightbox) */
  let lockCount = 0, lockY = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    lockY = window.scrollY;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.top = '-' + lockY + 'px';
    if (sb > 0) document.body.style.paddingRight = sb + 'px';
    document.body.classList.add('is-locked');
  }
  function unlockScroll() {
    if (--lockCount > 0) return;
    lockCount = 0;
    document.body.classList.remove('is-locked');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    window.scrollTo({ top: lockY, left: 0, behavior: 'instant' });
  }

  /* ------------------------------------------------------------------
     Header, menú móvil y scrollspy
     ------------------------------------------------------------------ */

  const header = $('#header');
  const navToggle = $('#nav-toggle');
  const nav = $('#nav');
  const navLinks = $$('.nav__link');
  const spyIds = navLinks.map(function (a) { return a.getAttribute('href').slice(1); });

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
  }
  navToggle.addEventListener('click', function () { setMenu(navToggle.getAttribute('aria-expanded') !== 'true'); });
  navLinks.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 992) setMenu(false); });

  const toTop = $('#to-top');
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 80);
    toTop.classList.toggle('is-visible', y > 500);
    let current = spyIds[0];
    spyIds.forEach(function (id) {
      const s = document.getElementById(id);
      if (s && s.getBoundingClientRect().top <= 140) current = id;
    });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = spyIds[spyIds.length - 1];
    navLinks.forEach(function (a) {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Hero: efecto de agua (jquery.ripples)
     ------------------------------------------------------------------ */

  (function initRipples() {
    if (reduceMotion || isTouch) return;
    try {
      const $j = window.jQuery;
      if (!$j || !$j.fn || !$j.fn.ripples) return;
      const $bg = $j('.hero__bg');
      $bg.ripples({ resolution: 512, dropRadius: 20, perturbance: 0.04 });
      const hero = $('.hero');
      setInterval(function () {
        if (document.hidden || window.scrollY > hero.offsetHeight) return;
        try {
          const w = hero.clientWidth, hh = hero.clientHeight;
          $bg.ripples('drop', Math.random() * w, Math.random() * hh, 20, 0.04);
        } catch (e) { /* sin gota */ }
      }, 3000);
    } catch (err) {
      /* WebGL no disponible: la foto queda estática */
    }
  })();

  /* ------------------------------------------------------------------
     Aparición al hacer scroll
     ------------------------------------------------------------------ */

  const revealEls = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Lightbox compartido
     ------------------------------------------------------------------ */

  const Lightbox = (function () {
    const root = h('div', { class: 'lb', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Visor de imágenes', hidden: true });
    const count = h('p', { class: 'lb__count', 'aria-live': 'polite' });
    const closeBtn = h('button', { class: 'lb__btn lb__close', type: 'button', 'aria-label': 'Cerrar visor' }, icon('close'));
    const prevBtn = h('button', { class: 'lb__btn lb__prev', type: 'button', 'aria-label': 'Imagen anterior' }, icon('prev'));
    const nextBtn = h('button', { class: 'lb__btn lb__next', type: 'button', 'aria-label': 'Imagen siguiente' }, icon('next'));
    const image = h('img', { class: 'lb__img', alt: '', decoding: 'async' });
    const caption = h('p', { class: 'lb__cap' });
    const stage = h('div', { class: 'lb__stage' }, image, caption);
    root.append(stage, count, closeBtn, prevBtn, nextBtn);
    document.body.append(root);

    let items = [], index = 0, opener = null, open = false, startX = null, startY = null;

    function render() {
      const it = items[index];
      image.src = it.src;
      image.alt = it.alt || '';
      caption.textContent = it.alt || '';
      count.textContent = (index + 1) + ' / ' + items.length;
      const multi = items.length > 1;
      prevBtn.hidden = nextBtn.hidden = !multi;
    }
    function step(d) { if (items.length < 2) return; index = (index + d + items.length) % items.length; render(); }
    function show(list, i, from) {
      items = list; index = i; opener = from || document.activeElement;
      open = true; root.hidden = false; lockScroll(); render(); closeBtn.focus();
    }
    function close() {
      if (!open) return;
      open = false; root.hidden = true; unlockScroll();
      if (opener && document.contains(opener)) opener.focus();
    }

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });
    root.addEventListener('click', function (e) { if (e.target === root || e.target === stage) close(); });
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    return {
      show: show,
      isOpen: function () { return open; },
      key: function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'Tab') trapTab(e, root);
      }
    };
  })();

  /* ------------------------------------------------------------------
     Redes sociales: filtros + grilla
     ------------------------------------------------------------------ */

  (function initTiles() {
    const filters = $('#filters');
    const grid = $('#tiles');
    if (!BRANDS.length) return;

    const allByBrand = BRANDS.map(function (b) {
      return { name: b.name, images: b.posts.reduce(function (acc, g) { return acc.concat(g.images); }, []) };
    });

    // Se muestran pocas piezas a la vez para que la sección no crezca de más.
    const PAGE = 8;
    const more = h('button', { class: 'btn btn--ghost tiles__more', type: 'button', text: 'Ver más' });
    grid.after(more);
    let current = [];
    let shown = 0;

    function forFilter(name) {
      if (name === 'Todos') {
        const out = [];
        for (let i = 0; i < 2; i++) {
          allByBrand.forEach(function (b) { if (b.images[i]) out.push({ brand: b.name, image: b.images[i] }); });
        }
        return out;
      }
      const b = allByBrand.find(function (x) { return x.name === name; });
      return b ? b.images.map(function (im) { return { brand: b.name, image: im }; }) : [];
    }

    function tile(t, i, lbItems) {
      const btn = h('button', { class: 'tile', type: 'button', onclick: function (e) { Lightbox.show(lbItems, i, e.currentTarget); } },
        img(t.image.src, t.image.alt, { width: 640, height: 800 }),
        h('span', { class: 'tile__over', 'aria-hidden': 'true' }, t.brand, h('small', null, icon('eye'), 'Ver'))
      );
      return h('li', null, btn);
    }

    function showMore() {
      const lbItems = current.map(function (t) { return { src: t.image.src, alt: t.image.alt }; });
      const next = current.slice(shown, shown + PAGE);
      grid.append.apply(grid, next.map(function (t, k) { return tile(t, shown + k, lbItems); }));
      shown += next.length;
      more.hidden = shown >= current.length;
      more.textContent = 'Ver más (' + (current.length - shown) + ')';
    }

    function renderGrid(name) {
      current = forFilter(name);
      shown = 0;
      grid.textContent = '';
      showMore();
    }
    more.addEventListener('click', showMore);

    ['Todos'].concat(BRANDS.map(function (b) { return b.name; })).forEach(function (name, i) {
      const pill = h('button', { class: 'pill', type: 'button', 'aria-pressed': String(i === 0), text: name, onclick: function () {
        $$('.pill', filters).forEach(function (p) { p.setAttribute('aria-pressed', String(p === pill)); });
        renderGrid(name);
      } });
      filters.append(pill);
    });
    renderGrid('Todos');
  })();

  /* ------------------------------------------------------------------
     Trabajos: pestañas Redes sociales / Sitios web
     ------------------------------------------------------------------ */

  (function initWorkTabs() {
    const tabs = $$('.work-tab');
    if (!tabs.length) return;
    const counts = {
      'wt-redes': BRANDS.reduce(function (n, b) { return n + b.posts.reduce(function (m, g) { return m + g.images.length; }, 0); }, 0),
      'wt-web': PROJECTS.length
    };
    tabs.forEach(function (t) { const c = t.querySelector('.work-tab__count'); if (c) c.textContent = counts[t.id] || ''; });
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        select((i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length, true);
      });
    });
    select(0);
  })();

  /* ------------------------------------------------------------------
     Modal de proyecto
     ------------------------------------------------------------------ */

  const Modal = (function () {
    let root = null, dialog = null, opener = null, uid = 0;

    function hostOf(url) { try { return new URL(url).hostname; } catch (e) { return url; } }

    function thumb(kind, im, list, i, label) {
      const opts = { class: 'thumb thumb--' + kind, type: 'button', 'aria-label': 'Ampliar: ' + im.alt, onclick: function (e) {
        Lightbox.show(list, i, e.currentTarget);
      } };
      const b = h('button', opts, img(im.src, '', { width: im.width, height: im.height }));
      if (kind === 'mock' && im.width && im.height) b.style.aspectRatio = im.width + ' / ' + im.height;
      return b;
    }

    function sectionsFor(brand) {
      if (!brand) return [];
      const out = [];
      const postsCount = brand.posts.reduce(function (n, g) { return n + g.images.length; }, 0);
      if (postsCount) out.push({ id: 'posts', label: 'Publicaciones', count: postsCount, render: function () {
        const wrap = h('div');
        brand.posts.forEach(function (g) {
          if (!g.images.length) return;
          const ul = h('ul', { class: 'grid grid--posts' }, g.images.map(function (im, i) { return h('li', null, thumb('post', im, g.images, i)); }));
          wrap.append(h('section', { class: 'group', 'aria-label': g.label }, brand.posts.length > 1 ? h('h3', { class: 'group__title', text: g.label }) : null, ul));
        });
        return wrap;
      } });
      if (brand.carousels.length) out.push({ id: 'carousels', label: 'Carruseles', count: brand.carousels.length, render: function () {
        const wrap = h('div');
        brand.carousels.forEach(function (c) {
          const ul = h('ul', { class: 'row', tabindex: '0', 'aria-label': 'Láminas del carrusel ' + c.title },
            c.slides.map(function (im, i) { return h('li', null, thumb('slide', im, c.slides, i)); }));
          wrap.append(h('section', { class: 'carousel', 'aria-label': 'Carrusel: ' + c.title },
            h('div', { class: 'carousel__head' }, h('h3', { class: 'carousel__title', text: c.title }), h('span', { class: 'carousel__count', text: c.slides.length + ' láminas' })), ul));
        });
        return wrap;
      } });
      if (brand.stories.length) out.push({ id: 'stories', label: 'Stories', count: brand.stories.length, render: function () {
        return h('ul', { class: 'grid grid--stories' }, brand.stories.map(function (im, i) { return h('li', null, thumb('story', im, brand.stories, i)); }));
      } });
      if (brand.mockups.length) out.push({ id: 'mockups', label: 'Mockups', count: brand.mockups.length, render: function () {
        const portrait = brand.mockups.every(function (m) { return (m.height || 0) > (m.width || 0); });
        return h('ul', { class: 'grid grid--mock' + (portrait ? ' grid--mock-portrait' : '') }, brand.mockups.map(function (im, i) { return h('li', null, thumb('mock', im, brand.mockups, i)); }));
      } });
      return out;
    }

    function close() {
      if (!root) return;
      root.remove(); root = dialog = null;
      unlockScroll();
      if (opener && document.contains(opener)) opener.focus();
    }

    function open(project, from) {
      if (root) return;
      opener = from || document.activeElement;
      const id = 'pm' + (++uid);
      const brand = BRANDS.find(function (b) { return b.name === project.name; });
      const sections = sectionsFor(brand);
      const pieces = sections.reduce(function (n, s) {
        if (s.id === 'carousels') return n + brand.carousels.reduce(function (m, c) { return m + c.slides.length; }, 0);
        return n + s.count;
      }, 0);

      const link = project.url ? h('a', { class: 'pm__link', href: project.url, target: '_blank', rel: 'noopener noreferrer' },
        h('span', null, h('span', { class: 'pm__link-label', text: 'Ver sitio' }), h('span', { class: 'pm__link-host', text: hostOf(project.url) }), h('span', { class: 'sr-only', style: 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)', text: ' (se abre en una pestaña nueva)' })),
        h('span', { class: 'pm__arrow', 'aria-hidden': 'true' }, icon('arrow'))) : null;

      const top = h('div', { class: 'pm__top' },
        h('div', null,
          h('p', { class: 'pm__cat', text: project.category }),
          h('h2', { class: 'pm__title', id: id + '-title', text: project.name }),
          h('p', { class: 'pm__desc', text: project.description }),
          sections.length ? h('p', { class: 'pm__count', text: pieces + ' piezas de material para redes sociales.' }) : null,
          link),
        h('div', { class: 'pm__shot' }, img(project.image, 'Mockup del sitio de ' + project.name, { width: 1200, height: 800 })));

      const body = h('div', { class: 'pm__body' }, top);

      if (sections.length) {
        const tabsWrap = h('div', { class: 'tabs' });
        const list = h('div', { class: 'tabs__list', role: 'tablist', 'aria-label': 'Material del proyecto' });
        const panel = h('div', { class: 'tabs__panel', role: 'tabpanel', tabindex: '0' });
        const tabEls = sections.map(function (s) {
          const t = h('button', { class: 'tab', type: 'button', role: 'tab', id: id + '-tab-' + s.id, 'aria-controls': id + '-panel', onclick: function () { select(s.id); } },
            s.label, h('span', { class: 'tab__n', text: String(s.count) }));
          return t;
        });
        function select(sid, focus) {
          sections.forEach(function (s, i) {
            const on = s.id === sid;
            tabEls[i].setAttribute('aria-selected', String(on));
            tabEls[i].tabIndex = on ? 0 : -1;
            if (on) {
              panel.id = id + '-panel';
              panel.setAttribute('aria-labelledby', tabEls[i].id);
              panel.replaceChildren(s.render());
              if (focus) tabEls[i].focus();
            }
          });
        }
        list.addEventListener('keydown', function (e) {
          const cur = tabEls.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
          let n = -1;
          if (e.key === 'ArrowRight') n = (cur + 1) % tabEls.length;
          else if (e.key === 'ArrowLeft') n = (cur - 1 + tabEls.length) % tabEls.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabEls.length - 1;
          if (n < 0) return;
          e.preventDefault();
          select(sections[n].id, true);
        });
        list.append.apply(list, tabEls);
        tabsWrap.append(list, panel);
        body.append(tabsWrap);
        select(sections[0].id);
      }

      const closeBtn = h('button', { class: 'pm__close', type: 'button', 'aria-label': 'Cerrar', onclick: close }, icon('close'));
      dialog = h('div', { class: 'pm__dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': id + '-title', tabindex: '-1' },
        h('div', { class: 'pm__inner' },
          h('div', { class: 'pm__bar' }, h('span', { class: 'pm__flag', text: 'Proyecto concepto' }), closeBtn),
          h('div', { class: 'pm__scroll' }, body)));
      root = h('div', { class: 'pm' }, h('div', { class: 'pm__backdrop', 'aria-hidden': 'true', onclick: close }), dialog);
      document.body.append(root);
      lockScroll();
      closeBtn.focus();
    }

    return {
      open: open,
      isOpen: function () { return !!root; },
      key: function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'Tab') trapTab(e, dialog);
      }
    };
  })();

  // Un solo manejador de teclado: la capa superior (lightbox > modal > menú) gana.
  document.addEventListener('keydown', function (e) {
    if (Lightbox.isOpen()) { Lightbox.key(e); return; }
    if (Modal.isOpen()) { Modal.key(e); return; }
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); navToggle.focus(); }
  });

  /* ------------------------------------------------------------------
     Sitios web
     ------------------------------------------------------------------ */

  (function initProjects() {
    const ul = $('#projects');
    PROJECTS.forEach(function (p) {
      ul.append(h('li', null,
        h('button', { class: 'proj', type: 'button', 'aria-haspopup': 'dialog', onclick: function (e) { Modal.open(p, e.currentTarget); } },
          h('div', { class: 'proj__img' }, img(p.image, 'Mockup del sitio de ' + p.name + ' en una laptop', { width: 1200, height: 800 })),
          h('h4', { class: 'proj__name', text: p.name }),
          h('p', { class: 'proj__cat', text: p.category }))));
    });
  })();

  /* ------------------------------------------------------------------
     Habilidades
     ------------------------------------------------------------------ */

  (function initSkills() {
    const wrap = $('#bars');
    const fills = SKILLS.map(function (s) {
      const fill = h('div', { class: 'bar__fill' });
      wrap.append(h('div', { class: 'bar' },
        h('div', { class: 'bar__head' }, h('span', { text: s.label }), h('span', { text: s.value + '%' })),
        h('div', { class: 'bar__track', role: 'progressbar', 'aria-label': s.label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(s.value) }, fill)));
      return { fill: fill, value: s.value };
    });
    function fillAll() { fills.forEach(function (f) { f.fill.style.width = f.value + '%'; }); }
    if (reduceMotion || !('IntersectionObserver' in window)) { fillAll(); return; }
    const io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { fillAll(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(wrap);
  })();

  /* ------------------------------------------------------------------
     Servicios: imágenes desde CREATIVE_BRANDS
     ------------------------------------------------------------------ */

  (function initServices() {
    const dental = BRANDS.find(function (b) { return b.name === 'Dental Clinic'; });
    const terra = BRANDS.find(function (b) { return b.name === 'Terra Inmobiliaria'; });
    const srcs = {
      'dental-post': terra && terra.mockups[0],
      'terra-carousel': (window.CREATIVE_BRANDS || []).find(b => b.name === 'Tertulia GDL')?.mockups.find(m => m.src.includes('carrusel'))
    };
    $$('img[data-service]').forEach(function (el) {
      const it = srcs[el.dataset.service];
      if (it) { el.src = it.src; if (it.alt) el.alt = it.alt; }
      else el.closest('.service__img').hidden = true;
    });
  })();

  /* ------------------------------------------------------------------
     Ubicación
     ------------------------------------------------------------------ */

  (function initLocation() {
    const list = $('#contact-info');
    if (!list) return;
    list.append(h('li', null,
      h('span', { class: 'info__icon' }, icon('pin')),
      h('span', null, h('span', { class: 'info__label', text: 'Ubicación' }), h('span', { class: 'info__value', text: LOCATION }))
    ));
  })();

  /* ------------------------------------------------------------------
     Cursor personalizado (solo puntero fino, sin reduced motion)
     ------------------------------------------------------------------ */

  (function initCursor() {
    if (!finePointer || isTouch || reduceMotion) return;
    const dot = h('div', { class: 'cursor-dot', 'aria-hidden': 'true' });
    const ring = h('div', { class: 'cursor-ring', 'aria-hidden': 'true' });
    document.body.append(ring, dot);
    document.documentElement.classList.add('has-cursor');
    let mx = 0, my = 0, rx = 0, ry = 0, started = false;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!started) { started = true; rx = mx; ry = my; document.body.classList.add('cursor-on'); }
      ring.classList.toggle('is-hover', !!e.target.closest('a, button, .tile, .proj, [role="tab"], label'));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on'); started = false; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  })();
})();
