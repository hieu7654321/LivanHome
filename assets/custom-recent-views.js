class RecentlyViewedProductsElement extends HTMLElement {
  constructor() {
    super();
    this.maxProducts = Number(this.dataset.maxProducts || 8);
    this.layoutType = this.dataset.layoutType || 'grid';
    this.carouselOnMobile = this.dataset.carouselOnMobile === 'true';
    this.productsContainer = this.querySelector('[data-testid="recently-viewed-products-list"]');
    this.productsContainerMobile = this.querySelector('[data-testid="recently-viewed-products-list-mobile"]');
    /** @type {HTMLElement | null} */
    this.emptyState = this.querySelector('[data-empty-state]');
    this.searchUrl = this.dataset.searchUrl || '/search';
    this.predictiveSectionId = this.dataset.predictiveSectionId || 'predictive-search-empty';
  }

  connectedCallback() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.init();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
    }
  }

  init() {
    const productIds = this.getRecentlyViewedProductIds();

    if (!productIds.length) {
      this.showEmptyState();
      return;
    }

    this.fetchProducts(productIds)
      .then((html) => {
        if (!html) {
          this.showEmptyState();
          return;
        }

        const template = document.createElement('template');
        template.innerHTML = html.trim();
        const list = template.content.querySelector('#predictive-search-products');

        if (!list) {
          this.showEmptyState();
          return;
        }

        const items = list.querySelectorAll('.predictive-search-results__card');

        if (!items.length) {
          this.showEmptyState();
          return;
        }

        if (this.emptyState) {
          this.emptyState.remove();
        }

        items.forEach((item) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'resource-list__item';

          const card = item.querySelector('.predictive-search-results__card--product');
          wrapper.appendChild(card ? card : item);

          if (this.productsContainer) {
            this.productsContainer.appendChild(wrapper);
          }
        });
      })
      .catch(() => {
        this.showEmptyState();
      });
  }

  getRecentlyViewedProductIds() {
    try {
      const stored = window.localStorage.getItem('viewedProducts');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(0, this.maxProducts);
    } catch (error) {
      return [];
    }
  }

  /**
   * @param {number[]} productIds
   */
  async fetchProducts(productIds) {
    const url = new URL(this.searchUrl, window.location.origin);
    url.searchParams.set(
      'q',
      productIds
        .map((id) => `id:${id}`)
        .join(' OR ')
    );
    url.searchParams.set('resources[type]', 'product');

    // THIS is the key: render the predictive-search section
    url.searchParams.set('section_id', this.predictiveSectionId);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) return null;

      const text = await response.text();
      return text;
    } catch (error) {
      return null;
    }
  }

  showEmptyState() {
    if (this.emptyState) {
      this.emptyState.hidden = false;
    }
  }
}

if (!customElements.get('recently-viewed-products')) {
  customElements.define('recently-viewed-products', RecentlyViewedProductsElement);
}