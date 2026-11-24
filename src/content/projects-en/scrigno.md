---
summary: "A zero-knowledge manager for environment variables: web app, desktop app and CLI, encryption in the browser, a server that only sees encrypted blobs."
---

## The problem

With many side projects, `.env` files end up scattered across folders, chats and notes. Existing services
either cost money or ask you to trust their server.

## What it does

- Keeps each project's variables by environment (dev, staging, prod), with `.env` import and export.
- From the command line, `scrigno pull my-app -e dev` fetches an environment and
  `scrigno run my-app -e dev -- npm start` injects the variables without writing any file.
- Keeps the last 20 versions of each environment, with diffs and restore, from the CLI too
  (`scrigno history`, `--version N`).
- Installs as a PWA or as a desktop app for Windows and Linux, and locks itself after 15 minutes of
  inactivity.
- While the vault is unlocked in the desktop app, the CLI asks for a confirmation in the app instead of the
  master password.

It is a personal instance behind a login, so instead of a demo there is a video recorded on a local
install with fake data.

## Technical choices

- **Client-side encryption**: master password → PBKDF2 (600,000 iterations) → vault key → project key →
  variables, with AES-256-GCM. The AAD binds each blob to its project and environment, so the server
  cannot swap them.
- **Cloudflare Access in front of the app**, with the Worker verifying the JWT again on every request and
  failing closed if Access is not configured.
- **One core for web, desktop and CLI** (`@scrigno/core`): cryptography, `.env` parser and API client are
  written once. The desktop app is an Electron shell around the same interface.
- **Signed desktop updates**: CI publishes the installers on tags, and the app accepts an update only if the
  manifest has a valid Ed25519 signature and the downloaded file matches its hash.
- **Zero cost**: Workers, D1 and Zero Trust all fit in Cloudflare's free plans.

## Challenges

- **The server can't help.** It only sees encrypted blobs, so it cannot merge two edits to the same
  environment. Each save carries its version and, if that version is stale, the API answers 409 instead of
  overwriting.
- **Service worker and login.** An Access response stuck in the cache could break sign-in. The service
  worker keeps only the app shell, never intercepts `/api` and leaves login redirects to the browser.
- **No forgotten endpoints.** The API tests list every endpoint with its user-isolation check: a new
  endpoint missing from the list fails the suite.
- **History without reading the data.** The server archives previous versions as encrypted blobs; the
  client computes the diff between two versions after decrypting them.
- **No biometric unlock, by choice.** Windows Hello looked convenient, but it needs a copy of the vault key
  saved on disk. With `safeStorage` any program started by the user could read it, and the biometric check
  would only be a check in the app's code. The proper version, with the key in the TPM, costs too much for
  the benefit, so the decision is documented and postponed.
