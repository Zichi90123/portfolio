---
summary: "A zero-knowledge manager for environment variables: web app and CLI, encryption in the browser, a server that only sees encrypted blobs."
---

## The problem

With many side projects, `.env` files end up scattered across folders, chats and notes. Existing services
either cost money or ask you to trust their server.

## What it does

- Keeps each project's variables by environment (dev, staging, prod), with `.env` import and export.
- From the command line, `scrigno pull my-app -e dev` fetches an environment and
  `scrigno run my-app -e dev -- npm start` injects the variables without writing any file.
- Installs as a PWA and locks itself after 15 minutes of inactivity.

It is a personal instance behind a login, so instead of a demo there is a video recorded on a local
install with fake data.

## Technical choices

- **Client-side encryption**: master password → PBKDF2 (600,000 iterations) → vault key → project key →
  variables, with AES-256-GCM. The AAD binds each blob to its project and environment, so the server
  cannot swap them.
- **Cloudflare Access in front of the app**, with the Worker verifying the JWT again on every request and
  failing closed if Access is not configured.
- **One core for web and CLI** (`@scrigno/core`): cryptography, `.env` parser and API client are written
  once.
- **Zero cost**: Workers, D1 and Zero Trust all fit in Cloudflare's free plans.

## Challenges

- **The server can't help.** It only sees encrypted blobs, so it cannot merge two edits to the same
  environment. Each save carries its version and, if that version is stale, the API answers 409 instead of
  overwriting.
- **Service worker and login.** An Access response stuck in the cache could break sign-in. The service
  worker keeps only the app shell, never intercepts `/api` and leaves login redirects to the browser.
- **No forgotten endpoints.** The API tests list every endpoint with its user-isolation check: a new
  endpoint missing from the list fails the suite.
