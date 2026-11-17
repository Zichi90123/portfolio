---
title: "A score measured on the pitch: how I calibrated FM Valutatore"
description: "A Football Manager player score looked right until I compared it with real match ratings. What I measured, what I changed and what did not work."
---

[FM Valutatore](/en/projects/fm-valutatore) gives every Football Manager 26 player a score from 0 to 100 for
each role in your tactic. The first score was reasonable on paper, and wrong in a way that only shows up when
you measure. This is the story of how I measured it.

## The starting score

In FM every role has **key** and **preferred** attributes: a playmaker needs passing and vision, a centre-back
marking and heading. The first score was the weighted average of those attributes, weight 2 for key and 1 for
preferred, scaled to 100. I call it **role fit**.

It looked right: whoever has the attributes for the role plays the role well. But "looked right" is not a
measurement.

## First check: the game's own judgement

FM shows star ratings for every player in every role. With a key in FM Exporter I read **1,009 star ratings
of 28 players** and compared them with the score:

- correlation **0.60**: the score goes up with the stars (about 58 at one star, 79 at four);
- for the same player, the role with the highest score matches the one with the most stars in **17 cases
  out of 25**;
- no other combination of weights does significantly better. Weighting key attributes like preferred ones is
  worse (13 out of 25), ignoring them is wrong almost every time.

Good news, with a limit: it measures how much the score **agrees with the game**, not how well it predicts
**performance**. Those are two different questions.

## Second check: the pitch

FM does have a performance measure: the **average match rating**. FM Exporter exports appearances and
ratings, and the *Verifica* tab compares the score with the average rating of players with enough
appearances.

The first attempt, on all players together, gave a correlation of **0.09**. Almost zero. Was the score
useless?

No: the comparison was wrong. Match ratings depend on the **level of the league**. A 7 in a weak league is not
a 7 in the Premier League, and mixing different teams buries everything in noise. The right comparison is
**between teammates**: for each player, the gap between his rating and his team's average, against the gap
between his score and his teammates'.

On about 5,500 players with at least 10 appearances, between teammates:

| Score | Correlation with match rating |
| --- | --- |
| Role fit only | 0.15 |
| 60% role + 40% CA | 0.26 |
| 40% role + 60% CA | 0.30 |
| CA only | 0.33 |

Role fit alone predicts little. What predicts most is **CA** (*current ability*), the overall ability FM
computes for every player and keeps hidden.

## The choice: 60%

CA alone wins, but it says nothing about the role: a great centre-back and a great attacking midfielder with
the same CA would get the same score in every slot. So the current score is a compromise:

> slot score = 40% role fit + 60% CA (scaled to 100)

60% keeps almost all of the gain (0.30 against 0.33) and leaves role fit to decide **where** a player should
play. The weight can be changed from the interface: at 0% you are back to role fit only.

## Without hidden data: estimating CA

One problem remains: CA is hidden data. You only see it by turning on a game option many players don't use.
Without it, the score would lose its most useful part.

FM computes CA from the attributes, with weights that depend on the position. So it can be **reconstructed**:
I measured a linear formula per position group (one weight for each of the 47 attributes, plus a constant) on
three saves with CA visible, about 170,000 players, and checked it from one save to another.

```ts
// CA = constant + sum(weights × attributes), with the weights of the player's position group.
// An unknown attribute takes the group average, shifted by the player's level
// on the known attributes.
const shift = known.reduce((a, b) => a + b, 0) / known.length
const total = values.reduce((sum, v, i) => sum + pesi[i] * (v ? mid(v) : medie[i] + shift), costante)
```

Correlation with the real CA between **0.93 and 0.99**, average error **±3 points out of 200** with all
attributes. The detail that matters is how missing attributes are handled: barely scouted players mostly show
their strengths, and filling the gaps with the group average would overrate them. Shifting the average by the
**player's level**, measured on the known attributes, keeps the error between ±4 and ±7 even with 10–46 known
attributes. Below 10 there is no estimate: the error climbs to ±13. On the final score, the difference between
real and estimated CA is 0.8 points on average.

## The attempt that did not work

Since match rating is the target, why not learn the attribute weights directly from it? I tried: a **ridge
regression** on the 47 attributes per position group, on two independent seasons (4,164 and 2,453 players),
learning on one and checking on the other.

Result: in **no position group** did the learned weights beat CA alone (centre-backs 0.35 against 0.47,
midfielders 0.31 against 0.48). They were also unstable between seasons and sometimes absurd, like negative
weights for passing in midfielders. They were chasing noise.

The likely cause is in the data: **91%** of players are not well scouted, so their attributes are ranges,
while CA is an exact number. I kept the score as it was and noted when to try again: with many well-scouted
players.

## What I take away

- **Measure first, against the real target.** Agreement with the game's stars reassured me, but it answered a
  different question. Comparing with match ratings changed the formula.
- **The right comparison is worth more than the model.** Going from "everyone against everyone" to "between
  teammates" took the correlation from 0.09 to numbers you can interpret, without touching the score.
- **A failed experiment is a result.** The regression never made it into the app, but it confirmed that 60%
  CA is a sensible choice and told me which data I would need to do better.
