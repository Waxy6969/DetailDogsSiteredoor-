# Project Agent Rules

## Figma Design System Rules

These rules apply when implementing Figma designs or design-system updates for the Detail Dogs LLC static website.

### Project Stack

- This project is a static HTML, CSS, and vanilla JavaScript site. Do not introduce React, Vue, Tailwind, or a build step unless the user explicitly asks for a framework migration.
- Pages live as route folders with `index.html` files, for example `services/index.html`, `gallery/index.html`, `reviews/index.html`, and `about/index.html`.
- Individual service pages live in `service/*.html` and use Vercel clean URLs, for example `/service/deep-interior-detail`.
- Vercel serves this as a static site with `vercel.json` configured for `cleanUrls`. Use root-relative links such as `/services/`, `/gallery/`, `/reviews/`, `/about/`, and `/#contact`.

### Styling System

- Use the TemplateMo Pixel Forge stylesheet as the base visual system and place project-specific overrides in `detail-dogs.css`.
- Reuse existing CSS variables from `templatemo-pixel-forge-style.css`, especially `--container-max`, `--card-bg`, `--card-border`, `--text-main`, and `--text-muted`.
- Keep typography aligned with the current Google Fonts: `Bebas Neue` for display headings, `Space Mono` for small labels and technical/meta text, and `Outfit` for body copy.
- Prefer existing shared classes before creating new ones: `.subpage-main`, `.subpage-inner`, `.subpage-hero`, `.subpage-copy`, `.service-card`, `.review-card`, `.service-pill`, `.service-meta`, `.gallery-cta-panel`, `.service-detail-actions`, `.filter-tab`, `.booking-form`, and `.back-link`.
- Put new reusable styles in `detail-dogs.css`. Avoid inline styles except for simple runtime values controlled by JavaScript.
- Match the existing dark, high-contrast, card-based style. Do not create an unrelated color palette for a single page.

### Figma MCP Flow

- Run `get_design_context` for the exact Figma node before implementing a Figma-driven change.
- If the Figma response is too large, use metadata to identify the needed child node and fetch only that node.
- Run `get_screenshot` for the same node and use it as the visual reference.
- Treat Figma-generated React or Tailwind as design guidance only. Translate it into this project's static HTML and global CSS conventions.
- Validate the finished page against the screenshot for layout, spacing, typography, and responsive behavior before marking the work complete.

### Asset Handling

- Store downloaded or exported site assets in `images/`.
- If the Figma MCP server provides localhost image or SVG sources, use those assets directly while implementing or download them into `images/` when the site needs a durable static asset.
- Do not install new icon packages for static pages. Use inline SVG only when the design requires a small custom symbol and no existing project pattern fits.
- Use meaningful `alt` text for service, gallery, result, and business images.

### Page And Navigation Patterns

- Keep the header navigation consistent across pages: Services, About, Memberships, Gallery or Results, Reviews, and Contact.
- Keep the mobile menu in sync with the desktop nav and preserve the `mobileToggle` and `mobileMenu` IDs used by `templatemo-pixel-script.js`.
- Use `/#contact` for contact links from subpages and `#contact` only on the homepage.
- When adding a new top-level page, create a folder with `index.html`, include the shared navigation/footer, link `../detail-dogs.css`, and load `../templatemo-pixel-script.js`.
- When adding a new service detail page, follow the existing `service/*.html` structure with `.service-detail-layout`, `.service-detail-panel`, `.service-side-panel`, `.service-meta`, and `.service-detail-actions`.

### JavaScript Rules

- Put shared interactions in `templatemo-pixel-script.js`.
- Guard every DOM lookup before using it so the same script can run on every page.
- Existing interaction patterns include mobile navigation, filter tabs using `data-filter` and `data-category`, before/after sliders with `data-before-after-slider`, FAQ toggles, smooth anchor scrolling, gallery popup behavior, and intersection animations.
- Do not break the homepage gallery popup when adding gallery-page filtering. The same `.filter-tab` behavior is intentionally shared by services, gallery items, and gallery result cards.

### Content And CTA Rules

- Keep Detail Dogs LLC business copy direct and service-focused. Preferred voice: professional, clear, quality-driven, and local to Reading, Pennsylvania.
- Use phone CTAs as `tel:+14849260606` and email booking CTAs as `mailto:detaildogsllc@gmail.com` with a useful subject when practical.
- Service cards should include category, title, short description, time or custom scope, price language, and a clear action.
- Avoid placeholder copy when the user has provided actual service, membership, review, gallery, or about-page content.

### Accessibility And Responsive Quality

- Use semantic sections, headings in order, and descriptive link/button text.
- Buttons must include `type="button"` when they do not submit a form.
- Interactive controls need accessible labels, especially mobile menu buttons, gallery close buttons, and before/after sliders.
- Make card grids and feature layouts responsive with stable grid tracks and mobile breakpoints in `detail-dogs.css`.
- Verify that navigation, filters, CTAs, and cards do not overlap or overflow on mobile.

### Verification

- Preview locally at `http://127.0.0.1:4173/`.
- For new routes, verify the clean URL and the physical file path both work when served locally.
- Use the in-app browser for a visual check after significant frontend changes.
- Git is not available in this local environment; GitHub updates are made through the GitHub connector when the user asks to push.
