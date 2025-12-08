import { setWallpaper } from './colorChanger.js';

const galleryItems = [
  {
    "type": "video",
    "theme": "light",
    "first_frame": "wallpapers/abstract_gradient/abstract_gradient_first_frame.png",
    "versions": {
      "preview": "wallpapers/abstract_gradient/abstract_gradient_preview.mp4",
      "source": "wallpapers/abstract_gradient/abstract_gradient_fullhd.mp4",
      "4k": "wallpapers/abstract_gradient/abstract_gradient.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/abstract_wood/abstract_wood_first_frame.png",
    "versions": {
      "preview": "wallpapers/abstract_wood/abstract_wood_preview.mp4",
      "source": "wallpapers/abstract_wood/abstract_wood.mp4",
      "4k": "wallpapers/abstract_wood/abstract_wood.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/andreas-gucklhorn-mawU2PoJWfU-unsplash/andreas-gucklhorn-mawU2PoJWfU-unsplash_preview.jpg",
      "source": "wallpapers/andreas-gucklhorn-mawU2PoJWfU-unsplash/andreas-gucklhorn-mawU2PoJWfU-unsplash_fullhd.jpg",
      "4k": "wallpapers/andreas-gucklhorn-mawU2PoJWfU-unsplash/andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/ashim-d-silva-WeYamle9fDM-unsplash/ashim-d-silva-WeYamle9fDM-unsplash_preview.jpg",
      "source": "wallpapers/ashim-d-silva-WeYamle9fDM-unsplash/ashim-d-silva-WeYamle9fDM-unsplash_fullhd.jpg",
      "4k": "wallpapers/ashim-d-silva-WeYamle9fDM-unsplash/ashim-d-silva-WeYamle9fDM-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/benjamin-voros-phIFdC6lA4E-unsplash/benjamin-voros-phIFdC6lA4E-unsplash_preview.jpg",
      "source": "wallpapers/benjamin-voros-phIFdC6lA4E-unsplash/benjamin-voros-phIFdC6lA4E-unsplash_fullhd.jpg",
      "4k": "wallpapers/benjamin-voros-phIFdC6lA4E-unsplash/benjamin-voros-phIFdC6lA4E-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "light",
    "versions": {
      "preview": "wallpapers/blue_pink/photo-1611521063806-b8be8b1b437a_preview.png",
      "source": "wallpapers/blue_pink/photo-1611521063806-b8be8b1b437a_fullhd.png",
      "4k": "wallpapers/blue_pink/photo-1611521063806-b8be8b1b437a.png"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/blue_wave_dotted/blue_wave_dotted_first_frame.png",
    "versions": {
      "preview": "wallpapers/blue_wave_dotted/blue_wave_dotted_preview.mp4",
      "source": "wallpapers/blue_wave_dotted/blue_wave_dotted.mp4",
      "4k": "wallpapers/blue_wave_dotted/blue_wave_dotted.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/buzz-andersen-E4944K_4SvI-unsplash/buzz-andersen-E4944K_4SvI-unsplash_preview.jpg",
      "source": "wallpapers/buzz-andersen-E4944K_4SvI-unsplash/buzz-andersen-E4944K_4SvI-unsplash_fullhd.jpg",
      "4k": "wallpapers/buzz-andersen-E4944K_4SvI-unsplash/buzz-andersen-E4944K_4SvI-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/christoffer-engstrom-8NuHwPbO62k-unsplash/christoffer-engstrom-8NuHwPbO62k-unsplash_preview.jpg",
      "source": "wallpapers/christoffer-engstrom-8NuHwPbO62k-unsplash/christoffer-engstrom-8NuHwPbO62k-unsplash_fullhd.jpg",
      "4k": "wallpapers/christoffer-engstrom-8NuHwPbO62k-unsplash/christoffer-engstrom-8NuHwPbO62k-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/fantasy_moon/fantasy_moon_first_frame.png",
    "versions": {
      "preview": "wallpapers/fantasy_moon/fantasy_moon_preview.mp4",
      "source": "wallpapers/fantasy_moon/fantasy_moon_fullhd.mp4",
      "4k": "wallpapers/fantasy_moon/fantasy_moon.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/fantasy_tree/fantasy_tree_first_frame.png",
    "versions": {
      "preview": "wallpapers/fantasy_tree/fantasy_tree_preview.mp4",
      "source": "wallpapers/fantasy_tree/fantasy_tree_fullhd.mp4",
      "4k": "wallpapers/fantasy_tree/fantasy_tree.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/hounted_house/hounted_house_first_frame.png",
    "versions": {
      "preview": "wallpapers/hounted_house/hounted_house_preview.mp4",
      "source": "wallpapers/hounted_house/hounted_house_fullhd.mp4",
      "4k": "wallpapers/hounted_house/hounted_house.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/jakob-owens-n5wwck8ES4w-unsplash/jakob-owens-n5wwck8ES4w-unsplash_preview.jpg",
      "source": "wallpapers/jakob-owens-n5wwck8ES4w-unsplash/jakob-owens-n5wwck8ES4w-unsplash_fullhd.jpg",
      "4k": "wallpapers/jakob-owens-n5wwck8ES4w-unsplash/jakob-owens-n5wwck8ES4w-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/jared-rice-ujNuUPN12z0-unsplash/jared-rice-ujNuUPN12z0-unsplash_preview.jpg",
      "source": "wallpapers/jared-rice-ujNuUPN12z0-unsplash/jared-rice-ujNuUPN12z0-unsplash_fullhd.jpg",
      "4k": "wallpapers/jared-rice-ujNuUPN12z0-unsplash/jared-rice-ujNuUPN12z0-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/jonatan-pie-h8nxGssjQXs-unsplash/jonatan-pie-h8nxGssjQXs-unsplash_preview.jpg",
      "source": "wallpapers/jonatan-pie-h8nxGssjQXs-unsplash/jonatan-pie-h8nxGssjQXs-unsplash_fullhd.jpg",
      "4k": "wallpapers/jonatan-pie-h8nxGssjQXs-unsplash/jonatan-pie-h8nxGssjQXs-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "light",
    "versions": {
      "preview": "wallpapers/julien-moreau-688Fna1pwOQ-unsplash/julien-moreau-688Fna1pwOQ-unsplash_preview.jpg",
      "source": "wallpapers/julien-moreau-688Fna1pwOQ-unsplash/julien-moreau-688Fna1pwOQ-unsplash_fullhd.jpg",
      "4k": "wallpapers/julien-moreau-688Fna1pwOQ-unsplash/julien-moreau-688Fna1pwOQ-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/magenta_forest/magenta_forest_first_frame.png",
    "versions": {
      "preview": "wallpapers/magenta_forest/magenta_forest_preview.mp4",
      "source": "wallpapers/magenta_forest/magenta_forest_fullhd.mp4",
      "4k": "wallpapers/magenta_forest/magenta_forest.mp4"
    }
  },
  {
    "type": "image",
    "theme": "light",
    "versions": {
      "preview": "wallpapers/mark-eder-R9OS29xJb-8-unsplash/mark-eder-R9OS29xJb-8-unsplash_preview.jpg",
      "source": "wallpapers/mark-eder-R9OS29xJb-8-unsplash/mark-eder-R9OS29xJb-8-unsplash_fullhd.jpg",
      "4k": "wallpapers/mark-eder-R9OS29xJb-8-unsplash/mark-eder-R9OS29xJb-8-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/music_disk/music_disk_first_frame.png",
    "versions": {
      "preview": "wallpapers/music_disk/music_disk_preview.mp4",
      "source": "wallpapers/music_disk/music_disk_fullhd.mp4",
      "4k": "wallpapers/music_disk/music_disk.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/neowave/neowave_first_frame.png",
    "versions": {
      "preview": "wallpapers/neowave/neowave_preview.mp4",
      "source": "wallpapers/neowave/neowave_fullhd.mp4",
      "4k": "wallpapers/neowave/neowave.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/nir-himi-gmw2FAIsqn4-unsplash/nir-himi-gmw2FAIsqn4-unsplash_preview.jpg",
      "source": "wallpapers/nir-himi-gmw2FAIsqn4-unsplash/nir-himi-gmw2FAIsqn4-unsplash_fullhd.jpg",
      "4k": "wallpapers/nir-himi-gmw2FAIsqn4-unsplash/nir-himi-gmw2FAIsqn4-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/own_desk/own_desk_first_frame.png",
    "versions": {
      "preview": "wallpapers/own_desk/own_desk_preview.mp4",
      "source": "wallpapers/own_desk/own_desk.mp4",
      "4k": "wallpapers/own_desk/own_desk.mp4"
    }
  },
  {
    "type": "image",
    "theme": "light",
    "versions": {
      "preview": "wallpapers/pawel-czerwinski-009elgvBM_A-unsplash/pawel-czerwinski-009elgvBM_A-unsplash_preview.jpg",
      "source": "wallpapers/pawel-czerwinski-009elgvBM_A-unsplash/pawel-czerwinski-009elgvBM_A-unsplash_fullhd.jpg",
      "4k": "wallpapers/pawel-czerwinski-009elgvBM_A-unsplash/pawel-czerwinski-009elgvBM_A-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "light",
    "first_frame": "wallpapers/pink_ink/pink_ink_first_frame.png",
    "versions": {
      "preview": "wallpapers/pink_ink/pink_ink_preview.mp4",
      "source": "wallpapers/pink_ink/pink_ink_fullhd.mp4",
      "4k": "wallpapers/pink_ink/pink_ink.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/purple_wave/purple_wave_first_frame.png",
    "versions": {
      "preview": "wallpapers/purple_wave/purple_wave_preview.mp4",
      "source": "wallpapers/purple_wave/purple_wave_fullhd.mp4",
      "4k": "wallpapers/purple_wave/purple_wave.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/rays/rays_first_frame.png",
    "versions": {
      "preview": "wallpapers/rays/rays_preview.mp4",
      "source": "wallpapers/rays/rays.mp4",
      "4k": "wallpapers/rays/rays.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/ren-ran-O-8Fmpx7HqQ-unsplash/ren-ran-O-8Fmpx7HqQ-unsplash_preview.jpg",
      "source": "wallpapers/ren-ran-O-8Fmpx7HqQ-unsplash/ren-ran-O-8Fmpx7HqQ-unsplash_fullhd.jpg",
      "4k": "wallpapers/ren-ran-O-8Fmpx7HqQ-unsplash/ren-ran-O-8Fmpx7HqQ-unsplash.jpg"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/richard-horvath-_nWaeTF6qo0-unsplash/richard-horvath-_nWaeTF6qo0-unsplash_preview.jpg",
      "source": "wallpapers/richard-horvath-_nWaeTF6qo0-unsplash/richard-horvath-_nWaeTF6qo0-unsplash_fullhd.jpg",
      "4k": "wallpapers/richard-horvath-_nWaeTF6qo0-unsplash/richard-horvath-_nWaeTF6qo0-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/spiral_galaxy/spiral_galaxy_first_frame.png",
    "versions": {
      "preview": "wallpapers/spiral_galaxy/spiral_galaxy_preview.mp4",
      "source": "wallpapers/spiral_galaxy/spiral_galaxy_fullhd.mp4",
      "4k": "wallpapers/spiral_galaxy/spiral_galaxy.mp4"
    }
  },
  {
    "type": "image",
    "theme": "dark",
    "versions": {
      "preview": "wallpapers/stefan-stefancik-TPv9dh822VA-unsplash/stefan-stefancik--g7axSVst6Y-unsplash_preview.jpg",
      "source": "wallpapers/stefan-stefancik-TPv9dh822VA-unsplash/stefan-stefancik--g7axSVst6Y-unsplash_fullhd.jpg",
      "4k": "wallpapers/stefan-stefancik-TPv9dh822VA-unsplash/stefan-stefancik--g7axSVst6Y-unsplash.jpg"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/sunset_water/sunset_water_first_frame.png",
    "versions": {
      "preview": "wallpapers/sunset_water/sunset_water_preview.mp4",
      "source": "wallpapers/sunset_water/sunset_water.mp4",
      "4k": "wallpapers/sunset_water/sunset_water.mp4"
    }
  },
  {
    "type": "video",
    "theme": "dark",
    "first_frame": "wallpapers/water/water_first_frame.png",
    "versions": {
      "preview": "wallpapers/water/water_preview.mp4",
      "source": "wallpapers/water/water_fullhd.mp4",
      "4k": "wallpapers/water/water.mp4"
    }
  }
];


function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';

  // Кнопка загрузки (plus card)
  const plusCard = document.createElement('div');
  plusCard.classList.add('gallery-item', 'plus-card');
  plusCard.innerHTML = `<img src="icons/plus.svg" alt="Upload" style="width: 40px; height: 40px;">`;
  plusCard.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('wallpaperFile').click();
  });
  grid.appendChild(plusCard);

  galleryItems.forEach(itemData => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.position = 'relative';

    // Добавляем значок типа (иконка) в левом верхнем углу
    const overlayIcon = document.createElement('img');
    overlayIcon.style.position = 'absolute';
    overlayIcon.style.top = '5px';
    overlayIcon.style.left = '5px';
    overlayIcon.style.width = '24px';
    overlayIcon.style.height = '24px';
    overlayIcon.style.zIndex = '2';
    overlayIcon.src = itemData.type === 'video' ? 'icons/video.svg' : 'icons/image.svg';
    item.appendChild(overlayIcon);

    if (itemData.type === 'video') {
      // Создаем элемент видео для превью
      const video = document.createElement('video');
      video.src = itemData.versions.preview;
      video.poster = itemData.first_frame;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.pointerEvents = 'auto'; // гарантируем, что видео принимает события мыши

      // При наведении на видео сбрасываем время и запускаем проигрывание
      video.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      });
      // При уходе курсора останавливаем проигрывание без ошибок Abort
      video.addEventListener('mouseleave', () => {
        video.pause();
      });
      // Логируем недоступный превью-файл, чтобы отследить 404
      video.addEventListener('error', () => {
        console.warn('Не удалось загрузить превью видео обоев:', itemData.versions.preview);
      });
      item.appendChild(video);
    } else {
      // Для изображений создаем элемент img с preview-версией
      const img = document.createElement('img');
      img.src = itemData.versions.preview;
      img.alt = "Wallpaper Preview";
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      item.appendChild(img);
    }

    // Если этот элемент выбран, добавляем галочку (checkmark.svg) в правом верхнем углу
    const saved = localStorage.getItem('wallpaper');
    if (saved) {
      try {
        const current = JSON.parse(saved);
        // Сравниваем по версии source (можно адаптировать под вашу логику)
        if (current.versions && current.versions.source === itemData.versions.source) {
          const checkmark = document.createElement('img');
          checkmark.src = 'icons/checkmark.svg';
          checkmark.alt = 'Selected';
          checkmark.style.position = 'absolute';
          checkmark.style.top = '5px';
          checkmark.style.right = '5px';
          checkmark.style.width = '24px';
          checkmark.style.height = '24px';
          checkmark.style.zIndex = '3';
          item.appendChild(checkmark);
        }
      } catch (e) {}
    }

    // При клике устанавливаем фон, передавая объект обоев и тему
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      setWallpaper(itemData, itemData.theme);
      loadGallery(); // обновляем галерею для отображения галочки
    });

    grid.appendChild(item);
  });
}

function openSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsOverlay = document.getElementById('settingsOverlay');
  settingsModal.style.display = 'flex';
  settingsOverlay.style.display = 'block';
  requestAnimationFrame(() => {
    settingsModal.classList.add('active');
    settingsOverlay.classList.add('active');
  });
  loadGallery();
}

function closeSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsOverlay = document.getElementById('settingsOverlay');
  settingsModal.classList.remove('active');
  settingsOverlay.classList.remove('active');
  setTimeout(() => {
    settingsModal.style.display = 'none';
    settingsOverlay.style.display = 'none';
  }, 300);
}

function initSettings() {
  const settingsBtn = document.querySelector('.settings-button');
  const wallpaperFile = document.getElementById('wallpaperFile');
  settingsBtn.addEventListener('click', openSettingsModal);
  document.getElementById('closeSettings').addEventListener('click', closeSettingsModal);
  document.getElementById('settingsOverlay').addEventListener('click', closeSettingsModal);

  wallpaperFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Загруженный файл трактуем как изображение
        const wallpaperItem = {
          type: 'image',
          theme: 'light',
          versions: {
            preview: e.target.result,
            source: e.target.result,
            '4k': e.target.result
          }
        };
        setWallpaper(wallpaperItem, wallpaperItem.theme);
        loadGallery();
      };
      reader.readAsDataURL(file);
    }
  });

  const savedData = localStorage.getItem('wallpaper');
  if (savedData) {
    try {
      const savedWallpaper = JSON.parse(savedData);
      setWallpaper(savedWallpaper, savedWallpaper.theme);
    } catch (e) {}
  }

  document.addEventListener("click", (e) => {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal && settingsModal.style.display === "flex" &&
        !e.target.closest('.settings-content') &&
        !e.target.closest('.settings-button')) {
      closeSettingsModal();
    }
  });
}

export { initSettings };
