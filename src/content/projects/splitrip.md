---
title: Splitrip
summary: "Tracker delle spese di viaggio, anche di gruppo e offline: budget, valute e rimborsi in pochi tocchi."
status: online
category: web
tech: [React, Vite, Go, AWS Lambda, PostgreSQL, Cloudflare Pages, PWA]
links:
  demo: https://splitrip.dev
cover: /media/splitrip.webp
video: /media/splitrip.mp4
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

## Difficoltà

- **Offline davvero.** Una spesa registrata senza rete resta in coda nel browser e parte al ritorno della
  connessione. Ma il browser può cancellare quella memoria quando manca spazio, e Safari lo fa dopo pochi
  giorni se l'app non è installata: l'app chiede la memoria persistente alla prima spesa in coda.
- **Conflitti tra membri del gruppo.** Se due persone cambiano la stessa spesa, una offline e una online,
  l'app mostra entrambe le versioni e fa scegliere, invece di sovrascrivere in silenzio.
- **Stessi conti in due linguaggi.** Divisione e saldi sono calcolati sia in Go (API) sia in TypeScript
  (anteprima offline): un set di casi di test condiviso, eseguito da entrambe le suite, li tiene allineati.
- **Zero euro al mese.** Tutto sta nei piani gratuiti, con un tetto alla concorrenza della Lambda come
  limite ai costi.
