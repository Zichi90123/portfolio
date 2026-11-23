---
title: Scrigno
summary: "Gestore zero-knowledge delle variabili d'ambiente: web app e CLI, cifratura nel browser, server che vede solo blob cifrati."
status: in-sviluppo
category: strumenti
tech: [TypeScript, React, Cloudflare Workers, Hono, D1, Web Crypto, PWA]
# Personal instance behind Cloudflare Access and private repository: no public demo or code link.
cover: /media/scrigno.webp
video: /media/scrigno.mp4
featured: true
order: 5
---

## Il problema

Con molti side project i file `.env` finiscono sparsi tra cartelle, chat e note. I servizi esistenti
costano o chiedono di fidarsi del server.

## Cosa fa

- Raccoglie le variabili di ogni progetto per ambiente (dev, staging, prod), con import ed export di file
  `.env`.
- Dalla riga di comando, `scrigno pull my-app -e dev` recupera un ambiente e
  `scrigno run my-app -e dev -- npm start` inietta le variabili senza scrivere file.
- Si installa come PWA e si blocca da solo dopo 15 minuti di inattività.

È un'istanza personale protetta da login, quindi al posto della demo c'è un video registrato su
un'installazione locale con dati finti.

## Scelte tecniche

- **Cifratura lato client**: master password → PBKDF2 (600.000 iterazioni) → chiave del vault → chiave di
  progetto → variabili, con AES-256-GCM. L'AAD lega ogni blob al suo progetto e ambiente, così il server
  non può scambiarli.
- **Cloudflare Access davanti all'app**, con il Worker che verifica di nuovo il JWT a ogni richiesta e
  fallisce in modo chiuso se Access non è configurato.
- **Stesso nucleo per web e CLI** (`@scrigno/core`): crittografia, parser `.env` e client API sono scritti
  una volta sola.
- **Costo zero**: Workers, D1 e Zero Trust rientrano nei piani gratuiti di Cloudflare.

## Difficoltà

- **Il server non può aiutare.** Vede solo blob cifrati, quindi non può unire due modifiche allo stesso
  ambiente. Ogni salvataggio porta la sua versione e, se è vecchia, l'API risponde 409 invece di
  sovrascrivere.
- **Service worker e login.** Una risposta di Access finita in cache potrebbe rompere l'accesso. Il service
  worker conserva solo l'app shell, non intercetta mai `/api` e lascia i redirect di login al browser.
- **Nessun endpoint dimenticato.** I test dell'API elencano ogni endpoint con il suo controllo di
  isolamento tra utenti: un endpoint nuovo che non compare nell'elenco fa fallire la suite.
