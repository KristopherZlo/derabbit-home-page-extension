function updateColorsBasedOnTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.style.setProperty('--text-bookmark-plus', '#f3f3f3');
    root.style.setProperty('--text-default', '#f3f3f3');
    root.style.setProperty('--text-dark', '#f3f3f3');
  } else if (theme === 'light') {
    root.style.setProperty('--text-bookmark-plus', '#7b7b7b');
    root.style.setProperty('--text-default', '#7b7b7b');
    root.style.setProperty('--text-dark', '#333333');
  }
}

function updateColorsFromImage(imageUrl) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;
  img.onload = function() {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
      count++;
    }
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);
    const avgColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
    document.body.style.backgroundColor = avgColor;
    localStorage.setItem('averageBackgroundColor', avgColor);
  };
  img.onerror = function() {
    console.warn('Failed to load image for color sampling');
  };
}

function getOrCreateVideoElement() {
  let video = document.getElementById('bgVideo');
  if (!video) {
    video = document.createElement('video');
    video.id = 'bgVideo';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-1';
    video.style.pointerEvents = 'none';
  }
  return video;
}

function cleanupBackground() {
  const existingVideo = document.getElementById('bgVideo');
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.removeAttribute('src');
    existingVideo.load();
    existingVideo.style.display = 'none';
  }
  document.body.style.backgroundImage = '';
}

function setWallpaper(wallpaperItem, theme) {
  const body = document.body;
  localStorage.setItem('wallpaper', JSON.stringify(wallpaperItem));

  cleanupBackground();

  if (wallpaperItem.type === 'video') {
    if (wallpaperItem.first_frame) {
      body.style.backgroundImage = `url(${wallpaperItem.first_frame})`;
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundPosition = 'center';
      body.style.backgroundSize = 'cover';
      updateColorsFromImage(wallpaperItem.first_frame);
    }

    const chosenVersion = (window.innerWidth >= 1920 && wallpaperItem.versions['4k'])
      ? wallpaperItem.versions['4k']
      : wallpaperItem.versions.source;

    const bgVideo = getOrCreateVideoElement();
    bgVideo.style.display = 'block';
    if (!document.body.contains(bgVideo)) {
      body.prepend(bgVideo);
    }

    bgVideo.addEventListener('canplay', () => {
      body.style.backgroundImage = '';
    });

    bgVideo.src = chosenVersion;
    bgVideo.preload = 'metadata';
    bgVideo.load();
    bgVideo.play().catch(() => {});
  } else if (wallpaperItem.type === 'image') {
    const chosenVersion = (window.innerWidth >= 1920 && wallpaperItem.versions['4k'])
      ? wallpaperItem.versions['4k']
      : wallpaperItem.versions.source;
    const video = document.getElementById('bgVideo');
    if (video) {
      video.pause();
      video.style.display = 'none';
      video.removeAttribute('src');
      video.load();
    }

    // Use preview as immediate placeholder if available
    if (wallpaperItem.versions && wallpaperItem.versions.preview) {
      body.style.backgroundImage = `url(${wallpaperItem.versions.preview})`;
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundPosition = 'center';
      body.style.backgroundSize = 'cover';
      updateColorsFromImage(wallpaperItem.versions.preview);
    }

    const bgImg = new Image();
    bgImg.crossOrigin = 'Anonymous';
    bgImg.src = chosenVersion;
    bgImg.onload = function() {
      body.style.backgroundImage = `url(${chosenVersion})`;
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundPosition = 'center';
      body.style.backgroundSize = 'cover';
      updateColorsFromImage(chosenVersion);
    };
    bgImg.onerror = function() {
      console.error('Failed to load wallpaper image');
    };
  }

  if (theme) {
    updateColorsBasedOnTheme(theme);
  } else if (wallpaperItem.type === 'image') {
    updateColorsFromImage(wallpaperItem.versions.source);
  }
}

export { setWallpaper, updateColorsFromImage, updateColorsBasedOnTheme };
