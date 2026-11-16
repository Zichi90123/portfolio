---
title: "Really offline: queue, idempotency and conflicts in Splitrip"
description: "How a travel expense PWA saves expenses without a connection and delivers them exactly once, even when a travel companion has changed the same expense."
---

On a trip the connection drops exactly when you need it: on the underground, on a plane, in the mountains,
abroad without roaming. For an app that logs expenses this is not an edge case, it is the normal case. In
[Splitrip](/en/projects/splitrip), "works offline" had to mean something precise: **an expense logged without
a connection is never lost, reaches the server exactly once, and if a travel companion changed it in the
meantime, nobody overwrites the other without knowing.**

Here is how I got there, with the pieces of code that matter.

## 1. A queue in the browser, not a copy of the database

The first temptation is to keep a full local copy of the data and sync it. It is the most expensive road:
it needs a sync engine, and conflicts multiply. Splitrip does something smaller: it keeps in **IndexedDB**
only a **queue of changes** not yet confirmed (the *outbox*). The rest of the app reads from the server, with
the last response kept for when the connection is gone.

Every queued operation carries what it needs to be sent and to handle a conflict:

```ts
export type OutboxOp = {
  /** For a new expense this is its client_id: the server recognises it if it arrives twice. */
  id: string
  tripId: string
  kind: 'create' | 'update' | 'delete'
  expenseId?: string
  /** create: the full expense; update: only the changed fields. */
  body?: ExpenseInput
  /** The expense as it was when the change started: for the version check. */
  base?: Expense
  status: 'pending' | 'error' | 'conflict'
  /** In conflict: the current version on the server, null if it was deleted. */
  current?: Expense | null
}
```

Two changes to the same expense become a single operation, and an expense created offline and then deleted
offline leaves the queue without ever touching the server. One detail matters, though: when two changes are
merged, the `base` **of the first one** is kept, because that is the version the server should still have.

While the queue waits, the interface neither lies nor lags behind: the expense list, summary and balances are
recomputed locally as they will be after sending, with foreign-currency amounts marked as estimates until the
server converts them at the official rate.

## 2. Sending exactly once: idempotency

On a trip the connection is not just missing, it is *intermittent*. The request goes out, the server saves,
the response is lost. The app does not know whether the expense arrived and sends it again. Without
precautions, dinner shows up twice.

That is why every expense is born in the browser with a **`client_id`** (a UUID), and that column is
`UNIQUE` in the database. The server treats creation as idempotent: if the `client_id` already exists, it
returns the saved expense instead of creating another one.

```go
// createExpense is idempotent on client_id: sending the same expense again
// (e.g. after a network timeout) returns the one already saved, with 200.
if existing, err := h.store.GetExpenseByClientID(ctx, clientID); err == nil {
	h.respondExisting(w, r, existing, trip.ID)
	return
}
```

There is also the case where two resends arrive *together*: neither finds the expense, both try to insert
it, the `UNIQUE` constraint makes one of them fail, and the server answers that one with the expense just
saved by the other. No error ever reaches the user.

A useful side effect: a resend **does not recompute the exchange rate**. The expense stays converted at the
ECB rate of the day it was first saved.

## 3. When to send, and when to stop

Sending starts at launch, when the connection comes back, when the app returns to the foreground, when
something is queued, and every 30 seconds. Operations go out one at a time, in the order they were made, and
the interesting part is how errors are told apart:

```ts
/** Temporary problems: no network, session to renew, server in trouble. */
function retryLater(err: ApiError): boolean {
  if (err.code === 'fx_unavailable') return false // needs a manual rate: the user must know
  return err.status === 0 || err.status === 401 || err.status === 429 || err.status >= 500
}
```

A temporary error **stops the round** and leaves everything queued for the next attempt, so the order of
operations never breaks. A permanent error stays on its operation, visible to the user, and the round goes
on with the others. Some cases resolve themselves: if I delete an expense someone else already deleted, I get
a 404 and the operation is closed, because the goal has been reached.

## 4. Conflicts: show both versions

The hard case is the group. I am offline and fix the amount of a dinner; meanwhile a friend, online, changes
the same dinner. When I come back online, who wins?

Splitrip's answer is: **nobody, until a person decides.** Every change starts from the version I had seen
(`expected_updated_at`). If the expense has changed on the server in the meantime, the server applies
nothing and answers **409 with the current version**:

```go
if in.ExpectedUpdatedAt != nil && !in.ExpectedUpdatedAt.Equal(expense.UpdatedAt) {
	h.writeConflict(w, r, expense) // 409 + the expense as it is now
	return
}
```

The queued operation moves to the `conflict` state and keeps both versions. The app shows them side by side
and lets you choose: *keep mine* puts my change back in the queue with the server version as the new base;
*keep theirs* drops mine. If the expense was deleted in the meantime, *keep mine* recreates it.

## 5. The detail that loses data: browser storage

None of this matters if the queue disappears. And it can: without an explicit request the browser may wipe
IndexedDB when space runs low, and **Safari also does it after a few days without visits** if the app is not
installed. Exactly the situation of someone who logs an expense offline and reopens the app a week later.

The fix is one line, but it has to be asked at the right moment:

```ts
// Something exists only on this device: don't let the browser delete it.
void requestPersistentStorage() // navigator.storage.persist(), once per page load
```

I don't ask at launch: Firefox shows the user a permission prompt, and asking someone who has never used
offline mode would just be noise. I ask on the **first queued expense**, and right at launch if the app is
installed or something is already queued.

## What is left to do

Two limits, both noted in the project:

- **Field-by-field conflicts.** Today every concurrent change asks you to choose, even when I changed the
  note and the other person the amount. With the `base` already in the queue, fields changed on one side
  only could be merged automatically, asking only about fields changed on both.
- **The version check is a separate step from the update.** The server compares `expected_updated_at` and
  then updates: two changes arriving at the very same moment could both go through. Moving the condition into
  the `WHERE` of the `UPDATE` would close that window too.

The most useful lesson, though, is another one: **offline is mostly about errors**. Saving locally is easy.
The part that needs design is deciding, for every possible server response, whether to retry, stop, close the
operation or ask the user.
