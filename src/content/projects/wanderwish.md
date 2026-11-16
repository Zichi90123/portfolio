---
title: WanderWish
summary: "Per preparare un viaggio: cambio valuta con tassi aggiornati e clima storico di più città a confronto, in italiano e inglese."
status: online
category: web
tech: [Next.js, NestJS, PostgreSQL, Prisma, Redis, Nx, Vercel, Render]
links:
  demo: https://www.wander-wish.com/it
cover: /media/wanderwish.webp
video: /media/wanderwish.mp4
featured: true
order: 3
---

## Il problema

Preparare un viaggio vuol dire dieci schede aperte: un convertitore per capire quanto costa davvero l'hotel,
un sito meteo per capire che tempo troverai, e nessuno dei due ricorda cosa avevi cercato.

## Cosa fa

- **Cambio valuta** con i tassi aggiornati, e la cronologia delle conversioni per chi ha un account.
- **Confronto del clima** di fino a 6 città in un mese a scelta: temperature, giorni di pioggia, sole e vento,
  calcolati sugli ultimi 30 anni e divisi tra inizio, metà e fine mese.
- **Tutto senza registrazione**; con l'account la board del clima e le ricerche si ritrovano alla visita
  successiva.
- In italiano e in inglese.

## Scelte tecniche

- **Un'app e un'API per ogni strumento.** Il frontend usa le Multi-Zones di Next.js: la home inoltra
  `/climate` e `/travelrate` ad app separate, pubblicate ognuna per conto suo su Vercel. Dietro, microservizi
  NestJS in un monorepo Nx.
- **Login in un solo posto, verifica ovunque.** Solo `auth-api` conosce le password ed emette JWT di 15 minuti
  in cookie httpOnly; gli altri servizi verificano la firma da soli con una libreria condivisa, senza
  chiamarlo a ogni richiesta. Il prezzo: niente revoca immediata dei token.
- **Un solo PostgreSQL condiviso**, con lo schema Prisma nella libreria comune: più semplice da gestire di un
  database per servizio, al costo di servizi meno isolati sui dati.
- **Piani gratuiti ovunque**: Vercel, Render, Supabase, Upstash per Redis e Grafana Cloud per i log
  centralizzati.

## Difficoltà

- **Un clima che non inganni.** Minime e massime sono la media dei valori giornalieri su 30 anni, non i
  record, che mescolerebbero ondate di caldo di anni diversi. I giorni di pioggia scartano i 3 anni più
  piovosi e i 3 più asciutti: un fattore correttivo fisso, confrontato con i dati di stazioni meteo reali,
  cambiava troppo da città a città. Sereno o nuvoloso si ricava dalle ore di sole, perché il codice meteo
  storico si è rivelato inaffidabile proprio su questa distinzione.
- **Migrazioni senza il comando di pre-deploy**, che il piano gratuito di Render non ha: le applica il
  container all'avvio, in modo sicuro anche quando più servizi partono insieme sullo stesso schema.
- **Cache dove serve.** Un confronto chiede 30 anni di dati a Open-Meteo: ogni combinazione di città, mese e
  lingua resta in cache su Redis. I tassi di cambio si aggiornano con un job orario.

## Cosa farei diversamente

- Spiegherei prima cosa fa il sito e poi lo stile: oggi la home racconta l'atmosfera prima degli strumenti.
- Collegherei i moduli fin dall'inizio con un oggetto "Viaggio" condiviso, così meta e date si scrivono una
  volta sola invece che in ogni strumento.
- Terrei conto da subito degli avvii a freddo: sul piano gratuito di Render un servizio inattivo può
  impiegare quasi un minuto a rispondere alla prima richiesta.
