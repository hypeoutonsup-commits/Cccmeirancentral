# CCC Meiran Central Parish

Celestial Church of Christ website. Vite + React single-page app.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy on Netlify

Build settings live in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 22

Client-side routes (`/community`, `/donate`, and the rest) rewrite to `index.html` so a refresh does not 404. The same rule is in `public/_redirects`, which Vite copies into `dist/`, and `npm run build` also copies `index.html` to `dist/404.html`.

Netlify’s production branch has to be the branch that contains `vite.config.js`. A build of `main` without that file still succeeds, then the live page stays blank: JSX is compiled to `React.createElement` and the components never import `React`. After this change is on the branch Netlify builds, open the site in Netlify and choose **Trigger deploy → Deploy site**.

### Continuous deployment

1. Push this repository to GitHub.
2. In the [Netlify dashboard](https://app.netlify.com/), choose **Add new site** → **Import an existing project**.
3. Authorize GitHub and select this repository.
4. Netlify reads `netlify.toml`, so leave the build command as `npm run build` and the publish directory as `dist`.
5. Deploy. Pushes to the production branch publish the live site. Pull requests get a preview URL.

### Manual deploy with the CLI

```bash
npx netlify login
npx netlify init
npm run build
npx netlify deploy          # preview URL
npx netlify deploy --prod   # production
```

Do not commit secrets. Set any private values under Site settings → Environment variables. The Firebase web config in `src/firebase/config.js` is the public client config and is safe to ship in the bundle.
