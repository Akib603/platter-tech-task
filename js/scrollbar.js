/**
 * Custom horizontal scrollbar (desktop)
 *
 * Native scrollbars can't be restyled consistently across browsers (and not
 * at all in Firefox beyond colour/width), so the native one is hidden and
 * this component mirrors the list's scroll position instead.
 *
 * - Thumb width reflects how much of the list is visible.
 * - Drag the thumb, or press anywhere on the track to jump there and keep dragging.
 * - `data-active` is set while the bar is pressed/touched; CSS uses it
 *   (together with :hover) to grow the thumb from 4px to 6px.
 *
 * Markup contract:
 *   <ul id="list">…</ul>
 *   <div data-scrollbar="list"><div data-scrollbar-thumb></div></div>
 */
(() => {
  'use strict';

  const MIN_THUMB_WIDTH = 40;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const initScrollbar = (bar) => {
    const scroller = document.getElementById(bar.dataset.scrollbar);
    const thumb = bar.querySelector('[data-scrollbar-thumb]');
    if (!scroller || !thumb) return;

    // Cached by render() and reused by the drag handlers.
    let maxScroll = 0;
    let thumbWidth = 0;
    let travel = 0; // distance the thumb can move, in px
    let frame = 0;
    let drag = null;

    const render = () => {
      frame = 0;
      const trackWidth = bar.clientWidth;
      maxScroll = scroller.scrollWidth - scroller.clientWidth;
      thumbWidth = clamp(trackWidth * (scroller.clientWidth / scroller.scrollWidth), MIN_THUMB_WIDTH, trackWidth);
      travel = trackWidth - thumbWidth;

      const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${progress * travel}px)`;
      bar.style.visibility = maxScroll > 0 ? '' : 'hidden';
    };

    // Batch scroll/resize updates into one render per frame.
    const scheduleRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    /** Convert a thumb position (px from the track start) into a scroll offset. */
    const scrollToThumbPosition = (x) => {
      scroller.scrollLeft = travel > 0 ? (clamp(x, 0, travel) / travel) * maxScroll : 0;
    };

    const startDrag = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();

      bar.setPointerCapture(event.pointerId);
      bar.setAttribute('data-active', '');
      // Snapping fights with programmatic scrolling; re-enabled on release.
      scroller.style.scrollSnapType = 'none';

      if (event.target !== thumb) {
        // Pressed on the track: centre the thumb under the pointer.
        scrollToThumbPosition(event.clientX - bar.getBoundingClientRect().left - thumbWidth / 2);
        render();
      }

      drag = { startX: event.clientX, startThumbX: (scroller.scrollLeft / (maxScroll || 1)) * travel };
    };

    const moveDrag = (event) => {
      if (!drag) return;
      scrollToThumbPosition(drag.startThumbX + (event.clientX - drag.startX));
    };

    const endDrag = () => {
      if (!drag) return;
      drag = null;
      bar.removeAttribute('data-active');
      scroller.style.scrollSnapType = '';
    };

    bar.addEventListener('pointerdown', startDrag);
    bar.addEventListener('pointermove', moveDrag);
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);
    bar.addEventListener('lostpointercapture', endDrag);

    scroller.addEventListener('scroll', scheduleRender, { passive: true });
    new ResizeObserver(scheduleRender).observe(scroller);
    render();
  };

  document.querySelectorAll('[data-scrollbar]').forEach(initScrollbar);
})();
