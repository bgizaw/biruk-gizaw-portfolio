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

function createDetailGalleryPoem(text, sectionEl) {
  const poem = document.createElement('blockquote');
  poem.className = 'detail-gallery-poem';
  poem.setAttribute('aria-label', 'Poem');

  const POEM_FADE_MS = 1000;
  const LEAVE_DEBOUNCE_MS = 140;
  const section = sectionEl || poem;

  const lines = text.split('\n').map((line, index) => {
    const lineEl = document.createElement('p');
    lineEl.className = 'detail-gallery-poem-line';
    lineEl.style.setProperty('--line-index', String(index));
    lineEl.textContent = line;
    poem.appendChild(lineEl);
    return lineEl;
  });

  let sectionActive = false;
  let revealedCount = 0;
  let hideTimer = null;
  let leaveTimer = null;
  let onScroll = null;

  function revealThrough(count) {
    const next = Math.min(lines.length, Math.max(revealedCount, count));
    if (next === revealedCount) return;
    revealedCount = next;
    for (let i = 0; i < next; i++) {
      lines[i].classList.add('is-visible');
    }
  }

  function syncRevealFromScroll() {
    if (!sectionActive || poem.classList.contains('is-hiding')) return;

    const rootRect = root.getBoundingClientRect();
    const poemRect = poem.getBoundingClientRect();
    const viewportH = rootRect.height;

    let lastInView = -1;
    let needsLayoutRetry = false;

    lines.forEach((lineEl, index) => {
      const { top, bottom, height } = lineEl.getBoundingClientRect();
      if (height === 0) {
        needsLayoutRetry = true;
        return;
      }
      if (bottom > rootRect.top && top < rootRect.bottom) {
        lastInView = index;
      }
    });

    if (lastInView >= 0) {
      revealThrough(lastInView + 1);
      if (!needsLayoutRetry) return;
    }

    const poemSettled =
      poemRect.height > 0 &&
      poemRect.top <= rootRect.top + viewportH * 0.55 &&
      poemRect.bottom >= rootRect.top + viewportH * 0.12;

    if (poemSettled) {
      revealThrough(lines.length);
      if (!needsLayoutRetry) return;
    }

    const bandStart = rootRect.bottom - viewportH * 0.05;
    const bandEnd = rootRect.top + viewportH * 0.4;
    const poemTop = poemRect.top;

    if (poemRect.height > 0 && poemTop < bandStart) {
      const span = bandStart - bandEnd;
      const progress = span > 0 ? Math.min(1, (bandStart - poemTop) / span) : 1;
      revealThrough(Math.max(1, Math.ceil(progress * lines.length)));
    }

    if (needsLayoutRetry) {
      requestAnimationFrame(syncRevealFromScroll);
    }
  }

  function armScrollSync() {
    if (onScroll) return;
    onScroll = syncRevealFromScroll;
    root.addEventListener('scroll', onScroll, { passive: true });
  }

  function disarmScrollSync() {
    if (!onScroll) return;
    root.removeEventListener('scroll', onScroll);
    onScroll = null;
  }

  function activateSection() {
    clearTimeout(hideTimer);
    hideTimer = null;
    clearTimeout(leaveTimer);
    leaveTimer = null;
    poem.classList.remove('is-hiding');
    sectionActive = true;
    revealedCount = 0;
    lines.forEach((lineEl) => lineEl.classList.remove('is-visible'));
    syncRevealFromScroll();
    requestAnimationFrame(() => {
      syncRevealFromScroll();
      requestAnimationFrame(syncRevealFromScroll);
    });
    armScrollSync();
  }

  function deactivateSection() {
    sectionActive = false;
    disarmScrollSync();
    poem.classList.add('is-hiding');
    hideTimer = setTimeout(() => {
      hideTimer = null;
      if (inSection || sectionActive) return;
      revealedCount = 0;
      lines.forEach((lineEl) => lineEl.classList.remove('is-visible'));
      poem.classList.remove('is-hiding');
    }, POEM_FADE_MS);
  }

  let inSection = false;
  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (!inSection) {
          inSection = true;
          activateSection();
        }
        return;
      }

      if (!inSection) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        leaveTimer = null;
        inSection = false;
        deactivateSection();
      }, LEAVE_DEBOUNCE_MS);
    },
    {
      root,
      rootMargin: '0px 0px 45% 0px',
      threshold: 0,
    },
  );

  sectionObserver.observe(section);

  return poem;
}

function createDawnMusicPlayer({ src, cover, title = 'Uiverse Anthem', artist = 'NKS' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'dawn-music-player';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Music player');

  const audio = document.createElement('audio');
  audio.className = 'dawn-music-player__audio';
  audio.preload = 'metadata';
  if (src) audio.src = src;

  const musicBar = document.createElement('div');
  musicBar.className = 'dawn-music-player__music-bar';

  const music = document.createElement('div');
  music.className = 'dawn-music-player__music';

  const coverTile = document.createElement('div');
  coverTile.className = 'dawn-music-player__cover-tile';
  if (cover) {
    const coverImg = document.createElement('img');
    coverImg.className = 'dawn-music-player__cover';
    coverImg.src = cover;
    coverImg.alt = `${title} album cover`;
    coverTile.append(coverImg);
  }
  music.append(coverTile);

  const meta = document.createElement('div');
  meta.className = 'dawn-music-player__meta';

  const titleEl = document.createElement('span');
  titleEl.className = 'dawn-music-player__title';
  titleEl.textContent = title;

  meta.appendChild(titleEl);
  if (artist) {
    const artistEl = document.createElement('span');
    artistEl.className = 'dawn-music-player__artist';
    artistEl.textContent = artist;
    meta.appendChild(artistEl);
  }
  music.append(meta);

  const musicControl = document.createElement('div');
  musicControl.className = 'dawn-music-player__music-control';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'dawn-music-player__btn dawn-music-player__btn--skip';
  prevBtn.setAttribute('aria-label', 'Skip back 10 seconds');
  const prevIcon = document.createElement('img');
  prevIcon.className = 'dawn-music-player__skip-icon';
  prevIcon.src = './assets/dawn-replay-10.png';
  prevIcon.alt = '';
  prevIcon.setAttribute('aria-hidden', 'true');
  prevBtn.append(prevIcon);

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'dawn-music-player__btn dawn-music-player__btn--play';
  playBtn.setAttribute('aria-label', 'Play');
  playBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  `;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'dawn-music-player__btn dawn-music-player__btn--skip';
  nextBtn.setAttribute('aria-label', 'Skip forward 10 seconds');
  const nextIcon = document.createElement('img');
  nextIcon.className = 'dawn-music-player__skip-icon';
  nextIcon.src = './assets/dawn-forward-10.png';
  nextIcon.alt = '';
  nextIcon.setAttribute('aria-hidden', 'true');
  nextBtn.append(nextIcon);

  musicControl.append(prevBtn, playBtn, nextBtn);
  musicBar.append(music, musicControl);

  const progress = document.createElement('div');
  progress.className = 'dawn-music-player__progress';
  progress.tabIndex = 0;
  progress.setAttribute('role', 'slider');
  progress.setAttribute('aria-label', 'Playback position');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  progress.setAttribute('aria-valuenow', '0');

  const track = document.createElement('div');
  track.className = 'dawn-music-player__progress-track';

  const fill = document.createElement('div');
  fill.className = 'dawn-music-player__progress-fill';

  const thumb = document.createElement('div');
  thumb.className = 'dawn-music-player__progress-thumb';

  track.append(fill, thumb);
  progress.append(track);

  wrap.append(audio, musicBar, progress);

  const playPath = playBtn.querySelector('path');
  const PLAY_ICON = 'M8 5v14l11-7z';
  const PAUSE_ICON = 'M6 19h4V5H6zm8 0h4V5h-4z';
  const SKIP_SECONDS = 10;

  function setPlaying(playing) {
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    playPath.setAttribute('d', playing ? PAUSE_ICON : PLAY_ICON);
  }

  prevBtn.addEventListener('click', () => {
    if (!audio.src) return;
    audio.currentTime = Math.max(0, audio.currentTime - SKIP_SECONDS);
    updateSeek();
  });

  nextBtn.addEventListener('click', () => {
    if (!audio.src) return;
    const duration = audio.duration;
    const nextTime = audio.currentTime + SKIP_SECONDS;
    audio.currentTime = Number.isFinite(duration)
      ? Math.min(duration, nextTime)
      : nextTime;
    updateSeek();
  });

  playBtn.addEventListener('click', async () => {
    if (!audio.src) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        /* no source or autoplay blocked */
      }
    } else {
      audio.pause();
    }
  });

  let isScrubbing = false;
  let scrubTargetPercent = 0;
  let wasPlayingBeforeScrub = false;
  let scrubReleaseToken = 0;
  let scrubMoveRaf = 0;
  let seekSettleUntil = 0;

  function getDuration() {
    const duration = audio.duration;
    return Number.isFinite(duration) && duration > 0 ? duration : null;
  }

  function isSeekUiLocked() {
    return isScrubbing || audio.seeking || Date.now() < seekSettleUntil;
  }

  function setSeekPercent(percent) {
    scrubTargetPercent = Math.max(0, Math.min(100, percent));
    progress.style.setProperty('--seek-pct', `${scrubTargetPercent}%`);
    progress.setAttribute('aria-valuenow', String(Math.round(scrubTargetPercent)));
    return scrubTargetPercent;
  }

  function percentFromClientX(clientX) {
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  function seekAudioToPercent(percent) {
    const duration = getDuration();
    if (!audio.src || duration === null) return false;
    audio.currentTime = (percent / 100) * duration;
    return true;
  }

  function queueSeekAudio() {
    if (scrubMoveRaf) return;
    scrubMoveRaf = requestAnimationFrame(() => {
      scrubMoveRaf = 0;
      seekAudioToPercent(scrubTargetPercent);
    });
  }

  function updateSeek() {
    if (isSeekUiLocked()) return;
    const duration = getDuration();
    if (duration === null) {
      setSeekPercent(0);
      return;
    }
    setSeekPercent((audio.currentTime / duration) * 100);
  }

  function bindScrubDocumentListeners() {
    document.addEventListener('pointermove', onDocumentScrubMove, { passive: false });
    document.addEventListener('pointerup', onDocumentScrubEnd);
    document.addEventListener('pointercancel', onDocumentScrubEnd);
  }

  function unbindScrubDocumentListeners() {
    document.removeEventListener('pointermove', onDocumentScrubMove);
    document.removeEventListener('pointerup', onDocumentScrubEnd);
    document.removeEventListener('pointercancel', onDocumentScrubEnd);
  }

  function releaseScrubLock(targetPercent) {
    const token = ++scrubReleaseToken;
    let released = false;
    const finish = () => {
      if (released || token !== scrubReleaseToken) return;
      released = true;
      isScrubbing = false;
      progress.classList.remove('is-scrubbing');
      setSeekPercent(targetPercent);
      seekAudioToPercent(targetPercent);
      seekSettleUntil = Date.now() + 350;
      if (wasPlayingBeforeScrub) {
        audio.play().catch(() => {});
      }
      wasPlayingBeforeScrub = false;
    };

    audio.addEventListener('seeked', finish, { once: true });
    window.setTimeout(finish, 400);
  }

  function applyScrubAt(clientX, { seek = false } = {}) {
    setSeekPercent(percentFromClientX(clientX));
    if (seek) queueSeekAudio();
  }

  function startScrub(clientX, event) {
    if (!audio.src) return;
    if (event?.button !== undefined && event.button !== 0) return;
    event?.preventDefault();
    event?.stopPropagation();

    isScrubbing = true;
    progress.classList.add('is-scrubbing');
    wasPlayingBeforeScrub = !audio.paused;
    if (wasPlayingBeforeScrub) audio.pause();

    applyScrubAt(clientX, { seek: true });
    bindScrubDocumentListeners();

    if (event?.pointerId != null) {
      try {
        progress.setPointerCapture(event.pointerId);
      } catch {
        /* capture unsupported */
      }
    }
  }

  function endScrub(clientX, event) {
    if (!isScrubbing) return;
    event?.preventDefault();

    unbindScrubDocumentListeners();
    if (scrubMoveRaf) {
      cancelAnimationFrame(scrubMoveRaf);
      scrubMoveRaf = 0;
    }

    if (event?.pointerId != null) {
      try {
        progress.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }

    const targetPercent = setSeekPercent(percentFromClientX(clientX));
    seekAudioToPercent(targetPercent);
    seekSettleUntil = Date.now() + 500;
    releaseScrubLock(targetPercent);
  }

  function onProgressPointerDown(event) {
    startScrub(event.clientX, event);
  }

  function onDocumentScrubMove(event) {
    if (!isScrubbing) return;
    event.preventDefault();
    applyScrubAt(event.clientX, { seek: true });
  }

  function onDocumentScrubEnd(event) {
    if (!isScrubbing) return;
    endScrub(event.clientX, event);
  }

  progress.addEventListener('pointerdown', onProgressPointerDown, { passive: false });

  progress.addEventListener('keydown', (event) => {
    if (!audio.src) return;
    const duration = getDuration();
    if (duration === null) return;
    const step = event.shiftKey ? 10 : 5;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      audio.currentTime = Math.min(duration, audio.currentTime + step);
      updateSeek();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - step);
      updateSeek();
    } else if (event.key === 'Home') {
      event.preventDefault();
      audio.currentTime = 0;
      updateSeek();
    } else if (event.key === 'End') {
      event.preventDefault();
      audio.currentTime = duration;
      updateSeek();
    }
  });

  audio.addEventListener('timeupdate', updateSeek);
  audio.addEventListener('loadedmetadata', updateSeek);
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => {
    setPlaying(false);
    setSeekPercent(0);
  });

  setSeekPercent(0);

  return wrap;
}

function createDetailPortfolioArticle(item, imageOptions, layoutIndex, colorOptions = {}) {
  const alignment = ALIGNMENTS[layoutIndex % ALIGNMENTS.length];
  const refItem = MEDIA[layoutIndex];
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
  const imageWrap = createImageWrap(item, { cover: true, ...imageOptions, dominantColor });
  if (imageOptions.zoomOrigin || imageOptions.zoomScale) {
    imageWrap.classList.add('gallery-zoom');
    if (imageOptions.zoomOrigin) {
      imageWrap.style.setProperty('--zoom-origin', imageOptions.zoomOrigin);
    }
    if (imageOptions.zoomScale) {
      imageWrap.style.setProperty('--zoom-scale', imageOptions.zoomScale);
    }
    if (imageOptions.zoomOffset) {
      imageWrap.style.setProperty('--zoom-offset-x', imageOptions.zoomOffset.x ?? '0');
      imageWrap.style.setProperty('--zoom-offset-y', imageOptions.zoomOffset.y ?? '0');
    }
  }
  figure.appendChild(imageWrap);
  article.appendChild(figure);

  return article;
}

function getOutfitId() {
  return new URLSearchParams(window.location.search).get('id');
}

function createDetailHeroTitle(text) {
  const title = document.createElement('h1');
  title.className = 'detail-hero__dawn-title';
  title.textContent = text;
  return title;
}

function renderDetail(item, id) {
  const pageTitle = item.detailHeroTitle ?? item.title;
  document.title = `${pageTitle} — ${SITE.name}`;

  setColors(item.topColor, item.bottomColor);

  const outfitIndex = Number(id);

  const hero = document.createElement('article');
  hero.className = 'detail-hero';
  if (item.detailEmptyHero) {
    hero.classList.add('detail-hero--empty');
    if (item.detailHeroTitle) {
      hero.classList.add('detail-hero--dawn');
      hero.appendChild(createDetailHeroTitle(item.detailHeroTitle));
    }
  } else if (item.detailHeroPlain) {
    hero.classList.add('detail-hero--plain');
  } else if (id === '1' || id === '2' || id === '3') {
    hero.classList.add('detail-hero--center-zoom');
  }
  if (item.heroZoomScale) {
    hero.style.setProperty('--hero-zoom', item.heroZoomScale);
  }
  if (item.heroZoomOffset) {
    hero.style.setProperty('--hero-zoom-offset-x', item.heroZoomOffset.x ?? '0');
    hero.style.setProperty('--hero-zoom-offset-y', item.heroZoomOffset.y ?? '0');
  }
  hero.dataset.topColor = item.topColor;
  hero.dataset.bottomColor = item.bottomColor;

  if (!item.detailEmptyHero) {
    const figure = document.createElement('figure');
    figure.appendChild(
      createImageWrap(item, { priority: true, plain: Boolean(item.detailHeroPlain) }),
    );
    figure.appendChild(createDetailCaption(item));
    hero.appendChild(figure);
  }
  root.appendChild(hero);

  const gallery = item.gallery ?? [];
  gallery.forEach((entry, index) => {
    const src = typeof entry === 'string' ? entry : entry.src;
    const alt =
      typeof entry === 'string' ? `${item.alt} — photo ${index + 2}` : entry.alt;
    const zoomOrigin = typeof entry === 'object' ? entry.zoomOrigin : undefined;
    const zoomOffset = typeof entry === 'object' ? entry.zoomOffset : undefined;
    const zoomScale = typeof entry === 'object' ? entry.zoomScale : undefined;
    const colorOptions =
      typeof entry === 'object'
        ? {
            topColor: entry.topColor,
            bottomColor: entry.bottomColor,
            dominantColor: entry.dominantColor,
          }
        : {};

    const article = createDetailPortfolioArticle(
      item,
      { src, alt, zoomOrigin, zoomOffset, zoomScale },
      outfitIndex + 1 + index,
      colorOptions,
    );

    if (id === '4') {
      const row = document.createElement('div');
      row.className = 'detail-gallery-row detail-gallery-row--dawn';
      if (index % 2 === 1) {
        row.classList.add('detail-gallery-row--reverse');
      }
      if (typeof entry === 'object' && entry.src?.includes('dawn-wind')) {
        row.classList.add('detail-gallery-row--wind');
      }

      const sunStack = document.createElement('div');
      sunStack.className = 'detail-gallery-sun-stack';
      sunStack.append(article);

      const poemText = typeof entry === 'object' && entry.poem ? entry.poem : null;
      if (poemText) {
        const poemStack = document.createElement('div');
        poemStack.className = 'detail-gallery-poem-stack';
        poemStack.append(createDetailGalleryPoem(poemText, row));

        const musicOptions =
          index === 0
            ? {
                src: item.dawnMusicSrc,
                cover: item.dawnMusicCover,
                title: item.dawnMusicTitle,
                artist: item.dawnMusicArtist,
              }
            : typeof entry === 'object' && entry.musicSrc
              ? {
                  src: entry.musicSrc,
                  cover: entry.musicCover,
                  title: entry.musicTitle,
                  artist: entry.musicArtist,
                }
              : null;

        if (musicOptions?.src) {
          poemStack.append(createDawnMusicPlayer(musicOptions));
        }

        row.append(sunStack, poemStack);
      } else {
        row.append(sunStack);
      }

      root.appendChild(row);
    } else {
      root.appendChild(article);
    }
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

const outfitId = getOutfitId();
const item = getMediaItem(outfitId);

initViewportMode();

if (!item) {
  window.location.replace('index.html');
} else {
  renderDetail(item, outfitId);
  populateInfoPanel();
  bindDetailColorTransitions();
  bindInfoPanel();
}
