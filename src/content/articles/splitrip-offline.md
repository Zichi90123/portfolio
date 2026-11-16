---
title: "Offline davvero: coda, idempotenza e conflitti in Splitrip"
description: "Come una PWA per le spese di viaggio salva le spese senza rete e le consegna una volta sola, anche quando un compagno di viaggio ha cambiato la stessa spesa."
date: 2026-11-17
project: splitrip
tags: [PWA, Offline, IndexedDB, Sincronizzazione, Go, TypeScript]
---

In viaggio la rete manca proprio quando serve: in metropolitana, in aereo, in montagna, all'estero senza
roaming. Per un'app che registra le spese questo non è un caso limite, è il caso normale. In
[Splitrip](/progetti/splitrip) "funziona offline" doveva voler dire una cosa precisa: **una spesa registrata
senza rete non si perde, arriva al server una volta sola, e se nel frattempo un compagno di viaggio l'ha
cambiata, nessuno sovrascrive l'altro senza saperlo.**

Ecco come ci sono arrivato, con i pezzi di codice che contano.

## 1. Una coda nel browser, non una copia del database

La prima tentazione è tenere in locale una copia completa dei dati e sincronizzarla. È la strada più
costosa: serve un motore di sincronizzazione, e i conflitti si moltiplicano. Splitrip fa una cosa più
piccola: tiene in **IndexedDB** solo una **coda delle modifiche** non ancora confermate (l'*outbox*). Il resto
dell'app legge dal server, con l'ultima risposta conservata per quando la rete manca.

Ogni operazione in coda porta con sé quello che serve per inviarla e per gestire un conflitto:

```ts
export type OutboxOp = {
  /** Per una spesa nuova è il suo client_id: il server la riconosce se arriva due volte. */
  id: string
  tripId: string
  kind: 'create' | 'update' | 'delete'
  expenseId?: string
  /** create: la spesa completa; update: solo i campi cambiati. */
  body?: ExpenseInput
  /** La spesa com'era quando è partita la modifica: per il controllo di versione. */
  base?: Expense
  status: 'pending' | 'error' | 'conflict'
  /** In conflitto: la versione attuale sul server, null se è stata eliminata. */
  current?: Expense | null
}
```

Due modifiche alla stessa spesa diventano una sola operazione, e una spesa creata offline e poi cancellata
offline sparisce dalla coda senza mai toccare il server. Conta però un dettaglio: quando due modifiche si
uniscono, resta la `base` **della prima**, perché è quella la versione che il server deve ancora avere.

Mentre la coda aspetta, l'interfaccia non mente e non resta indietro: lista delle spese, riepilogo e saldi
vengono ricalcolati in locale come saranno dopo l'invio, con gli importi in valuta estera segnati come stime
finché il server non li converte al cambio ufficiale.

## 2. Inviare una volta sola: l'idempotenza

La rete in viaggio non è solo assente: è *intermittente*. La richiesta parte, il server salva, la risposta si
perde. L'app non sa se la spesa è arrivata e la reinvia. Senza precauzioni, la cena compare due volte.

Per questo ogni spesa nasce nel browser con un **`client_id`** (un UUID), e nel database quel campo è
`UNIQUE`. Il server tratta la creazione come idempotente: se il `client_id` esiste già, restituisce la spesa
salvata invece di crearne un'altra.

```go
// createExpense è idempotente sul client_id: rinviare la stessa spesa
// (es. dopo un timeout di rete) restituisce quella già salvata con 200.
if existing, err := h.store.GetExpenseByClientID(ctx, clientID); err == nil {
	h.respondExisting(w, r, existing, trip.ID)
	return
}
```

C'è anche il caso in cui due reinvii arrivano *insieme*: entrambi non trovano la spesa, entrambi provano a
inserirla, il vincolo `UNIQUE` ne fa fallire uno, e il server risponde a quello con la spesa appena salvata
dall'altro. Nessuna eccezione arriva all'utente.

Un effetto collaterale utile: un reinvio **non ricalcola il cambio**. La spesa resta convertita al tasso BCE
del giorno in cui è stata salvata la prima volta.

## 3. Quando inviare, e quando fermarsi

L'invio parte all'avvio, quando torna la rete, quando l'app torna in primo piano, quando si accoda qualcosa e
ogni 30 secondi. Le operazioni partono una alla volta, nell'ordine in cui sono state fatte, e la parte
interessante è come si distinguono gli errori:

```ts
/** Problemi passeggeri: rete assente, sessione da rinnovare, server in difficoltà. */
function retryLater(err: ApiError): boolean {
  if (err.code === 'fx_unavailable') return false // serve un tasso a mano: lo deve sapere l'utente
  return err.status === 0 || err.status === 401 || err.status === 429 || err.status >= 500
}
```

Un errore passeggero **ferma il giro** e lascia tutto in coda per il tentativo successivo, così l'ordine
delle operazioni non si rompe. Un errore definitivo invece resta sull'operazione, visibile all'utente, e il
giro continua con le altre. Qualche caso si risolve da solo: se cancello una spesa che un altro ha già
cancellato, ricevo 404 e l'operazione si chiude, perché l'obiettivo è raggiunto.

## 4. Conflitti: mostrare le due versioni

Il caso difficile è il gruppo. Sono offline e correggo l'importo della cena; intanto un amico, online,
cambia la stessa cena. Quando torno in rete, chi vince?

La risposta di Splitrip è: **nessuno, finché non decide una persona.** Ogni modifica parte con la versione
che avevo visto (`expected_updated_at`). Se sul server la spesa nel frattempo è cambiata, il server non
applica nulla e risponde **409 con la versione attuale**:

```go
if in.ExpectedUpdatedAt != nil && !in.ExpectedUpdatedAt.Equal(expense.UpdatedAt) {
	h.writeConflict(w, r, expense) // 409 + la spesa com'è adesso
	return
}
```

L'operazione in coda passa in stato `conflict` e conserva entrambe le versioni. L'app le mostra affiancate e
fa scegliere: *tieni la mia* rimette in coda la mia modifica con la versione del server come nuova base;
*tieni la loro* scarta la mia. Se intanto la spesa è stata eliminata, *tieni la mia* la ricrea.

## 5. Il dettaglio che fa perdere i dati: la memoria del browser

Tutto questo vale poco se la coda sparisce. E può sparire: senza una richiesta esplicita il browser può
cancellare IndexedDB quando manca spazio, e **Safari lo fa anche dopo alcuni giorni senza visite** se l'app
non è installata. Proprio la situazione di chi registra una spesa senza rete e riapre l'app dopo una
settimana.

La soluzione è una riga, ma va chiesta nel momento giusto:

```ts
// C'è qualcosa che esiste solo su questo dispositivo: che il browser non lo cancelli.
void requestPersistentStorage() // navigator.storage.persist(), una volta per caricamento
```

Non la chiedo all'avvio: Firefox mostra un permesso all'utente, e chiederlo a chi non ha mai usato l'offline
sarebbe solo rumore. La chiedo alla **prima spesa messa in coda**, e subito all'avvio se l'app è installata
o se c'è già qualcosa in coda.

## Cosa resta da fare

Due limiti, entrambi annotati nel progetto:

- **Conflitti campo per campo.** Oggi ogni modifica concorrente chiede di scegliere, anche quando io ho
  cambiato la nota e l'altro l'importo. Avendo già la `base` in coda, si possono unire da soli i campi
  cambiati da una parte sola e chiedere solo per quelli cambiati da entrambi.
- **Il controllo di versione è un passo separato dall'aggiornamento.** Il server confronta
  `expected_updated_at` e poi aggiorna: due modifiche arrivate nello stesso istante potrebbero passare
  entrambe. Spostare la condizione nella `WHERE` dell'`UPDATE` chiuderebbe anche quella finestra.

La lezione più utile però è un'altra: **l'offline è soprattutto una questione di errori**. Salvare in
locale è facile. La parte che richiede progetto è decidere, per ogni risposta possibile del server, se
riprovare, fermarsi, chiudere l'operazione o chiedere all'utente.
