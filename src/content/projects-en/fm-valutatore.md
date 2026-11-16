---
title: FM Valutatore + FM Exporter
summary: "For Football Manager 26: a plugin exports squad, tactic and market with one key, a Windows app rates every player for each role in the tactic."
---

## The problem

In Football Manager 26, comparing hundreds of players for the roles of your tactic is done by eye: the
game's own export only saves the rows visible on screen, and star ratings only exist for players who have
already been scouted.

## What it does

- **FM Exporter**, a plugin inside the game: **F8** refreshes everything (squad, tactic, contracts, player
  database, budget) by moving between screens on its own; **F9** exports whole lists, even thousands of
  players long; other keys read the key and preferred attributes of every role.
- **FM Valutatore**, a Windows app that updates when new files arrive: a score for every player in every
  slot of the tactic, ideal line-up and backups, the market compared with your starter or backup, the **best
  combination of signings** within the transfer budget and wage room, a squad plan for the next seasons, and
  the attributes to train.
- Works with the game in English and Italian.

## Technical choices

- **A C# plugin for BepInEx on IL2CPP** that reads the game's interface. Lists are virtualised tables (the
  game only draws the visible rows): the plugin scrolls them step by step and collects rows by index until
  it has them all.
- **Navigation that does not depend on the language**: bookmarks are recognised by their icon, and input
  only goes through the game's own clicks and submit events.
- **An Electron and React app with the maths in plain TypeScript**, separate from the interface and covered
  by Vitest tests.
- **The ideal line-up as an optimal assignment** of players to slots (Hungarian algorithm), not the best
  player slot by slot. The combination of signings is an exhaustive search with pruning over the best
  candidates for each slot.

## Challenges

- **No API, and the game changes with every patch.** On startup the plugin checks the 35 internal classes
  and members it relies on and, if an update breaks any of them, says which features will not work. Getting
  BepInEx to run on FM26 took two fixes, now documented in the installation guide.
- **Without the game's hidden data.** Overall ability (CA) is estimated from the attributes with a formula
  per position group, measured on three saves and about 17,000 players: correlation 0.93–0.99, average error
  ±3 out of 200.
- **How much ability should weigh against role fit.** Checked against the average match ratings of 5,500
  players, role fit alone barely predicts performance (0.15) and CA alone does better (0.33): 60% CA keeps
  almost all of the gain (0.30) without role fit ceasing to matter. The attribute weights are checked against
  1,009 of the game's star ratings.
- **A plugin that CI cannot build**, because it needs FM26's libraries: CI checks the role catalogue and
  version consistency, and releases are published from a local machine.

## What I would do differently

- I would measure against real performance first. The first score was based on role fit alone, and only the
  comparison with match ratings showed that CA matters more.
- I would test the economic rules on very different budgets: the first cost of money, a fixed amount per
  million, ruled out almost every starter with large budgets; it is now relative to the budget.
