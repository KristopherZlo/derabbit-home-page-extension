class TypeWriter {
  constructor(element, phrases, options = {}) {
    this.element = element;
    this.phrases = phrases;
    this.currentPhrase = 0;
    this.currentChar = phrases[0].length;
    this.isDeleting = false;
    this.options = {
      typeSpeed: options.typeSpeed || 30,
      deleteSpeed: options.deleteSpeed || 20,
      pauseBeforeDelete: options.pauseBeforeDelete || 1000,
      pauseBeforeType: options.pauseBeforeType || 500
    };
  }

  commonPrefixLength(a, b) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    return i;
  }

  type() {
    const currentText = this.phrases[this.currentPhrase];

    if (this.isDeleting) {
      const nextPhrase = this.phrases[(this.currentPhrase + 1) % this.phrases.length];
      const commonPrefix = this.commonPrefixLength(currentText, nextPhrase);

      if (this.currentChar > commonPrefix) {
        this.currentChar--;
        this.element.placeholder = currentText.substring(0, this.currentChar);
        setTimeout(() => this.type(), this.options.deleteSpeed);
        return;
      }

      this.isDeleting = false;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      const nextCommon = this.commonPrefixLength(currentText, this.phrases[this.currentPhrase]);
      this.currentChar = nextCommon;
      setTimeout(() => this.type(), this.options.pauseBeforeType);
      return;
    }

    if (this.currentChar < currentText.length) {
      this.currentChar++;
      this.element.placeholder = currentText.substring(0, this.currentChar);
      setTimeout(() => this.type(), this.options.typeSpeed);
      return;
    }

    setTimeout(() => {
      this.isDeleting = true;
      this.type();
    }, this.options.pauseBeforeDelete);
  }

  start() {
    this.element.placeholder = this.phrases[this.currentPhrase];
    setTimeout(() => {
      this.isDeleting = true;
      this.type();
    }, this.options.pauseBeforeDelete);
  }
}

export function startTypewriter() {
  const phrases = [
    "Что ищем сейчас, Злой?",
    "Прон",
    "Фильмы про хакеров",
    "Лучшие фильмы 2025",
    "Gachimuchi",
    "Какие фрукты можно кролику?",
    "PinkLoving",
    "Сколько можно выпить водки за раз?",
    "google dorking",
    "Смертельная доза шипучих витаминок",
    "Слоники",
    "Сочная попка корги",
    "Hello world - Jam2go",
    "Finnair",
    "iddqd",
    "Большие бидоны с молоком"
  ];

  const searchInput = document.querySelector('.search-input');
  if (!searchInput) {
    console.warn('search input not found for typewriter');
    return;
  }

  const typewriter = new TypeWriter(searchInput, phrases, {
    typeSpeed: 30,
    deleteSpeed: 20,
    pauseBeforeDelete: 1000,
    pauseBeforeType: 100
  });
  typewriter.start();
}
