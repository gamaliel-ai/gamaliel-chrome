# Backlog

Engineering work catalog — **tickets** (`G-NNNN`). Rules: [`README.md`](README.md) § Backlog. Specs in [`backlog/`](backlog/); closed → [`backlog/archive/`](backlog/archive/).

<!-- NEXT_ID: 2 -->
**Next id:** **G-0002**. Allocate from this anchor, then increment it **and** the `NEXT_ID` HTML comment in the same change. Do not fill gaps. Never infer the next id from the filesystem.

> **Agent rule — ALWAYS read this file before allocating an id.** Canonical next id is **`NEXT_ID` / the “Next id” line above**.

---

## Active

> Order ≈ dependency priority (working set in [`../focus.md`](../focus.md)).

#### [G-0001](backlog/G-0001-hello-world.md): Hello World — side panel streams a Gamaliel answer

**In progress — built, awaiting localhost dogfood.** Toolbar opens the side panel; Ask captures page + selection, streams chat, renders markdown with scripture links.

## Deferred

*(empty)*

## Recently closed

*(empty)*

## Will not do

- New Gamaliel API (`/v1/scripture/suggest` or similar) for this prototype — use the existing chat completions endpoint.
