import { updateEmptySuggestions } from './suggestions.js';

const systems = [
  { name: 'google', logo: 'icons/google_logo.svg' },
  { name: 'yandex', logo: 'icons/yandex_logo.svg' },
  { name: 'duckduckgo', logo: 'icons/duckduckgo_logo.svg' },
  { name: 'perplexity', logo: 'icons/perplexity_logo.svg' },
  { name: 'ask claude', logo: 'icons/ask_claude_logo.svg' },
  { name: 'ask chatgpt', logo: 'icons/ask_chatgpt_logo.svg' },
  { name: 'youtube', logo: 'icons/youtube_logo.svg' },
  { name: 'pinterest', logo: 'icons/pinterest_logo.svg' }
];

const imageSearchOption = { name: 'image search', logo: 'icons/google_image_search_logo.svg' };

const searchUrls = {
  google: 'https://www.google.com/search?q=',
  yandex: 'https://yandex.ru/search/?text=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  perplexity: 'https://www.perplexity.ai/search?q=',
  'ask claude': 'https://claude.ai/new?q=',
  'ask chatgpt': 'https://chat.openai.com/?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  pinterest: 'https://www.pinterest.com/search/pins/?q=',
  'image search': 'https://www.google.com/search?tbm=isch&q='
};

const state = {
  orderedSystems: [...systems],
  currentIndex: 0,
  pastedImageFile: null
};

const elements = {
  searchInput: null,
  suggestionsBox: null,
  iconContainer: null,
  pastedImagePreview: null,
  searchTooltip: null,
  searchWrapper: null
};

const imageKeywords = ['img', 'image', 'photo', 'picture', 'kartinka'];

const bangMappings = {
  g: 'google',
  google: 'google',
  ddg: 'duckduckgo',
  duckduckgo: 'duckduckgo',
  yt: 'youtube',
  youtube: 'youtube',
  pin: 'pinterest',
  pinterest: 'pinterest',
  ya: 'yandex',
  yandex: 'yandex',
  claude: 'ask claude',
  gpt: 'ask chatgpt',
  chatgpt: 'ask chatgpt',
  pplx: 'perplexity',
  perplexity: 'perplexity',
  img: 'image search',
  image: 'image search',
  pic: 'image search'
};

const primaryBang = {
  google: '!g',
  yandex: '!ya',
  duckduckgo: '!ddg',
  perplexity: '!pplx',
  'ask claude': '!claude',
  'ask chatgpt': '!gpt',
  youtube: '!yt',
  pinterest: '!pin',
  'image search': '!img'
};

const keywordMappings = [
  { keys: imageKeywords, system: 'image search' },
  { keys: ['claude'], system: 'ask claude' },
  { keys: ['gpt', 'chatgpt', 'ask gpt'], system: 'ask chatgpt' },
  { keys: ['perplexity'], system: 'perplexity' },
  { keys: ['ddg', 'duckduckgo'], system: 'duckduckgo' },
  { keys: ['youtube', 'yt '], system: 'youtube' },
  { keys: ['pinterest'], system: 'pinterest' },
  { keys: ['yandex'], system: 'yandex' }
];

const rusPrefixes = [
  { prefix: 'узнай', system: 'perplexity' },
  { prefix: 'спроси', system: 'ask chatgpt' }
];

function parseBang(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) return null;

  let bang = null;
  let rest = trimmed;

  const startMatch = trimmed.match(/^!\s*([^\s]+)\s*(.*)$/);
  if (startMatch) {
    bang = startMatch[1].toLowerCase();
    rest = startMatch[2];
  } else {
    const endMatch = trimmed.match(/^(.*)\s+!\s*([^\s]+)$/);
    if (endMatch) {
      bang = endMatch[2].toLowerCase();
      rest = endMatch[1];
    }
  }

  if (!bang) return null;
  const system = bangMappings[bang];
  if (!system) return null;
  return { system, rest: rest.trim() };
}

function normalize(text) {
  return text.toLowerCase().trim();
}

function matchesAny(text, keys) {
  return keys.some((key) => text.includes(key));
}

function isImageMode() {
  return elements.searchInput.classList.contains('with-image') && state.pastedImageFile;
}

function chooseSystemByConditions(query) {
  const normalized = normalize(query);
  if (!normalized) return systems[0];

  const endingsForYandex = ['смотреть онлайн', 'смотреть', 'онлайн'];
  if (endingsForYandex.some((ending) => normalized.endsWith(ending) || normalized.includes(ending))) {
    const yandex = systems.find((s) => s.name === 'yandex');
    if (yandex) return yandex;
  }

  if (matchesAny(normalized, ['leak', 'leek'])) {
    return systems.find((s) => s.name === 'duckduckgo') || systems[0];
  }

  if (normalized.split(/\s+/).length > 10) {
    return systems.find((s) => s.name === 'ask chatgpt') || systems[0];
  }

  if (matchesAny(normalized, imageKeywords)) {
    return imageSearchOption;
  }

  const found = keywordMappings.find(({ system, keys }) => system !== 'image search' && matchesAny(normalized, keys));
  return (found && systems.find((s) => s.name === found.system)) || systems[0];
}

function orderSystems(query) {
  const trimmed = (query || '').trim();
  const bang = parseBang(trimmed);
  if (bang) {
    const selected = systems.find((s) => s.name === bang.system) || systems[0];
    const rest = systems.filter((s) => s.name !== selected.name);
    state.orderedSystems = [selected, ...rest, imageSearchOption];
    state.currentIndex = 0;
    return;
  }

  const normalized = normalize(trimmed);
  const prefixHit = rusPrefixes.find(({ prefix }) => normalized.startsWith(prefix));
  if (prefixHit) {
    const selected = systems.find((s) => s.name === prefixHit.system) || systems[0];
    const rest = systems.filter((s) => s.name !== selected.name);
    state.orderedSystems = [selected, ...rest, imageSearchOption];
    state.currentIndex = 0;
    return;
  }

  if (isImageMode()) {
    state.orderedSystems = [imageSearchOption];
    state.currentIndex = 0;
    return;
  }
  const selected = chooseSystemByConditions(trimmed);
  if (selected.name === imageSearchOption.name) {
    state.orderedSystems = [imageSearchOption, ...systems];
  } else {
    const rest = systems.filter((s) => s.name !== selected.name);
    state.orderedSystems = [selected, ...rest, imageSearchOption];
  }
  state.currentIndex = 0;
}

function applySystemLogo() {
  const { searchInput, iconContainer } = elements;
  if (!searchInput.value.trim() && !isImageMode()) {
    resetIcon();
    return;
  }
  const system = state.orderedSystems[state.currentIndex] || systems[0];
  iconContainer.innerHTML = '';
  const img = document.createElement('img');
  img.src = system.logo;
  img.alt = system.name;
  img.width = 24;
  img.height = 24;
  iconContainer.appendChild(img);
}

function resetIcon() {
  const iconContainer = elements.iconContainer;
  if (!iconContainer) return;
  iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#989898" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`;
}

function showTooltip(system) {
  if (!elements.searchTooltip || !elements.searchWrapper) return;
  const bang = primaryBang[system.name] || '';
  const text = bang ? `${system.name} (${bang})` : system.name;
  elements.searchTooltip.textContent = text;
  elements.searchTooltip.classList.add('visible');
}

function hideTooltip() {
  if (!elements.searchTooltip) return;
  elements.searchTooltip.classList.remove('visible');
}

function updateTooltip() {
  if (!elements.searchTooltip) return;
  if (elements.suggestionsBox.style.display === 'none') {
    hideTooltip();
    return;
  }
  const system = state.orderedSystems[state.currentIndex] || systems[0];
  showTooltip(system);
}

function updateActiveSuggestion() {
  const items = elements.suggestionsBox.querySelectorAll('.suggestion-item');
  items.forEach((item, idx) => {
    item.classList.toggle('active', idx === state.currentIndex);
  });
  applySystemLogo();
  updateTooltip();
}

function buildSearchSuggestions(query) {
  const parsedBang = parseBang(query);
  const displayQuery = parsedBang ? parsedBang.rest.trim() : query;

  const { suggestionsBox } = elements;
  suggestionsBox.innerHTML = '';

  if (isImageMode()) {
    const item = document.createElement('div');
    item.classList.add('suggestion-item', 'active');
    item.textContent = imageSearchOption.name;
    item.addEventListener('mouseenter', () => {
      state.currentIndex = 0;
      updateActiveSuggestion();
    });
    item.addEventListener('mouseleave', hideTooltip);
    item.addEventListener('click', () => {
      state.currentIndex = 0;
      useSystemAndSearch();
    });
    suggestionsBox.appendChild(item);
    return;
  }

  state.orderedSystems.forEach((system, index) => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    if (index === state.currentIndex) item.classList.add('active');
    item.textContent = `${system.name}: ${displayQuery}`;
    item.addEventListener('mouseenter', () => {
      state.currentIndex = index;
      updateActiveSuggestion();
    });
    item.addEventListener('mouseleave', hideTooltip);
    item.addEventListener('click', () => {
      state.currentIndex = index;
      useSystemAndSearch();
    });
    suggestionsBox.appendChild(item);
  });
}

function showSuggestionsBox() {
  const { suggestionsBox } = elements;
  suggestionsBox.style.display = 'block';
  requestAnimationFrame(() => {
    suggestionsBox.classList.add('visible');
  });
}

function hideSuggestionsBox() {
  const { suggestionsBox } = elements;
  suggestionsBox.classList.remove('visible');
  setTimeout(() => {
    suggestionsBox.style.display = 'none';
    hideTooltip();
  }, 200);
}

function useSystemAndSearch() {
  const searchInput = elements.searchInput;
  let query = searchInput.value.trim();

  if (isImageMode()) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://lens.google.com/upload';
    form.enctype = 'multipart/form-data';
    form.target = '_blank';

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.name = 'encoded_image';
    const dt = new DataTransfer();
    dt.items.add(state.pastedImageFile);
    inputFile.files = dt.files;
    form.appendChild(inputFile);

    if (query) {
      const inputText = document.createElement('input');
      inputText.type = 'hidden';
      inputText.name = 'q';
      inputText.value = query;
      form.appendChild(inputText);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    return;
  }

  const parsedBang = parseBang(query);
  if (parsedBang) {
    query = parsedBang.rest.trim();
    const selected = systems.find((s) => s.name === parsedBang.system);
    if (selected) {
      const rest = systems.filter((s) => s.name !== selected.name);
      state.orderedSystems = [selected, ...rest, imageSearchOption];
      state.currentIndex = 0;
    }
  }

  const normalized = normalize(query);
  rusPrefixes.forEach(({ prefix, system }) => {
    if (normalized.startsWith(prefix)) {
      query = query.substring(prefix.length).trim();
      const idx = state.orderedSystems.findIndex((s) => s.name === system);
      if (idx >= 0) state.currentIndex = idx;
    }
  });

  keywordMappings.forEach((mapping) => {
    mapping.keys.forEach((key) => {
      if (normalized.startsWith(key)) {
        query = query.substring(key.length).replace(/^,?\s*/, '');
        const targetIndex = state.orderedSystems.findIndex((s) => s.name === mapping.system);
        if (targetIndex >= 0) state.currentIndex = targetIndex;
      }
    });
  });

  const selectedSystem = state.orderedSystems[state.currentIndex] || systems[0];
  const baseUrl = searchUrls[selectedSystem.name];
  if (!baseUrl) {
    console.error('Search URL is missing for', selectedSystem.name);
    return;
  }
  window.location.href = baseUrl + encodeURIComponent(query);
}

function handleImagePaste(items) {
  const list = Array.from(items || []);
  for (const item of list) {
    if (item.type.startsWith('image')) {
      state.pastedImageFile = item.getAsFile();
      if (!state.pastedImageFile) return;
      const previewUrl = URL.createObjectURL(state.pastedImageFile);
      elements.pastedImagePreview.querySelector('img').src = previewUrl;
      elements.pastedImagePreview.style.display = 'block';
      elements.searchInput.classList.add('with-image');
      orderSystems(elements.searchInput.value.trim());
      buildSearchSuggestions(elements.searchInput.value.trim());
      applySystemLogo();
      showSuggestionsBox();
      break;
    }
  }
}

function initSearch() {
  elements.searchInput = document.querySelector('.search-input');
  elements.suggestionsBox = document.getElementById('suggestionsBox');
  elements.iconContainer = document.getElementById('iconContainer');
  elements.pastedImagePreview = document.getElementById('pastedImagePreview');
  elements.searchWrapper = document.querySelector('.search-wrapper');
  const removePastedImageBtn = document.getElementById('removePastedImage');

  if (!elements.searchInput || !elements.suggestionsBox || !elements.iconContainer || !elements.pastedImagePreview || !elements.searchWrapper || !removePastedImageBtn) {
    console.error('Search UI elements are missing.');
    return;
  }

  elements.searchTooltip = document.createElement('div');
  elements.searchTooltip.className = 'search-tooltip';
  elements.searchWrapper.appendChild(elements.searchTooltip);

  elements.suggestionsBox.addEventListener('wheel', (e) => {
    e.preventDefault();
    elements.suggestionsBox.scrollTop += e.deltaY;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSuggestionsBox();
    }
  });

  elements.searchInput.addEventListener('blur', () => {
    if (elements.searchInput.value.trim() === '' && !isImageMode()) {
      hideSuggestionsBox();
    }
  });

  elements.suggestionsBox.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  elements.searchInput.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items || e.originalEvent?.clipboardData?.items;
    if (items) handleImagePaste(items);
  });

  removePastedImageBtn.addEventListener('click', () => {
    elements.pastedImagePreview.style.display = 'none';
    elements.searchInput.classList.remove('with-image');
    state.pastedImageFile = null;
    orderSystems(elements.searchInput.value.trim());
    updateEmptySuggestions();
    resetIcon();
  });

  elements.searchInput.addEventListener('focus', () => {
    if (elements.searchInput.value.trim() !== '' || isImageMode()) {
      orderSystems(elements.searchInput.value.trim());
      state.currentIndex = 0;
      buildSearchSuggestions(elements.searchInput.value.trim());
      applySystemLogo();
      showSuggestionsBox();
    } else {
      updateEmptySuggestions();
      showSuggestionsBox();
    }
  });

  elements.searchInput.addEventListener('input', () => {
    if (elements.searchInput.value.trim() === '' && !isImageMode()) {
      hideSuggestionsBox();
      updateEmptySuggestions();
      resetIcon();
      return;
    }
    elements.suggestionsBox.style.display = 'block';
    elements.suggestionsBox.classList.add('visible');
    orderSystems(elements.searchInput.value.trim());
    buildSearchSuggestions(elements.searchInput.value.trim());
    applySystemLogo();
  });

  elements.searchInput.addEventListener('keydown', (e) => {
    const items = elements.suggestionsBox.querySelectorAll('.suggestion-item');
    if ((elements.searchInput.value.trim() !== '' || isImageMode()) && items.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault();
        state.currentIndex = (state.currentIndex + 1) % items.length;
        updateActiveSuggestion();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.currentIndex = (state.currentIndex - 1 + items.length) % items.length;
        updateActiveSuggestion();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        useSystemAndSearch();
      }
    }
  });
}

export { initSearch, useSystemAndSearch, resetIcon, applySystemLogo, updateActiveSuggestion };
