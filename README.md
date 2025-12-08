<p align="center">
  <img src="icons/rabbit_logo.svg" alt="derabbit logo" width="120" />
</p>

# derabbit. | new tab home page

Custom Chrome new tab that turns a blank page into a fast search hub with smart shortcuts, suggestions, and live wallpapers.

## Features
- Quick search with suggestions, !bang-style shortcuts, and instant engine switching (Google, Yandex, DuckDuckGo, Perplexity, ChatGPT, YouTube, Pinterest, image search).
- Image search: paste a screenshot/photo and send it to Google Lens.
- Dynamic wallpapers: static and video backgrounds with preview and average-color preloading for smooth startup.
- Bookmarks: add with favicon preview, remove, and rearrange via drag-and-drop.
- Settings modal: wallpaper gallery plus uploading your own backgrounds.

## Install as an extension
1. Open `chrome://extensions/` and enable Developer mode.
2. Click “Load unpacked” and select this project folder.
3. Open a new tab — the derabbit page will appear.

## Structure
- `index.html` — page shell.
- `styles.css` — layout and animations.
- `main.js` — module bootstrap.
- `search.js` — search logic, suggestions, shortcuts, engine selection.
- `suggestions.js` — top sites and history.
- `bookmarks.js` — bookmarks with drag-and-drop ordering.
- `settings.js` / `colorChanger.js` — wallpapers and color handling.
- `manifest.json` — Chrome extension manifest.

## Dev quick start
Clone the repo, make changes, and reload the unpacked extension in Chrome. No build step required: plain HTML/CSS/JS. Use your editor’s Live Server or simple `python -m http.server` if you want to open `index.html` directly for UI tweaks.
