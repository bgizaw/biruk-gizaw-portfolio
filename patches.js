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

initViewportMode();
setColors('#0A0A0F', '#593a2a');
populateInfoPanel();
bindInfoPanel();
