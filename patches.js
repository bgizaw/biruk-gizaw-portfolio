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

const state = {
  colors: { top: '#0A0A0F', bottom: '#593a2a' },
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

function createPatchCaption(item) {
  const caption = document.createElement('figcaption');
  caption.style.setProperty('--caption-align', CAPTION_ALIGN[String(item.alignment)]);

  const textWrap = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = item.title;
  textWrap.appendChild(title);

  if (item.aside) {
    const aside = document.createElement('aside');
    aside.textContent = item.aside;
    caption.append(textWrap, aside);
  } else {
    caption.appendChild(textWrap);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      caption.classList.toggle('is-visible', entry.isIntersecting);
    },
    {
      root,
      rootMargin: '-35% 0px 0px 0px',
      threshold: 0,
    },
  );

  observer.observe(caption);
  return caption;
}

function createPatchCard(item, index, ...children) {
  if (item.noDetail) {
    const card = document.createElement('div');
    card.className = 'portfolio-card portfolio-card--static';
    children.forEach((child) => card.appendChild(child));
    return card;
  }

  const link = document.createElement('a');
  link.className = 'portfolio-card';
  link.href = getPatchDetailUrl(index);
  link.setAttribute('aria-label', `View ${item.title}`);
  link.addEventListener('click', () => {
    stashPageId(PAGE_ID_STORAGE_KEYS.patch, index);
  });
  children.forEach((child) => link.appendChild(child));
  return link;
}

function createPatchHeroArticle(item, index) {
  const article = document.createElement('article');
  article.className = 'hero patch-hero';
  article.dataset.topColor = item.topColor;
  article.dataset.bottomColor = item.bottomColor;

  const figure = document.createElement('figure');
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  inner.appendChild(createImageWrap(item, { priority: true, plain: true }));

  figure.appendChild(createPatchCard(item, index, inner, createPatchCaption(item)));
  article.appendChild(figure);
  return article;
}

function createPatchArticle(item, index) {
  const article = document.createElement('article');
  article.className = 'portfolio patch';
  if (item.isTop) article.classList.add('is-top');

  article.style.setProperty('--justify', ALIGN_MAP[String(item.alignment)]);
  article.style.setProperty('--align', ALIGN_MAP[String(item.alignment)]);
  article.dataset.topColor = item.topColor;
  article.dataset.bottomColor = item.bottomColor;

  const figure = document.createElement('figure');
  figure.appendChild(
    createPatchCard(
      item,
      index,
      createImageWrap(item, { cover: true, plain: true }),
      createPatchCaption(item),
    ),
  );
  article.appendChild(figure);
  return article;
}

function setColorsWithState(top, bottom) {
  if (state.colors.top === top && state.colors.bottom === bottom) return;
  state.colors = { top, bottom };
  setColors(top, bottom);
}

function getArticleScrollProgress(article, scrollRoot) {
  const rootRect = scrollRoot.getBoundingClientRect();
  const articleRect = article.getBoundingClientRect();
  const total = articleRect.height + rootRect.height;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, (rootRect.bottom - articleRect.top) / total));
}

function bindColorTransitions() {
  const articles = Array.from(root.querySelectorAll('article'));
  if (!articles.length) return;

  setColorsWithState(articles[0].dataset.topColor, articles[0].dataset.bottomColor);

  const update = () => {
    if (isInfoPanelBgActive()) return;

    let activeArticle = null;
    let activeDistance = Infinity;

    articles.forEach((article, index) => {
      const progress = getArticleScrollProgress(article, root);
      const min = index === 0 ? 0 : 0.25;
      const max = 0.75;

      if (progress >= min && progress <= max) {
        const distance = Math.abs(progress - 0.5);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeArticle = article;
        }
      }
    });

    if (activeArticle) {
      setColorsWithState(activeArticle.dataset.topColor, activeArticle.dataset.bottomColor);
    }
  };

  root.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function renderPatches() {
  const heroHeight = window.innerHeight;
  document.documentElement.style.setProperty('--hero-height', `${heroHeight}px`);

  const header = document.createElement('div');
  header.className = 'patches-header';
  const heading = document.createElement('h1');
  heading.textContent = 'Patches';
  header.appendChild(heading);
  root.appendChild(header);

  PATCHES.forEach((item, index) => {
    const article =
      index === 0 ? createPatchHeroArticle(item, index) : createPatchArticle(item, index);
    if (index === 0) {
      article.style.minHeight = `${heroHeight}px`;
      article.style.height = `${heroHeight}px`;
    }
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

window.addEventListener('resize', () => {
  const hero = root.querySelector('.patch-hero');
  if (hero) {
    const heroHeight = window.innerHeight;
    document.documentElement.style.setProperty('--hero-height', `${heroHeight}px`);
    hero.style.minHeight = `${heroHeight}px`;
    hero.style.height = `${heroHeight}px`;
  }
});

initViewportMode();
renderPatches();
populateInfoPanel();
bindColorTransitions();
bindInfoPanel();
