function createSiteTitle({ link = false } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'site-title';

  const heading = document.createElement('h1');
  if (link) {
    const anchor = document.createElement('a');
    anchor.href = 'index.html';
    anchor.textContent = SITE.name;
    heading.appendChild(anchor);
  } else {
    heading.textContent = SITE.name;
  }

  const subtitle = document.createElement('p');
  subtitle.className = 'site-title__subtitle';
  subtitle.textContent = SITE.subtitle;

  wrap.append(heading, subtitle);
  return wrap;
}

function parseHexColor(input) {
  if (!input) return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(input).trim());
  if (!match) return null;

  let digits = match[1];
  if (digits.length === 3) {
    digits = digits
      .split('')
      .map((channel) => channel + channel)
      .join('');
  }

  return [
    Number.parseInt(digits.slice(0, 2), 16),
    Number.parseInt(digits.slice(2, 4), 16),
    Number.parseInt(digits.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]) {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(luminanceA, luminanceB) {
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickNavColor(backgroundColor) {
  const rgb = parseHexColor(backgroundColor);
  if (!rgb) return '#ffffff';

  const backgroundLuminance = relativeLuminance(rgb);
  const whiteContrast = contrastRatio(backgroundLuminance, relativeLuminance([255, 255, 255]));
  const blackContrast = contrastRatio(backgroundLuminance, relativeLuminance([0, 0, 0]));

  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}

function setSiteNavColor(backgroundColor) {
  document.documentElement.style.setProperty('--site-nav-color', pickNavColor(backgroundColor));
}

function setColors(top, bottom) {
  document.documentElement.style.setProperty('--bgFrom', top);
  document.documentElement.style.setProperty('--bgTo', bottom);
  setSiteNavColor(top);
}

function createImageWrap(
  item,
  { cover = false, priority = false, plain = false, src, alt, dominantColor } = {},
) {
  const wrap = document.createElement('div');
  wrap.className = `image-wrap${cover ? ' is-cover' : ''}${plain ? ' image-wrap--plain' : ''}`;
  wrap.style.setProperty('--dominantColor', dominantColor ?? item.dominantColor);

  const img = document.createElement('img');
  img.src = src ?? item.url;
  img.alt = alt ?? item.alt;
  if (priority) img.fetchPriority = 'high';
  img.loading = priority ? 'eager' : 'lazy';
  img.decoding = 'async';

  img.addEventListener('load', () => {
    wrap.classList.add('is-loaded');
  });

  if (img.complete) {
    wrap.classList.add('is-loaded');
  }

  if (plain) {
    wrap.append(img);
  } else {
    const reveal = document.createElement('span');
    reveal.className = 'image-reveal';
    wrap.append(img, reveal);
  }

  return wrap;
}

function getMediaItem(id) {
  const index = Number(id);
  if (!Number.isInteger(index) || index < 0 || index >= MEDIA.length) {
    return null;
  }
  return MEDIA[index];
}

function getDetailUrl(index) {
  return `detail.html?id=${index}`;
}

function normalizePathname() {
  return (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
}

function normalizePageHref() {
  return (window.location.href || '').split('?')[0].split('#')[0].toLowerCase();
}

function isIndexPage() {
  const path = normalizePathname();
  const href = normalizePageHref();

  if (path.includes('patches') || path.includes('detail')) return false;
  if (href.includes('patches.html') || href.includes('detail.html')) return false;

  if (path.endsWith('/index.html') || href.endsWith('/index.html')) return true;
  if (path.endsWith('/index') || href.endsWith('/index')) return true;

  const segment = path.split('/').filter(Boolean).pop() || '';
  if (segment === 'index.html' || segment === 'index') return true;
  if (segment === '' || path === '/' || path.endsWith('/')) return true;

  // file:// or dev server opened at project folder without index.html in URL
  if (!segment.includes('.')) return true;

  return false;
}

function isPatchesPage() {
  const path = normalizePathname();
  const href = normalizePageHref();
  return path.includes('patches') || href.includes('patches.html');
}

function hideMenuItem(item) {
  if (!item) return;
  item.hidden = true;
  item.setAttribute('aria-hidden', 'true');
  item.classList.add('site-menu__item--hidden');
  item.remove();
}

function bindSiteMenu({ onInfo, isInfoOpen, closeInfo } = {}) {
  const menuWrap = document.getElementById('site-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const menuDropdown = document.getElementById('menu-dropdown');
  if (!menuWrap || !menuToggle || !menuDropdown) return;

  let menuOpen = false;

  function setMenuOpen(open) {
    menuOpen = open;
    menuWrap.classList.toggle('is-open', open);
    menuDropdown.hidden = !open;
    menuDropdown.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  function updateToggleLabel() {
    if (isInfoOpen?.()) {
      menuToggle.textContent = 'Close';
      return;
    }
    menuToggle.textContent = 'Menu';
  }

  menuToggle.addEventListener('click', () => {
    if (isInfoOpen?.()) {
      closeInfo?.();
      return;
    }
    setMenuOpen(!menuOpen);
  });

  const infoItem = menuDropdown.querySelector('[data-menu-action="info"]');
  if (infoItem && onInfo) {
    infoItem.addEventListener('click', () => {
      setMenuOpen(false);
      onInfo();
    });
  }

  const fashionLink = menuDropdown.querySelector('[data-menu-action="fashion"]');
  const patchesLink = menuDropdown.querySelector('[data-menu-action="patches"]');

  if (fashionLink && isIndexPage()) {
    hideMenuItem(fashionLink);
  } else if (fashionLink) {
    fashionLink.addEventListener('click', () => {
      setMenuOpen(false);
    });
  }

  if (patchesLink && isPatchesPage()) {
    hideMenuItem(patchesLink);
  } else if (patchesLink) {
    patchesLink.addEventListener('click', () => {
      setMenuOpen(false);
    });
  }

  document.addEventListener('click', (event) => {
    if (!menuOpen) return;
    if (!menuWrap.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code !== 'Escape') return;
    if (isInfoOpen?.()) {
      closeInfo?.();
      return;
    }
    if (menuOpen) {
      setMenuOpen(false);
    }
  });

  return { setMenuOpen, updateToggleLabel };
}

/** Matches styles.css breakpoint at 720px — toggles html.is-mobile / html.is-desktop */
function initViewportMode() {
  const query = window.matchMedia('(max-width: 720px)');
  const apply = () => {
    document.documentElement.classList.toggle('is-mobile', query.matches);
    document.documentElement.classList.toggle('is-desktop', !query.matches);
  };
  apply();
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', apply);
  } else if (typeof query.addListener === 'function') {
    query.addListener(apply);
  }
}
