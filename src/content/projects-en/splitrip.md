---
summary: "A travel expense tracker, for groups and offline too: budget, currencies and settle-ups in a few taps."
---

## The problem

On a trip, expenses pile up in different currencies and between several people: by the end nobody knows
how much they really spent, or who owes what to whom.

## What it does

- An expense is logged in a few seconds; remaining budget and daily average always in view.
- Over 150 currencies, converted at the day's official ECB rate, with the rate stored in the expense.
- Group trips with invite links, split expenses and suggested settle-ups with at most n−1 payments.
- Works offline: expenses logged without a connection are sent automatically when it comes back.

## Technical choices

- **React + Vite frontend on Cloudflare Pages**, installable as a PWA.
- **Go API on AWS Lambda (arm64)** with PostgreSQL on Neon.
- **Offline sync with conflict handling**: if another member changed the same expense, the app shows both
  versions and lets you choose.
- **Privacy**: export of all your data as JSON and account deletion; in group trips the deleted user stays
  anonymous so that everyone else's balances still add up.

## Challenges

- **Really offline.** An expense logged without a connection waits in a queue in the browser and is sent
  when the connection returns. But the browser can wipe that storage when space runs low, and Safari does it
  after a few days if the app is not installed: the app asks for persistent storage on the first queued
  expense.
- **Conflicts between group members.** If two people change the same expense, one offline and one online,
  the app shows both versions and lets you choose, instead of silently overwriting.
- **The same maths in two languages.** Splits and balances are computed both in Go (API) and in TypeScript
  (offline preview): a shared set of test cases, run by both test suites, keeps them in line.
- **Zero euros a month.** Everything fits in free tiers, with a cap on Lambda concurrency as a cost limit.

## What I would do differently

- I would put end-to-end tests in the repository from the start. At first I tried the flows with throwaway
  Puppeteer scripts; today there are eight Playwright flows in CI, and the deploy only starts if they pass.
- I would merge conflicts field by field: today you are asked to choose even when one person changed the
  note and the other the amount.
- I would generate the frontend types from an OpenAPI contract instead of writing them by hand.
