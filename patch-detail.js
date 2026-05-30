const state = {
  infoOpen: false,
};

const root = document.getElementById('root');
const siteTop = document.getElementById('site-top');
const infoPanel = document.getElementById('info-panel');
const infoImageWrap = document.getElementById('info-image-wrap');
const infoImage = document.getElementById('info-image');
const infoBio = document.getElementById('info-bio');
const infoContact = document.getElementById('info-contact');
let siteMenu;

const ALIGN_MAP = {
  '-1': 'flex-start',
  '0': 'center',
  '1': 'flex-end',
};

const CAPTION_ALIGN = {
  '-1': 'flex-start',
  '0': 'flex-end',
  '1': 'flex-end',
};

function createDetailCaption(item) {
  const caption = document.createElement('figcaption');
  caption.style.setProperty('--caption-align', CAPTION_ALIGN[String(item.alignment)]);

  const textWrap = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = item.title;
  textWrap.appendChild(title);

  const aside = document.createElement('aside');
  aside.textContent = item.aside;
  caption.append(textWrap, aside);
  return caption;
}

function createPatchGalleryArticle(item, imageOptions, layoutIndex, colorOptions = {}) {
  const alignment = ALIGNMENTS[layoutIndex % ALIGNMENTS.length];
  const refItem = PATCHES[layoutIndex % PATCHES.length];
  const article = document.createElement('article');
  article.className = 'portfolio';
  if (refItem?.isTop) article.classList.add('is-top');

  const topColor = colorOptions.topColor ?? item.topColor;
  const bottomColor = colorOptions.bottomColor ?? item.bottomColor;
  const dominantColor = colorOptions.dominantColor ?? item.dominantColor;

  article.style.setProperty('--justify', ALIGN_MAP[String(alignment)]);
  article.style.setProperty('--align', ALIGN_MAP[String(alignment)]);
  article.dataset.topColor = topColor;
  article.dataset.bottomColor = bottomColor;

  const figure = document.createElement('figure');
  const imageWrap = createImageWrap(item, { cover: true, plain: true, ...imageOptions, dominantColor });
  figure.appendChild(imageWrap);
  article.appendChild(figure);

  return article;
}

function isVideoPatch(item, id) {
  const patchIndex = Number(id);
  return patchIndex === 0 || Boolean(item.youtubeId);
}

function canEmbedYouTubeInline() {
  const { protocol, origin } = window.location;
  return (
    (protocol === 'http:' || protocol === 'https:') &&
    origin &&
    origin !== 'null' &&
    !origin.startsWith('file:')
  );
}

function buildYouTubeEmbedUrl(videoId) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (canEmbedYouTubeInline()) {
    params.set('origin', window.location.origin);
  }
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function renderPatchVideoDetail(item) {
  document.title = `${item.title} — ${SITE.name}`;
  setColors(item.topColor, item.bottomColor);
  document.body.classList.add('patch-detail-page--video');

  const videoId = item.youtubeId ?? 'hd2agiiOhhc';
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const section = document.createElement('section');
  section.className = 'patch-detail-video';
  section.dataset.topColor = item.topColor;
  section.dataset.bottomColor = item.bottomColor;

  const inner = document.createElement('div');
  inner.className = 'patch-detail-video__inner';

  if (canEmbedYouTubeInline()) {
    const iframe = document.createElement('iframe');
    iframe.className = 'patch-detail-video__embed';
    iframe.src = buildYouTubeEmbedUrl(videoId);
    iframe.title = `${item.title} — video`;
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    );
    inner.appendChild(iframe);
  } else {
    inner.classList.add('patch-detail-video__inner--fallback');

    const link = document.createElement('a');
    link.className = 'patch-detail-video__fallback';
    link.href = watchUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Watch ${item.title} on YouTube`);

    const thumb = document.createElement('img');
    thumb.className = 'patch-detail-video__thumb';
    thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumb.alt = '';
    thumb.width = 1280;
    thumb.height = 720;
    thumb.loading = 'eager';

    const play = document.createElement('span');
    play.className = 'patch-detail-video__play';
    play.setAttribute('aria-hidden', 'true');
    play.textContent = 'Play on YouTube';

    link.append(thumb, play);
    inner.appendChild(link);
  }

  section.appendChild(inner);
  root.appendChild(section);
}

function renderPatchDetail(item, id) {
  document.title = `${item.title} — ${SITE.name}`;
  setColors(item.topColor, item.bottomColor);

  const patchIndex = Number(id);

  const hero = document.createElement('article');
  hero.className = 'detail-hero detail-hero--plain';
  hero.dataset.topColor = item.topColor;
  hero.dataset.bottomColor = item.bottomColor;

  const figure = document.createElement('figure');
  figure.append(
    createImageWrap(item, { priority: true, plain: true }),
    createDetailCaption(item),
  );
  hero.appendChild(figure);
  root.appendChild(hero);

  const gallery = item.gallery ?? [];
  gallery.forEach((entry, index) => {
    const src = typeof entry === 'string' ? entry : entry.src;
    const alt =
      typeof entry === 'string' ? `${item.alt} — photo ${index + 2}` : entry.alt;
    const colorOptions =
      typeof entry === 'object'
        ? {
            topColor: entry.topColor,
            bottomColor: entry.bottomColor,
            dominantColor: entry.dominantColor,
          }
        : {};

    const article = createPatchGalleryArticle(
      item,
      { src, alt },
      patchIndex + 1 + index,
      colorOptions,
    );
    root.appendChild(article);
  });
}

function populateInfoPanel() {
  infoImage.src = SITE.infoImage;
  infoImage.alt = SITE.infoImageAlt;
  infoImage.addEventListener('load', () => infoImageWrap.classList.add('is-loaded'));
  if (infoImage.complete) infoImageWrap.classList.add('is-loaded');

  infoBio.innerHTML = `<p>${SITE.description}</p>`;
  infoContact.innerHTML = `
    <p>${SITE.phone}</p>
    <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
    <p><a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a></p>
  `;
}

function setInfoOpen(open) {
  state.infoOpen = open;
  infoPanel.classList.toggle('is-active', open);
  infoPanel.setAttribute('aria-hidden', String(!open));
  siteTop.classList.toggle('is-active', open);
  document.documentElement.classList.toggle('no-scroll', open);
  setInfoPanelBackground(open);
  siteMenu?.updateToggleLabel();

  if (!open) {
    window.setTimeout(() => {
      infoPanel.scrollTop = 0;
    }, 1000);
  }
}

function bindInfoPanel() {
  siteMenu = bindSiteMenu({
    onInfo: () => setInfoOpen(true),
    isInfoOpen: () => state.infoOpen,
    closeInfo: () => setInfoOpen(false),
  });
}

function bindDetailColorTransitions() {
  const articles = Array.from(root.querySelectorAll('article'));
  if (articles.length === 0) return;

  const update = () => {
    if (isInfoPanelBgActive()) return;

    let activeArticle = articles[0];
    let activeDistance = Infinity;

    articles.forEach((article) => {
      const rect = article.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
      if (distance < activeDistance) {
        activeDistance = distance;
        activeArticle = article;
      }
    });

    setColors(activeArticle.dataset.topColor, activeArticle.dataset.bottomColor);
  };

  root.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

const patchId = parsePageId(PAGE_ID_STORAGE_KEYS.patch);
const item = getPatchItem(patchId);

initViewportMode();

if (!item || item.noDetail) {
  window.location.replace('/patches.html');
} else {
  if (isVideoPatch(item, patchId)) {
    renderPatchVideoDetail(item);
  } else {
    renderPatchDetail(item, patchId);
    bindDetailColorTransitions();
  }
  populateInfoPanel();
  bindInfoPanel();
}
