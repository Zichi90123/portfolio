---
title: Nextep
summary: "PWA per seguire serie TV e film: il prossimo episodio a un tocco e una notifica il giorno dell'uscita."
status: online
category: web
tech: [Next.js, Go, AWS Lambda, PostgreSQL, Redis, Web Push, PWA]
links:
  demo: https://www.nexteptv.com
cover: /media/nextep.webp
featured: true
order: 1
---

## Il problema

Chi segue molte serie su piattaforme diverse perde il filo: quale episodio tocca, quando esce il prossimo,
su quale servizio si guarda.

## Cosa fa

- Per ogni serie il prossimo episodio già uscito e non visto, da segnare con un tocco.
- Calendario delle uscite dei prossimi 30 giorni, con nuove stagioni, finali e pause.
- Notifiche push la mattina dell'uscita, anche su iPhone con l'app installata.
- Demo senza registrazione: ogni visitatore riceve un account già pieno, valido 24 ore.

## Scelte tecniche

- **Frontend Next.js su Vercel** che fa anche da proxy per `/api/*`, così il cookie di sessione resta
  first-party.
- **API in Go su AWS Lambda (arm64)** con PostgreSQL su Neon e Redis su Upstash: costi a consumo, vicini
  allo zero con poco traffico.
- **Job pianificati** con EventBridge Scheduler: aggiornamento dei dati alle 4 e notifiche alle 9.
- **Deploy da GitHub Actions** con OIDC verso AWS: test, migrazioni, Lambda e Vercel, senza chiavi
  statiche.

<!-- BOZZA: difficoltà incontrate e "cosa farei diversamente" (da scrivere). Video di 15–30 s (SP-104). -->
