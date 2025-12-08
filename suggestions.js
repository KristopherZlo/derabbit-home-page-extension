const REMOVED_FREQUENT_KEY = 'removedFrequent';
const REMOVED_RECENT_KEY = 'removedRecent';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

function saveRemovedData(key, data) {
  const payload = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

function getRemovedData(key) {
  const payloadStr = localStorage.getItem(key);
  if (!payloadStr) return [];
  try {
    const payload = JSON.parse(payloadStr);
    if (Date.now() - payload.timestamp > EXPIRATION_TIME) {
      localStorage.removeItem(key);
      return [];
    }
    return payload.data || [];
  } catch (e) {
    localStorage.removeItem(key);
    return [];
  }
}

let removedFrequent = getRemovedData(REMOVED_FREQUENT_KEY);
let removedRecent = getRemovedData(REMOVED_RECENT_KEY);

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=24`;
  } catch (error) {
    return 'https://placehold.co/24x24';
  }
}

function truncate(str, n) {
  return str.length > n ? `${str.substring(0, n - 1)}...` : str;
}

function buildRemoveButton(onClick) {
  const removeBtn = document.createElement('span');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return removeBtn;
}

function renderImageSearchShortcut(suggestionsBox) {
  const suggestion = document.createElement('div');
  suggestion.className = 'suggestion-item site-item';
  const img = document.createElement('img');
  img.src = 'icons/google_image_search_logo.svg';
  img.alt = 'Google Image Search';
  img.className = 'site-logo';
  const nameSpan = document.createElement('span');
  nameSpan.textContent = 'Google Image Search';
  nameSpan.className = 'site-name';
  suggestion.appendChild(img);
  suggestion.appendChild(nameSpan);
  suggestion.addEventListener('click', () => {
    window.location.href = 'https://www.google.com/imghp';
  });
  suggestionsBox.appendChild(suggestion);
}

function renderTopSites(suggestionsBox) {
  chrome.topSites.get((sites) => {
    const uniqueSites = {};
    const filtered = [];
    sites.forEach((site) => {
      try {
        const hostname = new URL(site.url).hostname;
        if (removedFrequent.includes(hostname)) return;
        if (!uniqueSites[hostname]) {
          uniqueSites[hostname] = true;
          filtered.push(site);
        }
      } catch (err) {}
    });

    if (!filtered.length) return;

    const frequentSection = document.createElement('div');
    frequentSection.className = 'suggestions-section';
    const frequentTitle = document.createElement('div');
    frequentTitle.className = 'section-title';
    frequentTitle.textContent = 'Frequently visited';
    frequentTitle.style.fontSize = '16px';
    frequentSection.appendChild(frequentTitle);

    filtered.slice(0, 4).forEach((site) => {
      const item = document.createElement('div');
      item.className = 'suggestion-item site-item';
      const img = document.createElement('img');
      img.src = getFaviconUrl(site.url);
      img.alt = site.title || site.url;
      img.className = 'site-logo';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = truncate(site.title || site.url, 65);
      nameSpan.className = 'site-name';
      const removeBtn = buildRemoveButton(() => {
        try {
          const hostname = new URL(site.url).hostname;
          if (!removedFrequent.includes(hostname)) {
            removedFrequent.push(hostname);
            saveRemovedData(REMOVED_FREQUENT_KEY, removedFrequent);
            updateEmptySuggestions();
          }
        } catch (err) {}
      });
      item.appendChild(img);
      item.appendChild(nameSpan);
      item.appendChild(removeBtn);
      item.addEventListener('click', () => {
        window.open(site.url, '_blank');
      });
      frequentSection.appendChild(item);
    });
    suggestionsBox.appendChild(frequentSection);
  });
}

function renderHistory(suggestionsBox) {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (response) => {
    if (!response || !response.results) return;

    const uniqueHistory = {};
    const filteredHistory = [];
    response.results.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
    response.results.forEach((item) => {
      try {
        const hostname = new URL(item.url).hostname;
        if (removedRecent.includes(item.url)) return;
        if (!uniqueHistory[hostname]) {
          uniqueHistory[hostname] = true;
          filteredHistory.push(item);
        }
      } catch (e) {}
    });

    if (!filteredHistory.length) return;

    const recentSection = document.createElement('div');
    recentSection.className = 'suggestions-section';
    const recentTitle = document.createElement('div');
    recentTitle.className = 'section-title';
    recentTitle.textContent = 'Recent history';
    recentTitle.style.fontSize = '16px';
    recentSection.appendChild(recentTitle);

    filteredHistory.slice(0, 4).forEach((item) => {
      const element = document.createElement('div');
      element.className = 'suggestion-item site-item';
      const img = document.createElement('img');
      img.src = getFaviconUrl(item.url);
      img.alt = item.title || item.url;
      img.className = 'site-logo';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = truncate(item.title || item.url, 65);
      nameSpan.className = 'site-name';
      const removeBtn = buildRemoveButton(() => {
        if (!removedRecent.includes(item.url)) {
          removedRecent.push(item.url);
          saveRemovedData(REMOVED_RECENT_KEY, removedRecent);
          updateEmptySuggestions();
        }
      });
      element.appendChild(img);
      element.appendChild(nameSpan);
      element.appendChild(removeBtn);
      element.addEventListener('click', () => {
        window.open(item.url, '_blank');
      });
      recentSection.appendChild(element);
    });
    suggestionsBox.appendChild(recentSection);
  });
}

function updateEmptySuggestions() {
  const suggestionsBox = document.getElementById('suggestionsBox');
  const searchInput = document.querySelector('.search-input');
  if (!suggestionsBox || !searchInput) return;

  suggestionsBox.innerHTML = '';

  if (searchInput.classList.contains('with-image')) {
    renderImageSearchShortcut(suggestionsBox);
    suggestionsBox.style.display = 'block';
    return;
  }

  let hasSources = false;
  if (typeof chrome !== 'undefined' && chrome.topSites) {
    hasSources = true;
    renderTopSites(suggestionsBox);
  }

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    hasSources = true;
    renderHistory(suggestionsBox);
  }

  suggestionsBox.style.display = hasSources ? 'block' : 'none';
}

function initSuggestions() {
  updateEmptySuggestions();
}

export { updateEmptySuggestions, getFaviconUrl, initSuggestions };
