document.addEventListener("DOMContentLoaded", function() {
  // Вставляем SVG-фильтры для разделения цветовых каналов с полупрозрачностью (0.5)
  (function insertSVGFilters() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.display = "none";
    svg.innerHTML = `
      <filter id="alphaRed">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
      </filter>
      <filter id="alphaGreen">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
      </filter>
      <filter id="alphaBlue">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.5 0"/>
      </filter>
    `;
    document.body.insertBefore(svg, document.body.firstChild);
  })();

  // Функция, которая полностью на JS создаёт глитч-эффект для изображения
  function setupGlitchEffect(originalImg) {
    // Устанавливаем размеры, если ещё не заданы
    originalImg.style.width = "160px";
    originalImg.style.height = "160px";
    originalImg.style.display = "block";

    const computedWidth = 160;
    const computedHeight = 160;
    
    // Читаем атрибут glitch-strength-shift; если не указан, по умолчанию 5px.
    const strengthAttr = originalImg.getAttribute("glitch-strength-shift");
    const strength = strengthAttr ? parseFloat(strengthAttr) : 5;
    const containerShift = strength - 1;

    // Создаем контейнер и задаем ему фиксированные размеры и стили
    const container = document.createElement('div');
    container.style.position = "relative";
    container.style.display = "inline-block";
    container.style.overflow = "hidden";
    container.style.lineHeight = "0";
    container.style.width = computedWidth + "px";
    container.style.height = computedHeight + "px";
    container.style.transform = "translateZ(0)";
    // Для корректной работы mix-blend-mode
    container.style.isolation = "isolate";

    // Перемещаем контейнер в DOM
    originalImg.parentNode.insertBefore(container, originalImg);
    
    // Создаем клоны для R, G, B каналов и задаем им режим наложения и полупрозрачность
    function createClone(filterId) {
      const clone = originalImg.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.width = "100%";
      clone.style.height = "100%";
      clone.style.objectFit = "contain";
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "1"; // ниже оригинала
      clone.style.display = "none";
      clone.style.opacity = "0.5";
      clone.style.filter = `url(#${filterId})`;
      clone.style.mixBlendMode = "screen";
      return clone;
    }
    const redClone = createClone("alphaRed");
    const greenClone = createClone("alphaGreen");
    const blueClone = createClone("alphaBlue");
    // Добавляем клоны до оригинального изображения (они будут находиться под ним)
    container.appendChild(redClone);
    container.appendChild(greenClone);
    container.appendChild(blueClone);

    // Функция для создания среза (slice)
    function createSlice() {
      const slice = document.createElement('div');
      slice.style.position = 'absolute';
      slice.style.top = '0';
      slice.style.left = '0';
      slice.style.width = '100%';
      slice.style.height = '100%';
      slice.style.backgroundImage = `url(${originalImg.src})`;
      slice.style.backgroundRepeat = 'no-repeat';
      slice.style.backgroundPosition = 'center';
      slice.style.backgroundSize = 'contain';
      slice.style.pointerEvents = 'none';
      slice.style.zIndex = '2';
      slice.style.display = 'none';
      return slice;
    }
    const slices = [];
    for (let i = 0; i < 3; i++) {
      const slice = createSlice();
      container.appendChild(slice);
      slices.push(slice);
    }
    
    // Добавляем оригинальное изображение поверх клонов и срезов
    originalImg.style.position = "absolute";
    originalImg.style.top = "0";
    originalImg.style.left = "0";
    originalImg.style.width = "100%";
    originalImg.style.height = "100%";
    originalImg.style.zIndex = "3"; // выше
    originalImg.style.pointerEvents = "auto";
    container.appendChild(originalImg);

    // Расчет масштаба эффекта (опорный размер 400px)
    const referenceSize = 400;
    const scale = computedWidth / referenceSize;
    const totalFrames = 15;
    let hoverActive = false;
    let randomTimer = null;

    // Функция случайного смещения с учетом заданного max
    function randomOffset(max) {
      return ((Math.random() * 2 - 1) * max * scale).toFixed(2);
    }
    // Применяем случайные трансформации к клонам и контейнеру,
    // используя значение strength для RGB-копий и containerShift для контейнера.
    function applyRandomTransform() {
      redClone.style.transform = `translate(${randomOffset(strength)}px, ${randomOffset(strength)}px)`;
      greenClone.style.transform = `translate(${randomOffset(strength)}px, ${randomOffset(strength)}px)`;
      blueClone.style.transform = `translate(${randomOffset(strength)}px, ${randomOffset(strength)}px)`;
      container.style.transform = `translate(${randomOffset(containerShift)}px, ${randomOffset(containerShift)}px)`;
    }
    // Случайное применение обрезки и смещения для срезов
    function randomizeSlice(slice) {
      const sliceHeight = (Math.random() * 60 + 20) * scale;
      const top = Math.random() * (computedHeight - sliceHeight);
      const bottom = top + sliceHeight;
      slice.style.clip = `rect(${top}px, ${computedWidth}px, ${bottom}px, 0)`;
      slice.style.transform = `translate(${randomOffset(10)}px, ${randomOffset(10)}px)`;
      slice.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
      slice.style.display = "block";
    }
    function resetGlitch() {
      redClone.style.transform = "none";
      greenClone.style.transform = "none";
      blueClone.style.transform = "none";
      container.style.transform = "none";
      redClone.style.display = "none";
      greenClone.style.display = "none";
      blueClone.style.display = "none";
      slices.forEach(slice => slice.style.display = "none");
    }
    function glitchTrigger(callback) {
      redClone.style.display = "block";
      greenClone.style.display = "block";
      blueClone.style.display = "block";
      let frame = 0;
      const frameInterval = 400 / totalFrames;
      const glitchInterval = setInterval(() => {
        applyRandomTransform();
        slices.forEach(randomizeSlice);
        frame++;
        if (frame >= totalFrames) {
          clearInterval(glitchInterval);
          resetGlitch();
          if (callback) callback();
        }
      }, frameInterval);
    }
    function continuousGlitch() {
      if (!hoverActive) return;
      glitchTrigger(() => {
        if (hoverActive) continuousGlitch();
      });
    }
    function startRandomGlitch() {
      if (hoverActive) return;
      const delay = Math.random() * 2500 + 500;
      randomTimer = setTimeout(() => {
        if (!hoverActive) {
          glitchTrigger(startRandomGlitch);
        }
      }, delay);
    }
    container.addEventListener("mouseenter", () => {
      hoverActive = true;
      if (randomTimer) {
        clearTimeout(randomTimer);
        randomTimer = null;
      }
      continuousGlitch();
    });
    container.addEventListener("mouseleave", () => {
      hoverActive = false;
      resetGlitch();
      startRandomGlitch();
    });
    startRandomGlitch();
  }

  // Инициализация глитч-эффекта для всех изображений с классом "glitch-effect"
  document.querySelectorAll('img.glitch-effect').forEach(function(img) {
    setupGlitchEffect(img);
  });
});
