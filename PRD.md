# Portfolio — sito personale

> Definizione del progetto. Fonte: *PRD – Sito portfolio personale (2)*, 18/10/2026. Jira: space **POR**.
> Nessun codice ancora: questo file è l'unico punto di partenza.

## In breve

Sito statico che fa da vetrina a tutti i progetti: chi sono, cosa so fare, cosa ho costruito, come
contattarmi. Nel PRD è "il primo progetto da realizzare", perché ogni progetto successivo ci viene
aggiunto.

**Pubblico.** Recruiter (1–2 minuti sul sito, cercano tecnologie e progetti), sviluppatori del
colloquio tecnico (aprono codice e articoli), contatti professionali.

## Obiettivi

- Far capire in 10 secondi chi sono e che tipo di sviluppatore cerco di diventare
- Ogni progetto con demo, codice e spiegazione delle scelte tecniche
- Brevi articoli tecnici sui progetti
- Veloce, accessibile, curato: il sito stesso è un esempio del mio lavoro
- Nuovo progetto in pochi minuti, scrivendo un file Markdown

**Non obiettivi:** pannello di amministrazione o database, blog con commenti o newsletter,
animazioni pesanti.

## Pagine

| Pagina | Contenuto |
|---|---|
| Home | Nome, una frase su chi sono e cosa cerco, 3 progetti in evidenza, link a CV, GitHub, LinkedIn |
| Progetti | Griglia con anteprima, tecnologie e filtri (web, mobile, giochi) |
| Scheda progetto | Video o GIF, problema, tecnologie, scelte tecniche, difficoltà, link a demo e codice |
| Articoli | Note tecniche collegate ai progetti |
| Chi sono | Percorso, competenze per livello, cosa sto imparando |
| CV e contatti | CV in PDF, email, GitHub, LinkedIn |

Ogni scheda è un file Markdown con metadati (titolo, stato, tecnologie, link, immagine, in evidenza).
Un progetto compare solo con almeno l'MVP online, oppure con l'etichetta "In sviluppo" ma mai senza
demo o GIF.

**Progetti da mostrare oggi** (aggiornato rispetto al PRD): Nextep, Splitrip, WanderWish (planner e
marketplace), FM Valutatore/Exporter, Ink & Legends, Scrigno, poi Overhead, Ink Defense, Orbit,
Shelfie, Inkland man mano che hanno l'MVP online.

## Requisiti

**Funzionali**
- RF-01 Home con presentazione, 3 progetti in evidenza e link principali
- RF-02 Pagina progetti generata dai Markdown, con filtri per categoria e tecnologia
- RF-03 Scheda progetto con video, pulsanti demo, codice, articolo
- RF-04 Articoli con evidenziazione del codice e tempo di lettura
- RF-05 Chi sono e CV in PDF
- RF-06 Tema chiaro e scuro (segue il sistema, modificabile)
- RF-07 Italiano, struttura pronta per l'inglese
- RF-08 Anteprime Open Graph per LinkedIn e WhatsApp
- RF-09 Feed RSS degli articoli

**Non funzionali:** Lighthouse 95+ ovunque; home sotto i 300 KB esclusi i media (GIF convertite in
video o WebP); WCAG AA e tastiera; mobile da 360 px; sitemap e URL leggibili; nessun cookie di
tracciamento; CI che controlla build, link rotti e Lighthouse a ogni push.

## Sviluppo e rilascio a costo zero

| Pezzo | Scelta | Costo |
|---|---|---|
| Framework | Astro + TypeScript + Tailwind (come da PRD) | 0 |
| Hosting | **Cloudflare Pages** (o Workers static assets): banda illimitata, HTTPS, anteprime per ogni branch | 0 |
| Statistiche | Cloudflare Web Analytics: senza cookie, quindi senza banner | 0 |
| CI | GitHub Actions: build, link checker, Lighthouse CI | 0 (repo pubblico) |
| Dominio | `andreazichittella.com` (già usato come identificativo dell'app di Ink & Legends). In alternativa `*.pages.dev` | ~10–15 €/anno solo se non è già registrato |

- In locale: `astro dev`, nessun account necessario.
- Repository **pubblico**: il codice del portfolio è esso stesso materiale da colloquio, e i minuti
  di GitHub Actions sono illimitati.
- I video dimostrativi vanno compressi e serviti come file statici; se diventano pesanti, R2 (10 GB
  gratuiti) invece del repository.

## Roadmap indicativa

1. Scheletro Astro, home, pagina progetti da Markdown, deploy su Pages.
2. Schede dei progetti già online, CV, chi sono.
3. Articoli, RSS, Open Graph, tema scuro, inglese.
