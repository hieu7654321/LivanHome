/**
 * Recently viewed products section loader
 */
class RecentlyViewedSection {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    /** @type {HTMLElement} */
    this.container = container;

    /** @type {string} */
    this.sectionId = container.dataset.sectionId || '';

    /** @type {string} */
    this.searchUrl = container.dataset.searchUrl || '/search';

    /** @type {number} */
    this.maxProducts = parseInt(container.dataset.maxProducts || '4', 10);
  }

  /**
   * @returns {string[]}
   */
  getViewedProducts() {
    try {
      return JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * @param {string[]} ids
   * @returns {string}
   */
  buildQuery(ids) {
    return ids.slice(0, this.maxProducts).map(
      /** @param {string} id */
      (id) => `id:${id}`
    ).join(' OR ');
  }

  /**
   * @param {string} query
   * @returns {Promise<string>}
   */
  async fetchSection(query) {
    const url = new URL(this.searchUrl, window.location.origin);

    url.searchParams.set('q', query);
    url.searchParams.set('resources[type]', 'product');
    url.searchParams.set('section_id', this.sectionId);

    const response = await fetch(url);
    return response.text();
  }

  /**
   * @param {string} html
   */
  updateDOM(html) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');

    const newContent = parsed.querySelector(`#recent-${this.sectionId}`);

    if (!newContent) return;

    this.container.innerHTML = newContent.innerHTML;
  }

  async init() {
    const ids = this.getViewedProducts();

    if (!ids.length) {
      this.container.style.display = 'none';
      return;
    }

    const query = this.buildQuery(ids);

    try {
      const html = await this.fetchSection(query);
      this.updateDOM(html);
    } catch (error) {
      console.error('Recently viewed load failed:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /** @type {NodeListOf<HTMLElement>} */
  const sections = document.querySelectorAll('[id^="recent-"]');

  sections.forEach((container) => {
    new RecentlyViewedSection(container).init();
  });
});