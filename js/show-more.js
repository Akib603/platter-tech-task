/**
 * Show More (mobile)
 *
 * Expands / collapses a product list that CSS clamps to its first 4 items
 * (see `[data-collapsible]` in src/tailwind.css). The wrapping panel's height
 * is animated from its current value to the measured target, then released
 * back to `auto` so the layout stays fluid.
 *
 * Markup contract:
 *   <div>                                    <- panel (has a height transition)
 *     <ul id="list" data-collapsible>…</ul>
 *   </div>
 *   <button data-show-more aria-controls="list" aria-expanded="false">
 */
(() => {
  'use strict';

  const VISIBLE_COUNT = 4;
  const LABELS = { collapsed: 'Show More', expanded: 'Show Less' };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const initShowMore = (button) => {
    const list = document.getElementById(button.getAttribute('aria-controls'));
    if (!list) return;
    const panel = list.parentElement;

    const isExpanded = () => button.getAttribute('aria-expanded') === 'true';

    /** Panel height when only the first VISIBLE_COUNT items are shown. */
    const collapsedHeight = () => {
      const items = Array.from(list.children).slice(0, VISIBLE_COUNT);
      const bottom = Math.max(...items.map((item) => item.getBoundingClientRect().bottom));
      return bottom - panel.getBoundingClientRect().top;
    };

    const finish = () => {
      panel.style.height = '';
      panel.style.overflow = '';
      if (isExpanded()) return;

      list.removeAttribute('data-expanded');
      // Content above the button just shrank: make sure the button is still on screen.
      button.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    const toggle = (expand) => {
      const startHeight = panel.getBoundingClientRect().height;

      // Items must be rendered (not display:none) to measure the target height.
      list.setAttribute('data-expanded', '');
      const endHeight = expand ? list.getBoundingClientRect().height : collapsedHeight();

      button.setAttribute('aria-expanded', String(expand));
      button.textContent = expand ? LABELS.expanded : LABELS.collapsed;

      if (reducedMotion.matches || startHeight === endHeight) {
        finish();
        return;
      }

      panel.style.overflow = 'hidden';
      panel.style.height = `${startHeight}px`;
      panel.getBoundingClientRect(); // force a reflow so the transition starts from startHeight
      panel.style.height = `${endHeight}px`;
    };

    panel.addEventListener('transitionend', (event) => {
      if (event.target === panel && event.propertyName === 'height') finish();
    });

    button.addEventListener('click', () => toggle(!isExpanded()));
  };

  document.querySelectorAll('[data-show-more]').forEach(initShowMore);
})();
