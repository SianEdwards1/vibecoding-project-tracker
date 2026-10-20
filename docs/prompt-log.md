# Prompt log

A factual record of how AI tools were used to build the prototype. One entry per milestone.
Claude Code fills in the top part. You fill in the bottom part (that's the bit that shows your judgement).

Tools used across the project (fill in as you go):

| Tool | Version / model | Used for |
|---|---|---|
| Claude Code | Opus 5.5 (claude-opus-5-5) | Filling in DESIGN.md, Tailwind tokens, fonts, contrast checks |
| | | |

---

## Template (copy for each milestone)

### M__ · tag-name · YYYY-MM-DD

**AI tool:** Claude Code

**Prompts (word for word):**
1. ...

**Files changed:**
- ...

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M__-....png`

**Notes for report:**


---

<!-- Entries go below this line, newest at the bottom -->

### M03 · design-done · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. Can u fill out design md Using the colour scheme ive already inputted and using accessibility as the main reasons to back things up just fill in todos do not overeach once colours and fonts and design.md is done

   ```
   Add them to tailwind.config.js as named tokens (e.g. brand, surface, feature, bug,
   due-calm, due-warning, due-alarm, due-done). If the fonts need loading, add them in
   index.html. Then show me a throwaway test block in App.jsx with one swatch per token
   so I can see them, and tell me how to remove it after.
   Also check each due-date colour against the text colour for contrast and tell me the ratios.
   ```
2. (Pasted error, no other text)

   ```
   [plugin:vite:css] [postcss] C:/Users/c24045154/vibecoding-project-tracker/src/index.css:10:3: The `bg-surface-page` class does not exist. If `bg-surface-page` is a custom class, make sure it is defined within a `@layer` directive.
   C:/Users/c24045154/vibecoding-project-tracker/src/index.css:10:2
   8  |  
   9  |  body {
   10 |    @apply bg-surface-page font-sans text-text-primary;
      |    ^
   11 |  }
   12 |
   ```
3. Ignoring the text in the pasted text just get the colours out and update my design md to match these colours exactly as well as tailwind

   ```
   | Token | Hex | Where it shows up | Source |
   |---|---|---|---|
   | `brand-primary` | `#0777da` | Header, "+" button, focus rings | Twine (twine-blue) |
   | `brand-accent` | `#0b5cad` | Highlights, hover states, links | Twine |
   | `surface-page` | `#f8f4ee` | Page background | Twine (floral-white) |
   | `surface-card` | `#ffffff` | Card background | Twine |
   | `text-primary` | `#04121f` | Body text | Twine (black) |
   | `text-muted` | `#5a5758` | Captions, dates, counts | Twine (dim-grey) |
   | `border-subtle` | `#ece7df` | Card and input borders | Twine, *added row* |

   ### Task type (M6 `tag-style`)

   | Token | Hex | When used | Source |
   |---|---|---|---|
   | `type-feature` | `#5b4bb5` | Cards tagged `feature` (accent stripe + icon) | Twine |
   | `type-bug` | `#b42318` | Cards tagged `bug` (accent stripe + icon) | *added* |

   ### Due-date states (M8 `due-tint`)

   Each state has a tint (card background) and an ink colour (text, icon or border on that tint).

   | Token | Hex | Ink token | Ink hex | When used | Source |
   |---|---|---|---|---|---|
   | `due-safe` | `#def4e7` | `due-safe-ink` | `#177a4c` | More than 2 days out | Twine |
   | `due-warning` | `#fdefd0` | `due-warning-ink` | `#8a5a00` | Less than 24 hours | Twine tint, *added* ink |
   | `due-overdue` | `#fde3e0` | `due-overdue-ink` | `#b42318` | Past due | Twine tint, *added* ink |
   | `due-neutral` | `#ece7df` | `due-neutral-ink` | `#5a5758` | Done (overrides date) | Twine |
   ```
4. fill in prompt log based on this session

**Files changed:**
- `DESIGN.md`: filled in TODO sections (anti-references, typography reasons, component principles, microcopy, wordmark); updated colours to match prompt 3, added `border-subtle` and due-date ink colours
- `tailwind.config.js`: colour tokens (brand, surface, text, border, type, due + ink) and font families
- `index.html`: Google Fonts link for Plus Jakarta Sans and JetBrains Mono
- `src/index.css`: body uses token background, text colour and font
- `src/App.jsx`: throwaway `TokenSwatches` test block
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M03-design.png`

**Notes for report:**


---

### M04 · data-model · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M04-data-model.md and @PRD.md (sections 5, 7 and 8).
   Plan how to build the four-column board in src/App.jsx using the existing Task model,
   STAGES constant and useLocalStorage hook. Use the colour tokens from tailwind.config.js.
   Seed 4 mock tasks across different columns, using the example team names "Sian Edwards", "Ela Morgan" and "Bingo Edwards" and "Bonnie Morgan". Keep those names in one TEAM constant so later milestones reuse it.
   Mock due dates must be relative to today (e.g. today + 5 days, today + 12 hours,
   yesterday) so the due-date colours in M8 still work whenever someone opens the app.
   Explain the plan in plain English before building.
   ```
2. yes go ahead
3. THe columns are not distinctive and i want a seperation between them

**Files changed:**
- `src/App.jsx`: `TEAM` set to the four example names; added `toISODate`, `daysFromToday` and `makeSeedTasks` (4 seed tasks, one per column, dates relative to today); tasks stored with `useLocalStorage('vibetracker.tasks', ...)`; four-column board with `Column` and `TaskCard` components (title + assignee, "Nothing here yet." empty state); each column is a shaded rounded panel with a divider under its heading and a pill-shaped task count; header switched to colour tokens; removed the throwaway M3 `TokenSwatches` block
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M04-board.png`, `docs/screenshots/M04-localstorage.png`

**Notes for report:**


---
