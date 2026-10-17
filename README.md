# Platter – Best Sellers (Technical Challenge)

A responsive **Best Sellers** product section built with semantic HTML, TailwindCSS and vanilla JavaScript.

**Live preview:** https://akib603.github.io/platter-tech-task/

No build step is needed to review it: the compiled CSS is committed, so `index.html` can be opened directly or served as static files.

## Requirements checklist

| Requirement | How it's done |
| --- | --- |
| At least 10 product cards | 10 `<article>` cards in a single `<ul>` |
| Mobile: first 4 visible, **Show More** reveals the other 6 with a smooth dropdown | CSS hides items 5+ on mobile; [`js/show-more.js`](js/show-more.js) animates the panel height and keeps `aria-expanded` in sync |
| Hovering the image swaps it for a secondary image | Second image cross-fades in on `hover` / `focus-within` (500 ms; turned off for `prefers-reduced-motion`) |
| Free stock images | Unsplash, downloaded and optimised (see *Performance*) |
| Fully responsive | Mobile: 2-column grid. Tablet/desktop: horizontal slider that bleeds off the right edge, as in the design |
| Scrollbar thumb grows to 6px on hover / touch | Custom scrollbar in [`js/scrollbar.js`](js/scrollbar.js): the thumb is 4px and grows to 6px on hover and while pressed or touched; it can be dragged, or the track clicked |
| HTML + TailwindCSS + vanilla JS | Tailwind CLI 3.4, no frameworks or libraries at runtime |

## Project structure

```
├── index.html            # Page markup (semantic HTML + Tailwind classes)
├── css/style.css         # Compiled + minified Tailwind output (committed)
├── src/tailwind.css      # Tailwind source: @font-face, star rating, JS-only rules
├── tailwind.config.js    # Design tokens (fonts, colours)
├── js/
│   ├── show-more.js      # Mobile "Show More" dropdown
│   └── scrollbar.js      # Desktop custom scrollbar
├── fonts/                # Self-hosted woff2 (latin subset)
├── images/
│   ├── products/         # WebP product images, 400w + 720w
│   ├── favicon.svg
│   └── og-image.jpg
├── robots.txt / sitemap.xml
└── .nojekyll             # Serve files as-is on GitHub Pages
```

## Key decisions

### Semantic HTML & accessibility
- Structure: `<main>` → `<section aria-labelledby>` → `<header>` + **one** `<ul>` of `<article>` cards, so assistive tech gets a single list of 10 products at every breakpoint. The first prototype split the list in two to handle the mobile dropdown.
- **Stretched link pattern**: the link sits on the `<h3>` product name, and an `::after` overlay makes the whole card clickable. Screen readers read a short link name ("Outside Vibes T-Shirt Sunshine") instead of the card's entire contents.
- The star rating is one element with `role="img"` and `aria-label="Rated 4.5 out of 5"`. The price has a visually hidden "Price:" prefix.
- Collapsed products use `display: none`, so they can't be focused while hidden. Show More follows the WAI-ARIA disclosure pattern (`aria-expanded`, `aria-controls`).
- The custom scrollbar is `aria-hidden`: the list itself is still natively scrollable by keyboard, trackpad and touch.
- Focus styles are visible (`focus-visible`), hover effects respect `prefers-reduced-motion`, and the text meets WCAG AA contrast.

### Progressive enhancement
A one-line script in `<head>` adds a `js` class before first paint. Rules that need JavaScript (collapsing to 4 items, hiding the native scrollbar, showing the Show More button) only apply under `.js`. Without JS, every product is visible and the native scrollbar works.

### Performance
- **Tailwind CLI instead of the Play CDN.** The CDN script is ~300 KB, compiles in the browser, blocks rendering and isn't meant for production. The compiled CSS is about 13 KB minified.
- **Images:** square WebP at 400w and 720w with `srcset`/`sizes`, explicit `width`/`height` to prevent layout shift, `fetchpriority="high"` on the LCP image, and `loading="lazy"` below the fold. The 6 collapsed mobile products load nothing until revealed.
- **Hover images are skipped on touch-only devices:** each one is in a `<picture>` with a `(hover: none)` source that points to a 1px inline GIF.
- **Self-hosted fonts** (latin subset woff2, ~53 KB) with `font-display: swap`, and the three fonts used above the fold are preloaded. This removes two third-party connections compared with Google Fonts.
- **JS:** two small classic scripts with `defer`. They are classic scripts rather than ES modules so the page also works when opened from `file://`. Scrollbar updates are batched with `requestAnimationFrame`, and listeners are passive.
- `future.hoverOnlyWhenSupported` stops hover styles from getting stuck after a tap on touch screens.

### SEO
Meta description, canonical URL, Open Graph/Twitter tags with a share image, a single `h1` with a logical heading order, descriptive `alt` text, `robots.txt`, `sitemap.xml`, and **JSON-LD** (`ItemList` of `Product` with `Offer`). Ratings are left out of the structured data because they are placeholder values.

### Notes on the design
- The mobile and desktop frames show the *Save 15%* badge on different products. Badges are product data, so I used the desktop placement on every screen size.
- The design repeats "Rest In Nature T-Shirt Charcoal" on two cards. I gave every product a unique name because duplicate names confuse screen-reader users and search engines.
- Product links, Shop All Best Sellers and the ratings and prices are placeholders.

## Development

```bash
npm install
npm run dev     # watch src/tailwind.css + index.html, rebuild css/style.css
npm run build   # one-off minified build (commit the result)
```

Any static server works for local preview, e.g. `npx http-server .`.

## Deployment

GitHub Pages → *Settings → Pages → Deploy from a branch → `main` / root*.

## Credits

Product photos: [Unsplash](https://unsplash.com) (Unsplash License). Fonts: Bebas Neue, Playfair Display and Poppins (SIL Open Font License).
