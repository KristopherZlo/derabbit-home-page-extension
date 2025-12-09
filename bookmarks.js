let bookmarkFolderId = null;
const FAVICON_CACHE_KEY = 'faviconCache';
const FAVICON_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const FALLBACK_FAVICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="6" fill="%23c0c0c0"/><circle cx="12" cy="12" r="6" fill="%23888888"/></svg>';
const FAVICON_SOURCES = [
  (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
  (hostname) => `https://www.google.com/s2/favicons?domain=${hostname}&sz=24`
];
let draggedBookmarkId = null;
let dropIndicator = null;
let dropTargetIndex = null;
let containerDnDAttached = false;

function loadCache() {
  try {
    const raw = localStorage.getItem(FAVICON_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) => value && value.data && now - value.ts < FAVICON_TTL
      )
    );
  } catch (e) {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

const faviconCache = loadCache();

function cacheFromImage(hostname, imgEl) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, 24, 24);
    const dataUrl = canvas.toDataURL('image/png');
    faviconCache[hostname] = { data: dataUrl, ts: Date.now() };
    saveCache(faviconCache);
  } catch (e) {
    // ignore tainted canvas/storage errors
  }
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchFaviconData(hostname) {
  for (const source of FAVICON_SOURCES) {
    const src = source(hostname);
    try {
      const response = await fetch(src);
      if (!response.ok) continue;
      const blob = await response.blob();
      if (!blob.size) continue;
      return await blobToDataUrl(blob);
    } catch (e) {
      // Try next source silently
    }
  }
  return null;
}

function loadFavicon(url, imgEl) {
  const hostname = getHostname(url);
  imgEl.src = FALLBACK_FAVICON;
  if (!hostname) {
    return;
  }

  const cached = faviconCache[hostname];
  if (cached && cached.data) {
    imgEl.src = cached.data;
    return;
  }

  // show something quickly; errors will fall through to next source/fallback
  let directIndex = 0;
  const tryDirect = () => {
    if (directIndex >= FAVICON_SOURCES.length) {
      imgEl.src = FALLBACK_FAVICON;
      return;
    }
    imgEl.onerror = () => {
      directIndex += 1;
      tryDirect();
    };
    imgEl.src = FAVICON_SOURCES[directIndex](hostname);
  };
  tryDirect();

  // Also fetch -> cache -> dataURL to survive offline
  fetchFaviconData(hostname).then((dataUrl) => {
    if (!dataUrl) return;
    faviconCache[hostname] = { data: dataUrl, ts: Date.now() };
    saveCache(faviconCache);
    imgEl.src = dataUrl;
  });
}

function ensureDropIndicator() {
  if (!dropIndicator) {
    dropIndicator = document.createElement('div');
    dropIndicator.className = 'bookmark-item drop-indicator';
  }
  return dropIndicator;
}

function getBookmarkItems(includeIndicator = false) {
  const items = Array.from(document.querySelectorAll('.bookmark-item'));
  return items.filter(
    (el) =>
      !el.classList.contains('plus') &&
      (includeIndicator ? true : !el.classList.contains('drop-indicator'))
  );
}

function placeDropIndicator(targetIndex) {
  const bookmarksContainer = document.getElementById('bookmarksContainer');
  const indicator = ensureDropIndicator();
  const items = getBookmarkItems();
  const plus = bookmarksContainer.querySelector('.bookmark-item.plus');
  const safeIndex = Number.isFinite(targetIndex) ? targetIndex : items.length;
  const index = Math.max(0, Math.min(safeIndex, items.length));
  const referenceNode = index >= items.length ? (plus || null) : items[index];
  bookmarksContainer.insertBefore(indicator, referenceNode);
  dropTargetIndex = index;
}

function computeTargetIndex(clientX) {
  const items = getBookmarkItems();
  if (!items.length) return 0;
  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect();
    const middle = rect.left + rect.width / 2;
    if (clientX < middle) {
      return i;
    }
  }
  return items.length;
}

function updateIndicatorFromEvent(e) {
  const x = e.clientX;
  const targetIndex = computeTargetIndex(x);
  placeDropIndicator(targetIndex);
}

function resolveDropIndex() {
  const items = getBookmarkItems();
  const withIndicator = getBookmarkItems(true);
  const indicatorIndex = withIndicator.findIndex((el) => el.classList.contains('drop-indicator'));
  if (indicatorIndex !== -1) {
    return Math.max(0, Math.min(indicatorIndex, items.length));
  }
  if (dropTargetIndex === null) return null;
  return Math.max(0, Math.min(dropTargetIndex, items.length));
}

function moveDraggedBookmark() {
  const targetIndex = resolveDropIndex();
  if (!draggedBookmarkId || targetIndex === null || Number.isNaN(targetIndex)) {
    clearDragVisuals();
    return;
  }
  const normalizedIndex = Math.max(0, Math.floor(targetIndex));
  clearDragVisuals();
  ensureBookmarkFolder((folderId) => {
    if (!folderId) return;
    chrome.bookmarks.move(
      draggedBookmarkId,
      { parentId: folderId, index: normalizedIndex },
      () => {
        renderBookmarks();
      }
    );
  });
}

function setupContainerDnD() {
  const bookmarksContainer = document.getElementById('bookmarksContainer');
  if (!bookmarksContainer || containerDnDAttached) return;

  bookmarksContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!draggedBookmarkId) return;
    updateIndicatorFromEvent(e);
  });

  bookmarksContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    moveDraggedBookmark();
  });

  containerDnDAttached = true;
}

function ensureBookmarkFolder(callback) {
  if (bookmarkFolderId) {
    callback(bookmarkFolderId);
    return;
  }

  chrome.bookmarks.search({ title: 'derabbit. | home page' }, (results) => {
    const folder = results.find((item) => !item.url && item.title === 'derabbit. | home page');
    if (folder) {
      bookmarkFolderId = folder.id;
      callback(folder.id);
    } else {
      chrome.bookmarks.create({ parentId: '1', title: 'derabbit. | home page' }, (newFolder) => {
        bookmarkFolderId = newFolder.id;
        callback(newFolder.id);
      });
    }
  });
}

function loadBookmarks(callback) {
  ensureBookmarkFolder((folderId) => {
    chrome.bookmarks.getChildren(folderId, (children) => {
      callback(children);
    });
  });
}

function clearDragVisuals() {
  dropTargetIndex = null;
  if (dropIndicator && dropIndicator.parentNode) {
    dropIndicator.parentNode.removeChild(dropIndicator);
  }
}

function renderBookmarks() {
  const bookmarksContainer = document.getElementById('bookmarksContainer');
  if (!bookmarksContainer) return;
  bookmarksContainer.innerHTML = '';
  clearDragVisuals();
  setupContainerDnD();

  loadBookmarks((children) => {
    children.forEach((bm) => {
      if (!bm.url) return;

      const item = document.createElement('div');
      item.className = 'bookmark-item';
      item.dataset.id = bm.id;
      item.setAttribute('draggable', 'true');

      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = bm.title || bm.url;
      item.appendChild(tooltip);

      const img = document.createElement('img');
      img.alt = bm.title;
      loadFavicon(bm.url, img);
      item.appendChild(img);

      const removeBtn = document.createElement('span');
      removeBtn.className = 'remove-bookmark';
      removeBtn.textContent = 'x';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBookmark(bm.id);
      });
      item.appendChild(removeBtn);

      item.addEventListener('click', () => {
        window.location.href = bm.url;
      });

      item.addEventListener('dragstart', (e) => {
        draggedBookmarkId = bm.id;
        dropTargetIndex = null;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', bm.id);
        const items = getBookmarkItems();
        const currentIndex = items.findIndex((el) => el.dataset.id === bm.id);
        if (currentIndex >= 0) {
          placeDropIndicator(currentIndex);
        }
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedBookmarkId = null;
        clearDragVisuals();
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedBookmarkId) return;
        e.dataTransfer.dropEffect = 'move';
        updateIndicatorFromEvent(e);
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveDraggedBookmark();
      });

      bookmarksContainer.appendChild(item);
    });

    if (children.length < 8) {
      const plusItem = document.createElement('div');
      plusItem.className = 'bookmark-item plus';
      plusItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
      </svg>`;
      plusItem.addEventListener('click', () => {
        openBookmarkModal(plusItem);
      });
      bookmarksContainer.appendChild(plusItem);
    }
  });
}

function removeBookmark(bookmarkId) {
  chrome.bookmarks.remove(bookmarkId, () => {
    renderBookmarks();
  });
}

function positionBookmarkModal(anchor) {
  const modalContent = document.querySelector('#bookmarkModal .modal-content');
  if (!modalContent) return;

  modalContent.style.left = '';
  modalContent.style.top = '';
  modalContent.style.bottom = '70px';

  if (!anchor) return;

  const rect = anchor.getBoundingClientRect();
  const contentWidth = modalContent.offsetWidth || 280;
  const contentHeight = modalContent.offsetHeight || 200;
  const padding = 12;

  const left = Math.min(
    window.innerWidth - contentWidth - padding,
    Math.max(padding, rect.left + rect.width / 2 - contentWidth / 2)
  );
  const top = Math.max(padding, rect.top - contentHeight - padding);

  modalContent.style.left = `${left}px`;
  modalContent.style.top = `${top}px`;
  modalContent.style.bottom = 'auto';
}

function openBookmarkModal(anchor) {
  const bookmarkModal = document.getElementById('bookmarkModal');
  const bookmarkUrlInput = document.getElementById('bookmarkUrl');
  const bookmarkNameInput = document.getElementById('bookmarkName');
  const bookmarkPreview = document.getElementById('bookmarkPreview');

  bookmarkUrlInput.value = '';
  bookmarkNameInput.value = '';
  bookmarkPreview.style.display = 'none';
  bookmarkPreview.querySelector('img').src = '';

  bookmarkModal.style.display = 'flex';
  requestAnimationFrame(() => {
    positionBookmarkModal(anchor);
    bookmarkModal.classList.add('active');
  });
}

function closeBookmarkModal() {
  const bookmarkModal = document.getElementById('bookmarkModal');
  bookmarkModal.classList.remove('active');
  setTimeout(() => {
    bookmarkModal.style.display = 'none';
  }, 300);
}

function initBookmarks() {
  ensureBookmarkFolder(() => {
    renderBookmarks();
  });

  const bookmarkUrlInput = document.getElementById('bookmarkUrl');
  const bookmarkNameInput = document.getElementById('bookmarkName');
  const bookmarkPreview = document.getElementById('bookmarkPreview');
  const saveBookmarkBtn = document.getElementById('saveBookmark');
  const cancelBookmarkBtn = document.getElementById('cancelBookmark');
  const previewImg = bookmarkPreview?.querySelector('img');

  bookmarkUrlInput.addEventListener('input', () => {
    const url = bookmarkUrlInput.value.trim();
    if (url) {
      let fixedUrl = url;
      if (!/^https?:\/\//i.test(fixedUrl)) {
        fixedUrl = 'https://' + fixedUrl;
      }
      try {
        const urlObj = new URL(fixedUrl);
        const previewSrc = FAVICON_SOURCES[0](urlObj.hostname);
        bookmarkPreview.style.display = 'flex';
        if (previewImg) {
          previewImg.src = previewSrc;
          previewImg.onerror = () => {
            previewImg.onerror = null;
            previewImg.src = FALLBACK_FAVICON;
          };
        }
      } catch (e) {
        bookmarkPreview.style.display = 'flex';
        if (previewImg) previewImg.src = FALLBACK_FAVICON;
      }
    } else {
      bookmarkPreview.style.display = 'none';
      if (previewImg) previewImg.src = '';
    }
  });

  saveBookmarkBtn.addEventListener('click', () => {
    let url = bookmarkUrlInput.value.trim();
    if (!url) return;
    let processedUrl = url;
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }
    let validUrl;
    try {
      validUrl = new URL(processedUrl).href;
    } catch (e) {
      validUrl = url;
    }
    const name = bookmarkNameInput.value.trim() || validUrl;
    ensureBookmarkFolder((folderId) => {
      chrome.bookmarks.create(
        {
          parentId: folderId,
          title: name,
          url: validUrl
        },
        () => {
          renderBookmarks();
          closeBookmarkModal();
        }
      );
    });
  });

  cancelBookmarkBtn.addEventListener('click', () => {
    closeBookmarkModal();
  });

  document.addEventListener('click', (e) => {
    const bookmarkModal = document.getElementById('bookmarkModal');
    if (
      bookmarkModal.style.display === 'flex' &&
      !e.target.closest('.modal-content') &&
      !e.target.closest('.bookmark-item.plus')
    ) {
      closeBookmarkModal();
    }
  });
}

export { initBookmarks, openBookmarkModal, closeBookmarkModal };
