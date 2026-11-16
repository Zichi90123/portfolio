---
title: "Un punteggio misurato sul campo: come ho tarato FM Valutatore"
description: "Un punteggio dei giocatori di Football Manager sembrava giusto finché non l'ho confrontato con le medie voto vere. Cosa ho misurato, cosa ho cambiato e cosa non ha funzionato."
date: 2026-11-17
project: fm-valutatore
tags: [Dati, Statistica, TypeScript, Football Manager]
---

[FM Valutatore](/progetti/fm-valutatore) dà a ogni giocatore di Football Manager 26 un punteggio da 0 a 100
per ogni ruolo della tattica. Il primo punteggio era ragionevole sulla carta, e sbagliato in un modo che si
vede solo misurando. Questa è la storia di come l'ho misurato.

## Il punteggio di partenza

In FM ogni ruolo ha attributi **chiave** e **preferiti**: un regista ha bisogno di passaggi e visione, un
centrale di marcatura e colpo di testa. Il primo punteggio era la media pesata di quegli attributi, con peso
2 per i chiave e 1 per i preferiti, riportata su 100. Lo chiamo **aderenza al ruolo**.

Sembrava giusto: chi ha gli attributi del ruolo, gioca bene nel ruolo. Ma "sembrava" non è una misura.

## Primo controllo: il giudizio del gioco

FM mostra per ogni giocatore delle stelle in ogni ruolo. Con un tasto di FM Exporter ho letto **1.009
valutazioni a stelle di 28 giocatori** e le ho confrontate con il punteggio:

- correlazione **0,60**: il punteggio sale con le stelle (circa 58 a una stella, 79 a quattro);
- per lo stesso giocatore, il ruolo con il punteggio più alto coincide con quello con più stelle in **17
  casi su 25**;
- nessun'altra combinazione di pesi fa meglio in modo significativo. Pesare i chiave come i preferiti
  peggiora (13 su 25), ignorarli sbaglia quasi sempre.

Buona notizia, ma con un limite: misura quanto il punteggio **concorda con il gioco**, non quanto prevede il
**rendimento**. Sono due domande diverse.

## Secondo controllo: il campo

Il rendimento in FM c'è: la **media voto** in partita. FM Exporter esporta presenze e media voto, e la
scheda *Verifica* confronta il punteggio con la media voto dei giocatori con abbastanza presenze.

Il primo tentativo, su tutti i giocatori insieme, ha dato una correlazione di **0,09**. Quasi zero. Il
punteggio era inutile?

No: era sbagliato il confronto. La media voto dipende dal **livello del campionato**. Un 7 in un campionato
debole non vale un 7 in Premier League, e mescolando squadre diverse il rumore copre tutto. Il confronto
giusto è **tra compagni di squadra**: per ogni giocatore, lo scarto della sua media voto da quella della sua
squadra, contro lo scarto del suo punteggio da quello dei compagni.

Su circa 5.500 giocatori con almeno 10 presenze, tra compagni di squadra:

| Punteggio | Correlazione con la media voto |
| --- | --- |
| Solo aderenza al ruolo | 0,15 |
| 60% ruolo + 40% CA | 0,26 |
| 40% ruolo + 60% CA | 0,30 |
| Solo CA | 0,33 |

L'aderenza al ruolo da sola prevede poco. Quello che prevede di più è la **CA** (*current ability*),
l'abilità complessiva che FM calcola per ogni giocatore e che tiene nascosta.

## La scelta: il 60%

La CA da sola vince, ma non dice nulla del ruolo: un grande centrale e un grande trequartista con la stessa
CA avrebbero lo stesso punteggio in ogni slot. Il punteggio attuale è quindi un compromesso:

> punteggio dello slot = 40% aderenza al ruolo + 60% CA (riportata su 100)

Il 60% tiene quasi tutto il guadagno (0,30 contro 0,33) e lascia al ruolo il compito di decidere **dove**
far giocare un giocatore. Il peso si può cambiare dall'interfaccia: con 0% si torna al solo ruolo.

## Senza i dati nascosti: stimare la CA

Resta un problema: la CA è un dato nascosto. Si vede solo attivando un'opzione del gioco che molti non
usano. Senza, il punteggio perderebbe la sua parte più utile.

FM calcola la CA dagli attributi, con pesi che dipendono dalla posizione. Quindi la si può **ricostruire**:
ho misurato una formula lineare per reparto (un peso per ognuno dei 47 attributi, più una costante) su tre
salvataggi con la CA visibile, e l'ho verificata da un salvataggio all'altro.

```ts
// CA = costante + somma(pesi × attributi), con i pesi del reparto del giocatore.
// Un attributo sconosciuto vale la media del reparto, spostata del livello del giocatore
// sugli attributi noti.
const shift = known.reduce((a, b) => a + b, 0) / known.length
const total = values.reduce((sum, v, i) => sum + pesi[i] * (v ? mid(v) : medie[i] + shift), costante)
```

Correlazione con la CA vera tra **0,93 e 0,99**, errore medio di **±3 punti su 200** con tutti gli
attributi. Il dettaglio che conta è come si trattano gli attributi mancanti: i giocatori poco osservati
mostrano soprattutto i loro punti forti, e riempire i buchi con la media del reparto li sopravvaluterebbe.
Spostare la media del **livello del giocatore**, misurato sugli attributi noti, tiene l'errore tra ±4 e ±7
anche con 10–46 attributi noti. Sotto i 10 la stima non si fa: l'errore sale a ±13. Sul punteggio finale la
differenza tra CA vera e stimata è in media di 0,8 punti.

## Il tentativo che non ha funzionato

Visto che la media voto è il bersaglio, perché non imparare direttamente i pesi degli attributi da lì? L'ho
provato: una **regressione ridge** sui 47 attributi per reparto, su due stagioni indipendenti (4.164 e 2.453
giocatori), imparando su una e verificando sull'altra.

Risultato: **in nessun reparto** i pesi imparati battono la sola CA (centrali 0,35 contro 0,47,
centrocampisti 0,31 contro 0,48). In più erano instabili tra le due stagioni e a volte assurdi, come i
passaggi con peso negativo per i centrocampisti. Inseguivano il rumore.

La causa probabile è nei dati: il **91%** dei giocatori non è osservato bene, quindi i loro attributi sono
intervalli, mentre la CA è un numero esatto. Ho tenuto il punteggio com'era e annotato quando ritentare: con
molti giocatori osservati bene.

## Cosa mi porto via

- **Misurare prima, sul bersaglio vero.** La concordanza con le stelle del gioco mi aveva rassicurato, ma
  rispondeva a un'altra domanda. Il confronto con la media voto ha cambiato la formula.
- **Il confronto giusto vale più del modello.** Passare da "tutti contro tutti" a "tra compagni di squadra"
  ha fatto passare la correlazione da 0,09 a valori interpretabili, senza toccare il punteggio.
- **Un esperimento fallito è un risultato.** La regressione non è entrata nell'app, ma ha confermato che il
  60% di CA è una scelta sensata e ha detto quali dati servirebbero per fare meglio.
