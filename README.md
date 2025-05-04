# Hofflabs Hub Instructions

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# bun
bun run dev
```

## Production

Build the application for production (client + server):

```bash
# npm
npm run build

# bun
bun run build
```

Locally preview the production build:

```bash
# npm
npm run preview

# bun
bun run preview
```

---

## Advanced Builds

### Build only the server (Nitro worker / API layer):

```bash
# npm
npx nuxi build
# server output: .output/server/

# bun
bunx nuxi build
# server output: .output/server/
```

To run server only:

```bash
node .output/server/index.mjs
```

### Build only the static frontend (Vue pages, public, .vue files):

```bash
# npm
npx nuxi generate
# output: dist/

# bun
bunx nuxi generate
# output: dist/
```

Or get built frontend assets only from:

```
.output/public/
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
