# William Zhang — Portfolio

Personal portfolio. Visual direction: **Atelier** — a designer's workspace at night.
Deep ink canvas, warm lamplight accent, editorial italic serif for the name,
compact Inter for everything else, slow-drift constellation behind the hero.

## Stack

Plain HTML + CSS + vanilla JS. No build step. No framework.

- `index.html` — home (hero + impact + selected works + about strip)
- `archive.html` — index / archive table
- `about.html` — longer bio + timeline
- `projects/*.html` — case studies
- `styles/tokens.css` — design tokens (colors, type, spacing, motion)
- `styles/main.css` — component styles
- `scripts/main.js` — clock, count-up, works reveal, constellation
- `images/` — case study screenshots
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `williamzhang.github.io` for a user site,
   or any repo name for a project site).
2. Drop the contents of this folder into the repo root.
3. Commit and push.
4. In the repo's **Settings → Pages**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
5. Wait ~1 min. Your site is live.

### Custom domain

To use a custom domain (e.g. `williamzhang.design`):

1. Create a file named `CNAME` (no extension) in the repo root with your domain
   on the single line (e.g. `williamzhang.design`).
2. At your DNS provider, point the domain at GitHub Pages
   ([guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).

## Local preview

```bash
# from this folder
python3 -m http.server 8000
# open http://localhost:8000
```

## Fonts

Loaded from Google Fonts CDN at the top of `styles/tokens.css`:

- Fraunces (display serif, 300 + italic, optical size 144)
- Inter (body sans, 300–600)
- JetBrains Mono (mono, 400–500)

For production, self-host: drop `.woff2` files in `public/fonts/` and replace
the `@import` with local `@font-face` rules.

## Accessibility

- `prefers-reduced-motion` disables the constellation and all transitions.
- Color contrast on body copy: ivory (#F2EEE4) on deep ink (#0B0D12) passes AA.
- Nav/footer link colors pass AA as well.

## Known gaps / next steps

- Consider self-hosting fonts for perf + privacy.
- Consider adding `og:image` social card.
- `about.html` timeline is minimal — expand as the story grows.
