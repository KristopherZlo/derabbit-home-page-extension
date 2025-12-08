import { initSearch } from './search.js';
import { initSuggestions } from './suggestions.js';
import { initBookmarks } from './bookmarks.js';
import { initSettings } from './settings.js';
import { startTypewriter } from './search-animation.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready: initialize modules');
  initSearch();
  initSuggestions();
  initBookmarks();
  initSettings();
  startTypewriter();
  document.body.classList.add('is-ready');
});
