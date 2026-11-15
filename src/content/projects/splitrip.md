---
title: Splitrip
summary: "Tracker delle spese di viaggio, anche di gruppo e offline: budget, valute e rimborsi in pochi tocchi."
status: online
category: web
tech: [React, Vite, Go, AWS Lambda, PostgreSQL, Cloudflare Pages, PWA]
links:
  demo: https://splitrip.dev
cover: /media/splitrip.webp
featured: true
order: 2
---

## Il problema

In viaggio le spese si accumulano in valute diverse e tra più persone: a fine viaggio nessuno sa quanto
ha speso davvero né chi deve cosa a chi.

## Cosa fa

- Una spesa si registra in pochi secondi; budget residuo e media giornaliera sempre visibili.
- Oltre 150 valute, convertite al cambio ufficiale BCE del giorno, con il tasso salvato nella spesa.
- Viaggi di gruppo con inviti via link, divisione delle spese e rimborsi proposti con al massimo
  n−1 pagamenti.
- Funziona offline: le spese registrate senza rete partono da sole al ritorno della connessione.

## Scelte tecniche

- **Frontend React + Vite su Cloudflare Pages**, installabile come PWA.
- **API in Go su AWS Lambda (arm64)** con PostgreSQL su Neon.
- **Sincronizzazione offline con gestione dei conflitti**: se un altro membro ha cambiato la stessa spesa,
  l'app mostra le due versioni e fa scegliere.
- **Privacy**: export di tutti i propri dati in JSON ed eliminazione dell'account; nei viaggi di gruppo
  l'utente eliminato resta anonimo perché i conti degli altri tornino.

<!-- BOZZA: difficoltà incontrate e "cosa farei diversamente" (da scrivere). Video di 15–30 s (SP-104). -->
