# Portfolio

Sito personale di Andrea Zichittella: i progetti, le scelte tecniche dietro ognuno, chi sono.
Definizione del progetto in [PRD.md](PRD.md).

**Stack:** Astro 7 + TypeScript + Tailwind CSS 4, sito statico su Cloudflare Pages.

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:4321 (mostra anche le bozze)
npm run build    # astro check + build statica in dist/
npm run preview
```

## Aggiungere un progetto

Un file Markdown in `src/content/projects/` (più immagine o video in `public/media/`), senza toccare il
codice. I campi sono validati in build (`src/content.config.ts`):

```yaml
---
title: Nome
summary: "Una frase, al massimo 160 caratteri."
status: online # oppure in-sviluppo
category: web # web | mobile | giochi | strumenti
tech: [Astro, TypeScript]
links:
  demo: https://...
  code: https://github.com/...
cover: /media/nome.webp
video: /media/nome.mp4
featured: true # in evidenza nella home (le prime 3)
order: 1
draft: false # true = visibile solo in `npm run dev`
---
```

Regola del PRD: un progetto pubblicato deve avere una demo (`links.demo`) o un video, altrimenti la build
fallisce. Finché non li ha, resta `draft: true`.

## CI e rilascio

- **CI** (GitHub Actions): build con `astro check`, link interni rotti (lychee), Lighthouse con soglia 95
  su prestazioni, accessibilità, best practice e SEO.
- **Deploy**: integrazione Git di Cloudflare Pages: `main` va in produzione, ogni altro branch ha la sua
  anteprima. Impostazioni del progetto Pages: build command `npm run build`, output `dist`,
  variabile `NODE_VERSION=24`.
