---
summary: "A PWA to follow TV series and films: the next episode in one tap and a notification on release day."
---

## The problem

When you follow many series across different platforms you lose track: which episode is next, when the
next one comes out, and which service it is on.

## What it does

- For every series, the next episode that is already out and not yet watched, ticked off with one tap.
- A calendar of releases over the next 30 days, with new seasons, finales and breaks.
- Push notifications on the morning of the release, on iPhone too when the app is installed.
- A demo without sign-up: every visitor gets an account already full of shows, valid for 24 hours.

## Technical choices

- **Next.js frontend on Vercel** that also proxies `/api/*`, so the session cookie stays first-party.
- **Go API on AWS Lambda (arm64)** with PostgreSQL on Neon and Redis on Upstash: pay-per-use costs, close to
  zero with little traffic.
- **Scheduled jobs** with EventBridge Scheduler: data refresh at 4 am and notifications at 9 am.
- **Deploys from GitHub Actions** with OIDC to AWS: tests, migrations, Lambda and Vercel, with no static
  keys.

## Challenges

- **The heart of the app is one query.** The next episode to watch has to account for specials, episodes
  with no date, non-contiguous seasons and time zones. With explicit SQL (sqlc, no ORM) a single query
  computes it for all of a user's series: 36 ms with 200 series and 14,400 episodes, with tests on the edge
  cases.
- **A public API that has to stay private.** The Lambda has a URL anyone can reach, which would have let
  people bypass the frontend and the per-IP limits. The Next proxy adds a shared secret to every request and
  the API rejects all the others.
- **TMDB's limits.** Responses stay cached in Redis for a day, a week for data that no longer changes, and
  up to 30 days as a fallback when TMDB does not answer.
- **Releases without downtime.** Migrations run before the new code and must also work with the old one;
  the frontend always ships after the API it needs.

## What I would do differently

- I would ask AWS to move SES out of the sandbox from day one: while it stays there, password reset emails
  only reach verified addresses.
- I would design for the installed PWA from the start: on iPhone, push notifications only arrive when the
  app is on the Home Screen, and users need to be told.
