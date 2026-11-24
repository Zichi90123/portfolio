---
summary: "A travel expense tracker, for groups and offline too: budget, currencies and settle-ups in a few taps."
---

## The problem

On a trip, expenses pile up in different currencies and between several people: by the end nobody knows
how much they really spent, or who owes what to whom.

## What it does

- An expense is logged in a few seconds; remaining budget and daily average always in view.
- Over 150 currencies, converted at the day's official ECB rate, with the rate stored in the expense.
- Group trips with invite links, split expenses and suggested settle-ups with at most n−1 payments; whoever
  has to pay sees the recipient's IBAN or payment link (e.g. PayPal.me).
- People without an account can be added to a group by name only: when they sign up through a personal
  invite they take over the placeholder, with its expenses, shares and settle-ups.
- Push notifications for new expenses, received settle-ups and budget at 80% and 100%.
- Interface in Italian, English, Spanish, French and German.
- Works offline: expenses logged without a connection are sent automatically when it comes back.

## Technical choices

- **React + Vite frontend on Cloudflare Pages**, installable as a PWA.
- **Go API on AWS Lambda (arm64)** with PostgreSQL on Neon.
- **OpenAPI contract generated from the Go types**, and the frontend's TypeScript types generated from it:
  CI fails if a route is missing or if a real test response doesn't match the schema.
- **Deploys from GitHub Actions via OIDC**, with no stored keys: the AWS deploy role can only be assumed
  from the `main` branch. Infrastructure in Terraform.
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
- **From placeholder to real account.** A participant without an account may already have paid and split
  expenses by the time they sign up: everything moves to the new account with identical balances, and even
  offline edits that still reference the old id end up on the right account.
- **Zero euros a month.** Everything fits in free tiers, with a cap on Lambda concurrency as a cost limit.
