---
summary: "For planning a trip: currency exchange with up-to-date rates and historical climate of several cities side by side, in English and Italian."
demo: https://www.wander-wish.com
---

## The problem

Planning a trip means ten open tabs: a converter to see what the hotel really costs, a weather site to see
what weather you will find, and neither of them remembers what you looked up.

## What it does

- **Currency exchange** with up-to-date rates, and a conversion history for signed-in users.
- **Climate comparison** of up to 6 cities in a month of your choice: temperatures, rainy days, sunshine and
  wind, computed over the last 30 years and split into the start, middle and end of the month.
- **No sign-up needed**; with an account, the climate board and searches are there on your next visit.
- In English and Italian.

## Technical choices

- **One app and one API per tool.** The frontend uses Next.js Multi-Zones: the home page forwards
  `/climate` and `/travelrate` to separate apps, each deployed on its own on Vercel. Behind them, NestJS
  microservices in an Nx monorepo.
- **Sign-in in one place, verification everywhere.** Only `auth-api` knows the passwords and issues
  15-minute JWTs in httpOnly cookies; the other services check the signature themselves with a shared
  library, without calling it on every request. The price: no immediate token revocation.
- **One shared PostgreSQL**, with the Prisma schema in the shared library: simpler to run than one database
  per service, at the cost of services being less isolated on data.
- **Free tiers everywhere**: Vercel, Render, Supabase, Upstash for Redis and Grafana Cloud for centralised
  logs.

## Challenges

- **A climate that does not mislead.** Lows and highs are the average of daily values over 30 years, not
  the records, which would mix heatwaves from different years. Rainy days drop the 3 wettest and the 3
  driest years: a fixed correction factor, checked against real weather station data, varied too much from
  city to city. Clear or cloudy is derived from hours of sunshine, because the historical weather code
  turned out to be unreliable on exactly this distinction.
- **Migrations without a pre-deploy command**, which Render's free tier does not have: the container applies
  them on startup, safely even when several services start together on the same schema.
- **Caching where it counts.** One comparison asks Open-Meteo for 30 years of data: every combination of
  city, month and language stays cached in Redis. Exchange rates are refreshed by an hourly job.
