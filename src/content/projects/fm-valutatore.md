---
title: FM Valutatore + FM Exporter
summary: "Per Football Manager 26: un plugin estrae rosa, tattica e mercato con un tasto, un'app Windows valuta i giocatori per ogni ruolo della tattica."
status: online
category: strumenti
tech: [C#, BepInEx, IL2CPP, TypeScript, Electron, React, Vitest]
downloads:
  - label: FM Valutatore
    url: https://github.com/Zichi90123/fm-valutatore/releases/latest
  - label: FM Exporter
    url: https://github.com/Zichi90123/fm-exporter/releases/latest
cover: /media/fm-valutatore.webp
video: /media/fm-valutatore.mp4
order: 4
---

## Il problema

In Football Manager 26 confrontare centinaia di giocatori per i ruoli della propria tattica si fa a occhio:
l'esportazione del gioco salva solo le righe visibili a schermo, e le valutazioni a stelle esistono solo per
i giocatori già osservati.

## Cosa fa

- **FM Exporter**, plugin dentro il gioco: con **F8** aggiorna tutto (rosa, tattica, contratti, Database
  giocatori, budget) spostandosi da solo tra le schermate; **F9** esporta liste intere, anche di migliaia di
  giocatori; altri tasti leggono gli attributi chiave e preferiti di ogni ruolo.
- **FM Valutatore**, app Windows che si aggiorna quando arrivano file nuovi: punteggio di ogni giocatore in
  ogni slot della tattica, formazione ideale e riserve, mercato confrontato con titolare o riserva,
  **miglior combinazione di acquisti** dentro budget trasferimenti e spazio salariale, piano della rosa per
  le prossime stagioni, attributi da allenare.
- Funziona con il gioco in italiano e in inglese.

## Scelte tecniche

- **Plugin C# per BepInEx su IL2CPP**, che legge l'interfaccia del gioco. Le liste sono tabelle
  virtualizzate (il gioco disegna solo le righe visibili): il plugin le fa scorrere a passi e raccoglie le
  righe per indice finché non le ha tutte.
- **Navigazione che non dipende dalla lingua**: i segnalibri si riconoscono dall'icona, e l'input passa solo
  dai clic e dagli eventi di conferma del gioco stesso.
- **App Electron e React con il calcolo in TypeScript puro**, separato dall'interfaccia e coperto da test
  con Vitest.
- **Formazione ideale come assegnazione ottima** dei giocatori agli slot (algoritmo ungherese), non il
  migliore slot per slot. La combinazione di acquisti è una ricerca esaustiva con potatura sui migliori
  candidati di ogni slot.

## Difficoltà

- **Nessuna API, e il gioco cambia a ogni patch.** All'avvio il plugin controlla le 35 classi e i membri
  interni che usa e, se un aggiornamento ne rompe qualcuno, dice quali funzioni non andranno. Per far
  partire BepInEx su FM26 sono servite due correzioni, ora documentate nell'installazione.
- **Senza i dati nascosti del gioco.** L'abilità complessiva (CA) è stimata dagli attributi con una formula
  per reparto misurata su tre salvataggi, circa 17.000 giocatori: correlazione 0,93–0,99, errore medio ±3
  su 200.
- **Quanto pesare l'abilità rispetto al ruolo.** Confrontato con le medie voto di 5.500 giocatori, la sola
  aderenza al ruolo prevede poco il rendimento (0,15), la sola CA di più (0,33): il 60% di CA tiene quasi
  tutto il guadagno (0,30) senza che il ruolo smetta di contare. I pesi degli attributi sono verificati su
  1.009 valutazioni a stelle del gioco.
- **Un plugin che la CI non può compilare**, perché servono le librerie di FM26: in CI si controllano il
  catalogo dei ruoli e la coerenza delle versioni, la release si pubblica da locale.

## Cosa farei diversamente

- Misurerei prima sul rendimento reale. Il primo punteggio si basava solo sull'aderenza al ruolo, e solo il
  confronto con le medie voto ha mostrato che la CA conta di più.
- Proverei le regole economiche su budget molto diversi: il primo costo del denaro, una cifra fissa per
  milione, con budget alti escludeva quasi ogni titolare; ora è relativo al budget.
