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

## Difficoltà

- **Il cuore dell'app è una query.** Il prossimo episodio da vedere deve tenere conto di speciali, episodi
  senza data, stagioni non contigue e fusi orari. Con SQL esplicito (sqlc, niente ORM) una sola query lo
  calcola per tutte le serie dell'utente: 36 ms con 200 serie e 14.400 episodi, con test sui casi limite.
- **Un'API pubblica che deve restare privata.** La Lambda ha un indirizzo raggiungibile da chiunque, che
  avrebbe permesso di scavalcare il frontend e i limiti per IP. Il proxy di Next aggiunge a ogni richiesta
  un segreto condiviso e l'API rifiuta tutte le altre.
- **I limiti di TMDB.** Le risposte restano in cache su Redis per un giorno, una settimana per i dati che
  non cambiano più, e fino a 30 giorni come riserva se TMDB non risponde.
- **Rilasci senza interruzioni.** Le migrazioni girano prima del codice nuovo e devono funzionare anche con
  quello vecchio; il frontend arriva sempre dopo l'API che gli serve.

<!-- DA SCRIVERE: "cosa farei diversamente" (non ricavabile dalle note del progetto). -->
<!-- Video di 15–30 s (SP-104). -->
