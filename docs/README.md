# Docs — organization and rules of the road

**This file is the only source of truth for how this repo’s docs are organized.** Do not invent parallel layouts, index files, or second id spaces. Conventions match [`marshall`](https://github.com/cirne/marshall) `docs/README.md` (tickets, next-id, archive, thin catalog). Work ids here are **`G-NNNN`**, not Marshall’s `M-NNNN`.

## Mental model

| Job | Home | Notes |
| --- | ---- | ----- |
| What am I doing *now*? | [`../focus.md`](../focus.md) | Working set only |
| What / why (durable product) | [`VISION.md`](VISION.md) | Rare edits |
| Implementable work | `BACKLOG.md` + `backlog/` | **Tickets** — only place with `G-NNNN` ids |

**Small things go straight to the backlog.** Thinking / milestones / architecture folders exist only when the first file needs them.

## Tree

```text
focus.md                         # root — priorities, WIP/stuck, recently shipped
docs/
  README.md                      # THIS FILE — org SoT
  VISION.md                      # product cut for the extension
  chrome-web-store.md            # how to publish (procedure; tickets stay G-NNNN)
  BACKLOG.md                     # thin open catalog + NEXT_ID
  backlog/
    G-NNNN-slug.md               # active
    archive/                     # closed (same filename)
```

## Backlog

Everyday name: **ticket** (plural **tickets**). Formal id: **`G-NNNN`**. Avoid “issue” (GitHub collision) and “backlog item” in prose — say “ticket” or cite `G-0001`.

### IDs

- **`G-NNNN`** — four-digit, zero-padded, one global space.
- Spec `kind`: `bug` | `improvement` | `chore` (in the file, not the path).
- **Next id** only from [`BACKLOG.md`](BACKLOG.md). Read → allocate → bump in the **same** change. Never infer from the filesystem. Don’t fill gaps.

### Cross-references

**The durable handle is the id** (`G-NNNN`). Path is convenience for click-through and will change once on archive.

| Context | Convention |
| ------- | ---------- |
| Docs / specs / `focus.md` | Prefer a real markdown link with **id as link text**: `[G-0001](backlog/G-0001-hello-world.md)` (adjust `../` for depth). |
| Commits, chat, casual prose | Bare `G-0001` is fine — resolve via glob / `BACKLOG.md`. |
| Never | Path-only links with no id in the text; id-only as the *default* in docs when a path is known. |

**On archive:** do **not** rewrite every mention of the id. Grep `G-NNNN` and fix **hrefs** that still point at `backlog/` instead of `backlog/archive/`. Filename slug stays the same.

### Files

- Active: `backlog/G-NNNN-slug.md`
- Closed: `git mv` → `backlog/archive/` (same filename). Path = done signal.
- Close checklist: final Status + date + outcome → move → update `BACKLOG.md` → update `focus.md` if listed → grep `G-NNNN` and fix **stale hrefs** (id text stays).

### `BACKLOG.md` (thin catalog)

Heading + blurb lists, not wide tables.

| Section | Contents |
| ------- | -------- |
| **Next id** | Allocator |
| **Active** | Every open item — `#### [G-NNNN](path): Title` plus a one-line **Status** blurb |
| **Deferred** | Parked + why (same entry shape) |
| **Recently closed** | Short tail (~10–20), then drop from the index |
| **Will not do** | Brief bullets, only to prevent re-filing |

Open work must appear in Active/Deferred. Lifetime history = archive files + git.

### Agent load order

1. [`../focus.md`](../focus.md)
2. Relevant `G-NNNN`
3. [`BACKLOG.md`](BACKLOG.md) when filing / triaging / picking work
4. [`VISION.md`](VISION.md) as needed

## Rules of the road (agents)

1. **Org SoT** = this README only.
2. **Work ids** = tickets `G-NNNN` from `BACKLOG.md` only.
3. **Close** = archive with `git mv` + fix stale **hrefs** (ids in link text stay).
4. **Dual write** for backlog: spec + `BACKLOG.md` (+ `focus.md` if in the working set).
5. **Implement tickets**, not undocumented chat.
6. **No speculative empty folders**; **no** parallel bug databases.
7. **Cross-link > copy.** Cite backlog work as `[G-NNNN](path…)`; bare ids OK outside docs.

## Related

- [`../README.md`](../README.md) — setup and commands
- [`../focus.md`](../focus.md) — current priorities
- [`VISION.md`](VISION.md) — extension product cut
- [`chrome-web-store.md`](chrome-web-store.md) — Chrome Web Store publish sequence ([G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md))
