let bookmarkFolderId = null;

function ensureBookmarkFolder(callback) {
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

function renderBookmarks() {
  const bookmarksContainer = document.getElementById('bookmarksContainer');
  bookmarksContainer.innerHTML = '';

  const getItemIndex = (targetId) => {
    const items = Array.from(bookmarksContainer.querySelectorAll('.bookmark-item')).filter(el => !el.classList.contains('plus'));
    return items.findIndex(el => el.dataset.id === targetId);
  };

  loadBookmarks((children) => {
    children.forEach((bm) => {
      if (bm.url) {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.dataset.id = bm.id;
        item.setAttribute('draggable', 'true');

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = bm.title || bm.url;
        item.appendChild(tooltip);

        try {
          const urlObj = new URL(bm.url);
          const img = document.createElement('img');
          img.src = 'https://www.google.com/s2/favicons?domain=' + urlObj.hostname + '&sz=24';
          img.alt = bm.title;
          item.appendChild(img);
        } catch (e) {
          const img = document.createElement('img');
          img.src = 'https://placehold.co/24x24';
          img.alt = bm.title;
          item.appendChild(img);
        }

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
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', bm.id);
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
        });
        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          item.classList.add('drag-over');
        });
        item.addEventListener('dragleave', () => {
          item.classList.remove('drag-over');
        });
        item.addEventListener('drop', (e) => {
          e.preventDefault();
          item.classList.remove('drag-over');
          const draggedId = e.dataTransfer.getData('text/plain');
          if (!draggedId || draggedId === bm.id) return;
          ensureBookmarkFolder((folderId) => {
            const targetIndex = getItemIndex(bm.id);
            chrome.bookmarks.move(draggedId, { parentId: folderId, index: targetIndex }, () => {
              renderBookmarks();
            });
          });
        });

        bookmarksContainer.appendChild(item);
      }
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

  // Reset to defaults
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

  bookmarkUrlInput.addEventListener('input', () => {
    const url = bookmarkUrlInput.value.trim();
    if (url) {
      let fixedUrl = url;
      if (!/^https?:\/\//i.test(fixedUrl)) {
        fixedUrl = 'https://' + fixedUrl;
      }
      try {
        const urlObj = new URL(fixedUrl);
        const favicon = 'https://www.google.com/s2/favicons?domain=' + urlObj.hostname + '&sz=24';
        bookmarkPreview.style.display = 'flex';
        bookmarkPreview.querySelector('img').src = favicon;
      } catch (e) {
        bookmarkPreview.style.display = 'flex';
        bookmarkPreview.querySelector('img').src = 'https://placehold.co/24x24';
      }
    } else {
      bookmarkPreview.style.display = 'none';
      bookmarkPreview.querySelector('img').src = '';
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
