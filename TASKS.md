# TASKS.md — Mentee Task Catalog & Project-Shaping Guide

Purpose: define every type of task club members can own, what the lead builds instead, and how member ideas get channeled without wrecking the product focus.

## Guiding Principles

1. **Product focus:** the app connects students to nonprofits with audit-proof metrics. Every feature must serve that.
2. **Member agency without scope creep:** members get a real channel for ideas, a triage process, and bounded tasks — but their ideas don't silently expand the product.
3. **Introductory-only tasks:** members are Grade 9, learning Python first. Tasks must be pure logic or heavily scaffolded.

---

## Task Ladder (easiest → hardest)

### Level 0 — Python bridge tasks (no TypeScript needed)

These produce JSON artifacts the app consumes. Pure intro Python: lists, dicts, strings, `json`, `requests`.

| Task | Output → consumed by app |
|---|---|
| Generate realistic seed opportunities | `opportunities.json` for the seed pipeline |
| Parse a sample RSS/JSON feed into a normalized shape | JSON matching the `IntakeAdapter` contract |
| Clean a CSV of organizations into validated JSON | sanitized listing data for the intake queue |

**Mentee skill:** Python fundamentals + data shapes. **Lead:** reviews the shape, wires it in.

### Level 1 — Pure JS helpers (introductory, testable)

10-line pure functions. Nearly identical to Python, so Python-first learners cross over fast.

- Validation: `isValidUrl`, `isValidHours`, `isNonEmpty`, `isValidCategory`
- Formatting: `formatCategory`, `formatDate`, `pluralizeHours`
- Logic: `filterOpportunities(list, term)`

Each delivered as a sandbox with a marked `// TODO` + 3–5 pre-written assertions.

### Level 2 — Single-component UI (scaffolded)

One component per task, `fetch`/data flow pre-written by the lead.

- Apply button (fill in the analytics POST + open external link)
- Self-reported hours form
- Presentational card/badge components
- Filter pill UI bound to the existing list

**Mentee skill:** reading props, basic state, one event handler. **Lead:** owns all data flow, API calls, auth.

### Level 3 — Bounded feature ideas (co-designed with lead)

- "My Hours" page (reads `anonymousId` from localStorage)
- Favorites / saved opportunities (local-only, no backend)
- Detail-modal polish
- Search suggestions

These are real features, but the lead defines scope and the mentee owns a contained slice.

---

## What the Lead Builds (do NOT assign)

- Schema + migrations
- Rate-limit / dedup / IP-hash utilities (`lib/security.ts`)
- Event APIs (`/api/events/apply`, `/api/events/hours`)
- Admin APIs (`queue`, `review`, `sources`) + auth guard
- Intake adapters + registry + cron route
- Metrics endpoint
- Any data that touches student PII or metrics integrity

Why: single point of correctness, too complex for intro learners, and must live in the main repo.

---

## Channeling Member Ideas (agency without chaos)

### Idea intake

- A single place to submit: GitHub issue template, or a simple "Idea Wall" section in the app.
- Every idea is logged with: what, who, why it helps students.

### Triage matrix

Score each idea: **impact on users (0–5)** × **implementation complexity (0–5)**.

| Impact | Complexity | Verdict |
|---|---|---|
| High | Low | Fast win — mentee task this week |
| High | High | Lead builds core; mentee gets a sub-component |
| Low | Low | Nice-to-have — backlog |
| Low | High | Park it; explain why |

### Acceptance rubric (the "does this get built" test)

- Does it help a student **find or apply to a nonprofit**? (core value)
- Does it grow an **audit-safe metric** (active users, apply events)?
- Does it require storing **student PII**? → reject or rework
- Can it be **split** so a mentee owns a piece?

### Hard constraints (non-negotiable)

- Zero student PII, no board approval needed.
- No metric inflation — every number must be derivable from append-only logs.
- Every accepted task: bounded scope + owner + API contract + tests.

---

## Starting Scope

- **~5 tasks is enough to launch the mentorship.** Start small; expand as you go.
- Suggested first batch: 1× Level 0, 2× Level 1, 1× Level 2, 1× Level 3. Covers every skill tier without overload.
- Add more tasks per meeting based on what members finish — don't pre-build a huge backlog.
- The starter examples in this file are the initial 4; the 5th is a second Level 1 helper (e.g., `formatCategory`).

## Timeboxing

- Each mentee task: **1–2 meetings**. If it drags, the lead finishes it.
- Goal: members ship something small but real each cycle, never block the main branch.

---

## Balance Rule of Thumb

> Members shape **surface features and data tooling** (cards, forms, helpers, Python feeders).
> The lead owns **anything that touches users' data, metrics integrity, or the backend**.

---

## Python-First Framing (why JS exists, without friction)

Club teaches **Python**; the product is **TypeScript**. Frame it so members never feel they're being forced to learn a "second language."

### The framing to use

- **Python is the language they learn; JS is the language the product speaks.** The logic is identical — only the names change.
- Python is the "thinking language," JS is the "shipping language." Both train the same skill: breaking a problem into steps.

### The progression that makes it work (order matters)

1. **Session 1–2: Python only.** Level 0 bridge tasks. No JS mentioned yet.
2. **Payoff moment:** their Python-generated JSON appears in the live app. They see their work ship.
3. **Session 3+: JS helpers.** Show the exact same Python function side-by-side with its JS twin. Transition is "see, same idea, different words."
4. **JS stays at Level 1–2** (pure functions, scaffolded components) until they're comfortable.

### Anti-friction rules

- Never start a session with JS. Always start from a Python task or a side-by-side comparison.
- JS tasks are restricted to pure functions + heavily scaffolded components — never framework plumbing.
- Keep a running "Python ↔ JS" cheat sheet (function, `if`, `list/array`, `dict/object`, `print/console.log`).
- Level 2+ (real UI) only after they've shipped at least one Level 0 and one Level 1 task.

### One example per level (reference for sandbox templates)

| Level | Example task |
|---|---|
| 0 | Python script that writes `opportunities.json` (dicts + `json.dump`) |
| 1 | `isValidHours(hours)` returning `Number.isInteger(h) && h >= 1 && h <= 100` |
| 2 | `ApplyButton` component with pre-written `fetch`, mentee fills the POST body |
| 3 | "My Hours" page reading `anonymousId` + hour log from localStorage |

---

## Starter Examples (copy-paste scaffolding)

### Level 0 — Python seed generator

```python
import json

def make_opportunity(title, org, hours):
    return {
        "title": title,
        "organization": org,
        "hours": hours,
        "category": "STEM",
        "commitment": "Weekly",
        "description": f"Help out at {org}",
        "requirements": "None",
        "location": "Central Branch",
        "link": "https://example.org/apply",
    }

data = [
    make_opportunity("Robotics Mentor", "Oakville Library", 12),
    make_opportunity("Food Bank Helper", "Halton Food Network", 4),
]

with open("opportunities.json", "w") as f:
    json.dump(data, f, indent=2)
```

### Level 1 — JS validation helper

```js
// TODO: return true only if hours is a whole number between 1 and 100
function isValidHours(hours) {
  return Number.isInteger(hours) && hours >= 1 && hours <= 100;
}

// Tests (pre-written, they just run them)
console.log(isValidHours(12));     // true
console.log(isValidHours(0));      // false
console.log(isValidHours(12.5));   // false
console.log(isValidHours(101));    // false
```

### Level 2 — Apply button (scaffolded)

```tsx
"use client";

export function ApplyButton({ opportunityId }: { opportunityId: number }) {
  function handleApply() {
    // TODO: fill in the fetch call to POST /api/events/apply
    fetch("/api/events/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId }), // ← finish this
    });
  }

  return (
    <a href="https://forms.gle/demo" target="_blank" rel="noopener noreferrer" onClick={handleApply}>
      Apply
    </a>
  );
}
```

### Level 3 — "My Hours" page slice

```tsx
"use client";

import { useState } from "react";

export function MyHours() {
  const [anonymousId] = useState(() => localStorage.getItem("anonymousId") ?? "unknown");
  const [hours] = useState(() => JSON.parse(localStorage.getItem("myHours") ?? "[]"));

  const total = hours.reduce((sum: number, h: number) => sum + h, 0);

  return (
    <div>
      <p>Session: {anonymousId}</p>
      <p>Self-reported hours: {total}</p>
    </div>
  );
}
```