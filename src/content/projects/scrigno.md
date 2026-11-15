---
title: Scrigno
summary: "Gestore zero-knowledge delle variabili d'ambiente: web app e CLI, cifratura nel browser, server che vede solo blob cifrati."
status: in-sviluppo
category: strumenti
tech: [TypeScript, React, Cloudflare Workers, Hono, D1, Web Crypto]
featured: true
order: 3
# Not deployed yet (SP-112): stays a draft until there is a demo or a video.
draft: true
---

## Il problema

Con molti side project i file `.env` finiscono sparsi tra cartelle, chat e note. I servizi esistenti
costano o chiedono di fidarsi del server.

## Scelte tecniche

- **Cifratura lato client**: master password → PBKDF2 (600.000 iterazioni) → chiave del vault → chiave di
  progetto → variabili, con AES-256-GCM. L'AAD lega ogni blob al suo progetto e ambiente, così il server
  non può scambiarli.
- **Cloudflare Access davanti all'app**, con il Worker che verifica di nuovo il JWT a ogni richiesta e
  fallisce in modo chiuso se Access non è configurato.
- **Stesso nucleo per web e CLI** (`@scrigno/core`): `scrigno run my-app -e dev -- npm start` inietta le
  variabili senza scrivere file.

<!-- BOZZA: difficoltà, "cosa farei diversamente", video della demo. -->
