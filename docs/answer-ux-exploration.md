# Quirk — Answering UX: exploration & recommendation

**Status:** Draft for discussion (not yet implemented)
**Owner:** Bhargav
**Last updated:** 2026-06-17
**Scope:** How a user answers a single question (the per-question interaction), 40× per quiz.

---

## 1. The problem

Today each question is a card you can **drag horizontally**:

- **Direction = polarity:** right → agree, left → disagree.
- **Distance = intensity:** further past a threshold → "strongly".
- A label badge ("AGREE 💚" / "💜 DISAGREE") is **attached to the card**.

Two things hurt the experience:

1. **Feedback leaves the screen.** Because the badge rides on the card, it drifts toward
   the same edge you're swiping to — exactly off-screen, right when you most want to read it.
2. **One axis carries two meanings.** Direction (which side) *and* magnitude (how strongly)
   are both encoded on the same horizontal drag. It's hard to land a precise value, and
   "how far = how strong" is not discoverable without instructions.

The 5-dot tap scale underneath works fine and is the reliable fallback — but the swipe, which
is meant to be the *fun* part, is the weak link.

> This doc explores better interaction models and recommends a direction. The current
> behavior is acceptable as-is; nothing here is urgent, but the swipe is the lowest-quality
> moment in an otherwise polished, playful flow.

---

## 2. Why it matters

- **Volume:** the answer interaction happens 40 times per run. Small friction compounds into
  drop-off; small delight compounds into "this was fun, let me share it."
- **Identity:** "fun, not a boring form" is the whole pitch (see [README](../README.md)).
  The answering gesture *is* the product's core feel.
- **Data quality:** the per-axis confidence bars are powered by the 5-point granularity. A
  model that quietly collapses to binary changes the results' texture (see §7, Open Q1).

---

## 3. Goals & constraints

**Goals**
- Feedback is **always visible** — never rides off-screen.
- **Polarity and intensity are legible** and independently controllable (or intensity is
  dropped deliberately, see §7).
- **Fast** — one fluid motion per question, one-handed, thumb-reachable.
- **Fun** — springy, tactile, a little surprising. Earns a smile, not a shrug.

**Constraints**
- Mobile-first; must feel native to touch. Works with mouse on desktop too.
- **Accessible:** a tap path must always exist; keyboard operable; respects reduced motion
  and the existing `LITE` performance mode ([src/lib/perf.ts](../src/lib/perf.ts)).
- **Cheap to render** on weak phones — no per-frame blur, minimal continuous animation.
- Preserve (or consciously change) the 5-point Likert that scoring depends on.

**Success signals (if we instrument)**
- ↓ median time-per-question (without ↑ "back"/correction taps).
- ↓ quiz abandonment rate.
- ↑ share-rate (proxy for "that was fun").

---

## 4. Design principles (the takeaways, regardless of concept)

1. **Anchor feedback to the viewport, not the moving element.** Whatever shows "what you're
   about to pick" should be pinned (screen edge / fixed overlay / dock), so it stays put while
   the card moves.
2. **Separate polarity from intensity** — or commit to dropping intensity. Don't smear both
   onto one ambiguous axis.
3. **Tap is the floor, swipe is the flourish.** The precise, accessible path (tap) must stand
   on its own; gestures are an optional accelerant, never the only way.
4. **Show the value before commit.** The user should *see* the exact answer that releasing
   will record, with no guessing about thresholds.
5. **Commit should feel decisive** — a satisfying snap/fly-off, then the next card. Reversible
   via Back.

---

## 5. Concepts

Ratings are rough: **Fun / Precision / Effort / Risk** on Low–Med–High.

### A. Anchored stamp + card fly-off  *(minimal fix)*
Keep the drag mechanic, but **move the label off the card into a fixed, centered overlay**
that scales and recolors as you drag. The card tilts/flies; the stamp stays dead-center and
legible. On release past threshold, the card flings off in the swipe direction.

```
        ┌─────────────────────────────┐
        │        ╭───────────╮         │   ← stamp is FIXED to viewport,
        │        │ AGREE 💚  │         │     grows/colors with drag,
        │        ╰───────────╯         │     never leaves screen
        │     ╭───────────────╮↗       │
        │     │  the card,    │        │   ← card tilts & slides under it
        │     │  tilting away │        │
        │     ╰───────────────╯        │
        └─────────────────────────────┘
```
- **Fun H · Precision L–M · Effort L · Risk L**
- ✅ Directly kills the off-screen bug; smallest change; keeps the Tinder energy.
- ⚠️ Still encodes intensity as distance (imprecise). Centered stamp can overlap the question
  text — may need to dim/blur text during drag.

### B. Edge gauges  *(in-place tilt + fixed side meters)*
The card barely moves (small tilt, snaps back). Instead, the **left and right screen edges**
hold fixed vertical "fuel gauges." Dragging toward a side fills that edge's gauge; crossing
into the top segment = "strongly." Label + level live at the edge.

```
 ▓                                   ░
 ▓  STRONGLY                         ░
 ▓                ╭────────────╮     ░
 █  AGREE? ───►   │  question  │     ░   ← right gauge fills as you pull right;
 █                ╰────────────╯     ░     two segments = mild / strong
 █                                   ░
left gauge (disagree)        right gauge (agree)
```
- **Fun M–H · Precision M · Effort M · Risk M**
- ✅ Feedback pinned to edges (always visible); intensity has a clear visual ceiling.
- ⚠️ Two simultaneous edge elements add visual noise; "fill the gauge" is a new metaphor to teach.

### C. Reaction-face dial  *(single mechanic, emoji needle)*
A fixed semicircular dial docked at the bottom with five faces 😣 😕 😐 🙂 😄. Dragging the
card (or dragging on the dial directly) sweeps a **needle** across the faces; the active face
pops. Release commits the face under the needle.

```
        ╭───────────────╮
        │   question    │
        ╰───────────────╯
   😣    😕    😐    🙂    😄
    \           ▲          /        ← needle anchored at bottom-center,
     ╰──────────┴─────────╯           sweeps the arc; active face enlarges
```
- **Fun H · Precision M–H · Effort M–H · Risk M**
- ✅ Naturally maps to 5 points; expressive & delightful; feedback docked & always visible;
  one mechanic for both polarity + intensity but on a *visible, labeled* track.
- ⚠️ Most build effort; arc math + needle physics; emoji rendering varies by platform.

### D. Reaction faces, tap-first  *(hero taps + swipe shortcut)*  ⭐
Replace the abstract dots with **five big, bouncy emoji-face buttons** (😣 😕 😐 🙂 😄) as the
primary, precise target. Selecting one makes it pop and auto-advances. **Swipe becomes an
optional shortcut**: a decisive full-swipe right/left = *strongly agree/disagree* (one level
per side, no distance-guessing), with the label shown as a **fixed corner/centered stamp**
(per Principle 1) and the card flying off.

```
        ╭───────────────╮
        │   question    │
        ╰───────────────╯
   [😣] [😕] [😐] [🙂] [😄]     ← big tappable faces; tap = pick + advance
   strongly        strongly
   disagree         agree
   ↞ full-swipe left = 😣        full-swipe right = 😄 ↠   (optional speed path)
```
- **Fun H · Precision H · Effort M · Risk L**
- ✅ Simplest mental model; precise & accessible by default; swipe reduced to an unambiguous
  binary (no intensity-by-distance); feedback anchored. Keeps full 5-point granularity via taps.
- ⚠️ Less "novel" than a dial; swipe only reaches the two extremes (acceptable — extremes are
  exactly when a confident flick makes sense).

### E. Stretch / "taffy" slider  *(draggable thumb, 5 snaps)*
A horizontal track with five snap stops (strongly disagree ↔ strongly agree) and a springy,
stretchy thumb. Drag the thumb (or tap a stop); it snaps and the chosen label/face pops.
Confirm by lifting, or a "Next" affordance.

- **Fun M · Precision H · Effort M · Risk L**
- ✅ Very precise & legible; thumb + fill stay on-screen; familiar slider metaphor.
- ⚠️ Feels more "control" than "play"; risks reading as a settings slider, not a game. Per-
  question explicit confirm could slow the 40-Q flow unless we auto-advance on snap+dwell.

### F. Velocity flick  *(direction = polarity, speed = intensity)*
Direction picks the side; **flick speed** picks mild vs. strong (soft = agree, hard = strongly).
- **Fun M · Precision L · Effort M · Risk H**
- ❌ Intensity-by-velocity is unpredictable and inaccessible. Listed for completeness; not
  recommended.

---

## 6. Comparison

| Concept | Fun | Precision | Effort | Risk | Feedback on-screen | 5-pt intact |
|---|---|---|---|---|---|---|
| A. Anchored stamp + fly-off | H | L–M | **L** | L | ✅ (fixed stamp) | partial* |
| B. Edge gauges | M–H | M | M | M | ✅ (edges) | ✅ |
| C. Reaction dial | H | M–H | M–H | M | ✅ (docked) | ✅ |
| **D. Faces tap-first + swipe shortcut** ⭐ | **H** | **H** | M | **L** | ✅ (stamp) | ✅ |
| E. Stretch slider | M | H | M | L | ✅ (thumb) | ✅ |
| F. Velocity flick | M | L | M | H | n/a | partial* |

\* "partial" = swipe path only reaches mild/strong, full granularity still available via taps.

---

## 7. Recommendation

**Phase 1 — unblock now (Concept A):** detach the badge from the card and render it as a
**fixed, centered stamp** that scales/recolors with drag, and fly the card off on commit. This
is a small change that fixes the reported off-screen bug immediately while we validate a
bigger redesign.

**Phase 2 — the better system (Concept D):** make **tappable reaction faces** the hero
interaction — precise, accessible, delightful, full 5-point granularity — and demote swipe to
an **optional "strong opinion" shortcut** (full swipe → strongly agree/disagree) with the
anchored stamp from Phase 1. This resolves the root problem (two meanings on one axis) by
letting taps own precision and swipe own speed, and it's low-risk.

**Stretch / if we want more wow (Concept C):** the reaction dial is the most distinctive,
"only-in-Quirk" option. Worth a prototype if Phase 2 lands well and we want a signature moment;
higher build cost and platform emoji variance are the watch-outs.

Rationale: D maximizes (precision + accessibility + fun) at low risk and keeps the data model
intact; A is the cheap bridge that stops the bleeding today; C is the upside bet.

---

## 8. Cross-cutting details (apply to whatever we pick)

- **Feedback anchoring:** any "what will I pick" indicator is `position: fixed`/dock, never a
  child of the draggable card.
- **Commit & advance:** keep the existing double-commit guard (the `advancing` ref in
  [Quiz.tsx](../src/components/Quiz.tsx)) so a fast gesture can't skip/overshoot questions.
- **Accessibility:** faces/dots are real `<button>`s with `aria-label`s and the existing
  `ring-fun` focus style; full keyboard support (1–5 keys could map to the five options);
  gesture is purely additive.
- **Reduced-motion / LITE:** disable fly-off and springs under `LITE`; selection still works
  via instant state change.
- **Question legibility during drag:** if a centered stamp overlaps text, fade/scale the
  question slightly while dragging.
- **Persistence:** unaffected — answers still flow through `onAnswer` → `saveProgress`
  ([src/lib/storage.ts](../src/lib/storage.ts)).

---

## 9. Open questions

1. **Do we keep 5 points, or move to 4 (forced choice, no neutral)?** Dropping "neutral"
   pushes a lean and can make results crisper; it also simplifies a swipe-only model. Affects
   `scoring.ts` and the confidence bars.
2. **Should swipe reach all 5 levels, or only the extremes?** Recommendation (D) says extremes
   only; revisit if users want mild-via-swipe.
3. **Auto-advance vs. explicit confirm?** Auto-advance is faster (good for 40 Qs) but makes
   mis-taps costlier — is the Back button enough of a safety net?
4. **Emoji faces vs. colored dots vs. words?** Faces are friendliest but render differently
   across platforms; dots are safe; words are clearest but least playful.
5. **Onboarding:** do we need a one-time gesture hint/animation on Q1, or is the tap-first
   model self-evident enough to skip it?

---

## 10. Decision log

_(empty — record the chosen direction and date here once decided)_
