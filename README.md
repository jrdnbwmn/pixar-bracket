# Pixar Movie Bracket

A 27-movie Pixar tournament bracket the Bowman family votes on by name. Hosted as a static site on GitHub Pages; vote data lives in a Google Sheet via an Apps Script Web App (see `Code.gs`).

## Enable GitHub Pages

1. Go to this repo's **Settings → Pages**.
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
4. GitHub gives you a URL like `https://jrdnbwmn.github.io/pixar-bracket/` within a minute or two — that's the link to share.

## Files

- `index.html` — the whole app (bracket, voting, stats, badges, admin panel).
- `Code.gs` — Apps Script backend, already deployed as a Web App and wired into `index.html`'s `CONFIG.API_URL`.

## Admin

Tap the title 5 times, PIN `5207`.
