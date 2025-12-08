document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedColor = localStorage.getItem('averageBackgroundColor');
    if (savedColor) {
      document.body.style.backgroundColor = savedColor;
    }

    const wallpaperRaw = localStorage.getItem('wallpaper');
    if (wallpaperRaw) {
      try {
        const wallpaper = JSON.parse(wallpaperRaw);
        let previewSrc = null;
        if (wallpaper.type === 'video') {
          previewSrc = wallpaper.first_frame || (wallpaper.versions && wallpaper.versions.preview);
        } else if (wallpaper.type === 'image') {
          previewSrc = wallpaper.versions && (wallpaper.versions.preview || wallpaper.versions.source);
        }
        if (previewSrc) {
          document.body.style.backgroundImage = `url(${previewSrc})`;
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundSize = 'cover';
        }
      } catch (err) {
        console.warn('Saved wallpaper parse failed', err);
      }
    }
  } catch (e) {
    console.error('Failed to apply saved background color', e);
  }
});
