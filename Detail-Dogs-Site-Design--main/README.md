# Detail Dogs LLC Website

A Figma-inspired static landing page starter for Detail Dogs LLC, prepared for deployment on Vercel.

## Design direction

This implementation is based on the structure/style direction requested from the referenced gym landing-page concept:
- bold hero section with strong headline and conversion buttons
- metrics/trust blocks
- service cards
- pricing/package cards
- conversion-focused footer contact area

## Use your PDF + Figma as final source of truth

1. Add your business design PDF at `assets/design-template.pdf`.
2. Replace placeholder content in `index.html` with final business copy.
3. Tune colors, spacing, typography, and imagery in `styles.css` to exactly match your approved design.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import this repository.
3. Framework preset: **Other**.
4. Build command: *(leave empty)*.
5. Output directory: *(leave empty for static root)*.
6. Deploy.

## Local verification (no npm required)

Run these checks in restricted environments where npm registry access may be blocked:

```bash
python -m http.server 4173
# in another terminal
curl -I http://127.0.0.1:4173/
```

A `200 OK` response confirms the static site is serving correctly.

## Temporary public preview URL workflow (Vercel)

Use this when you want a shareable preview link on any device before going live.

1. Push your branch to GitHub.
2. In Vercel, create/import this project once (if not already connected).
3. In Vercel Project Settings → Git, ensure **Preview Deployments** are enabled.
4. For every new push to a non-production branch (for example `work`), Vercel automatically creates a unique preview URL.
5. Open Vercel Dashboard → Project → **Deployments** and copy the latest **Preview** link.
6. Share that URL to review on phone/tablet/desktop.

### Recommended branch workflow

```bash
git checkout -b preview/homepage-v2
# make edits
git add .
git commit -m "Update homepage"
git push -u origin preview/homepage-v2
```

Vercel will generate a preview URL for `preview/homepage-v2` automatically.

### Promote preview to production

After approval:

1. Merge the preview branch into your production branch (commonly `main`).
2. Vercel will trigger a production deployment for the merged commit.

## Update GitHub PR and refresh Vercel preview

After making changes, use this flow to update your open PR and trigger a new Vercel preview deployment:

```bash
git add .
git commit -m "Update landing page"
git push origin work
```

Then:

1. Open your GitHub PR and confirm the latest commit appears.
2. Open Vercel Dashboard → your project → Deployments.
3. Vercel will automatically create a new **Preview** deployment from the updated PR commit.
4. Click the newest deployment URL to verify the latest site changes.

### Force redeploy in Vercel (if needed)

If a deployment does not refresh automatically:

1. Open the deployment in Vercel.
2. Click **Redeploy**.
3. Choose **Use existing Build Cache** (fast) or **Without Build Cache** (clean rebuild).

## Git Gallery Photos

Gallery photos are checked into the repo under:

`images/gallery/drive/`

They are organized by type:

- `featured`
- `interior`
- `exterior`
- `paint-correction`
- `ceramic`
- `shop`

The site reads `images/gallery/drive-gallery.json` to render the home gallery preview and gallery page. When adding or removing checked-in photos, update that manifest so the pages point to the right files.
