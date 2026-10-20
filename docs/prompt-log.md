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
4. update prompt log

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

### M05 · crud-modal · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M05-crud-modal.md.
   Plan a single TaskModal component used for both add and edit.
   Fields: title, description, type (feature/bug), status, assignee (dropdown of the
   example team names in the TEAM constant only), due date, and created date shown read-only.
   "+" opens it empty; clicking a card opens it pre-filled. Include Save, Cancel and Delete.
   Status is a dropdown, no drag-and-drop. Save to localStorage via the existing hook.
   Escape key and clicking outside should close it without saving.
   Explain the plan before building.
   ```
2. 1. Please add a title and 2. A confirmation message
3. I want the confirmation message to be ui and not a console request i want the tasks to display more info like the type and the colours based on due date in design md and icons for team member s being initials

**Files changed:**
- `src/App.jsx`: added `editing` state plus `openNewTask`, `saveTask` and `deleteTask` in `App`, all saving through the `useLocalStorage` setter; "+ Add task" button in the header; `TaskCard` is now a button that opens the modal; new `TaskModal` component (title, description, type, status, assignee, due date, read-only created date; Save, Cancel, Delete) that edits a draft copy; Escape and clicking the backdrop close without saving; an empty title shows "Please add a title."; Delete shows an in-app message "Delete this task? This cannot be undone." with "Keep task" and "Delete task" buttons (replaced the browser confirm box; Escape backs out of it); shared button and field class constants; `formatDate` helper for the created date
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M05-add.png`, `docs/screenshots/M05-edit.png`

**Notes for report:**


---

### M06 · tag-style · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M06-tag-style.md and the feature/bug tokens in @tailwind.config.js.
   Make feature and bug tasks visually distinct using those tokens, with a small icon
   in the corner of each card. Put the colour + icon logic in one shared place so the
   card, the modal and anything else use exactly the same styling.
   Don't add an icon library unless I agree; inline SVG is fine.
   Leave room for M8 due-date colours: suggest how type colour and due colour will
   both fit on one card without clashing (e.g. one as a border/badge, one as a tint).
   ```
2. can u also make the choose type bug or feature drop down match this style
3. can u change the type choice to not be a dropdown and just be like a button selector that highlights when selected

**Files changed:**
- `src/App.jsx`: new `TASK_TYPES` constant (label, colour classes and inline SVG icon for feature and bug) and `taskTypeStyle` helper as the one shared place for type styling; new `TypeIcon` and `TypeBadge` components; `TaskCard` has a 4 px left stripe in the type colour and the type icon in the top-right corner (hover now uses a shadow so the stripe keeps its colour); `TaskModal` has a top stripe in the type colour and a type badge next to the heading, both updating live when the type changes; the Type dropdown was first styled in the type colours, then replaced with two buttons (Feature, Bug) built on hidden radio buttons, where the selected one is highlighted with its type colour border, a light tint of that colour and bold text (`selectedClass` added to `TASK_TYPES`); `TypeIcon` has a `decorative` option so screen readers don't read the type name twice where it is already written next to the icon
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M06-types.png`, `docs/screenshots/M06-modal.png`

**Notes for report:**


---

### M07 · task-owner · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M07-task-owner.md.
   1. Show an initials avatar for the assignee on each card (each name in the TEAM
      constant gets its own consistent colour).
   2. Add a "Hand off to…" dropdown in the modal that lists the other teammates and
      reassigns the task when picked.
   3. Show a short visual confirmation when a task is handed off, e.g. "Handed to Alex".
   4. Optional, only after 1 to 3 work: a strip above the board showing each teammate
      and how many in-progress tasks they have.
   Plan first, then build 1 to 3 before asking me about 4.
   ```
2. For part 4 not a whos deiving what a team button at the top where you can see the people in the team remove them or add another im not sure what to replace whos driving what but i dont think its a good
3. (Answers picked from Claude's multiple-choice questions) Team rule: "Yes, make it editable". Removing: "Block until handed off". Counts: "Yes, show counts". Team size: "1 to 6, colours repeat after 4".
4. the hand off to could look better and be better grouped with the owner maybe a switch icon to show its changing owner

**Files changed:**
- `src/App.jsx`: new `Avatar` component (initials in a coloured circle) shown with the assignee name on every card and in the modal; `initials`, `avatarColour`, `makeStartingTeam` and `nextAvatarColour` helpers; the team is now state saved with `useLocalStorage('vibetracker.team', ...)` as a list of `{ name, colour }`, starting from the `TEAM` constant, so each person keeps their colour when others are added or removed; for existing tasks the modal shows the owner and a "Hand off to…" dropdown listing only the other teammates, which saves straight away (new tasks keep the Assignee dropdown); a toast "Handed off to {name}." fades in and out (200 ms) and hides after 3 seconds, announced to screen readers; replaced the optional "who's driving what" strip with a "Team (n)" button that opens a `TeamModal` listing each teammate with their avatar and in-progress count, with Remove (blocked while the person still owns tasks, and hidden when only one person is left) and an "Add a teammate" field (no blanks or duplicates, up to 6 people)
- `src/App.jsx` (prompt 4): owner and "Hand off to…" moved into one "Owner" box below the other fields: current owner's avatar and name, a swap icon (inline SVG `SwapIcon`, Lucide arrow-right-left shape), then the hand-off dropdown, which is greyed out when nobody else is on the team
- `tailwind.config.js`: four avatar colour tokens (`avatar-pink`, `avatar-slate`, `avatar-cyan`, `avatar-orange`)
- `DESIGN.md`: new "Teammate avatars" table in section 2
- `CLAUDE.md`: TEAM line updated to say the team is now editable and saved in localStorage
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M07-avatars.png`, `docs/screenshots/M07-handoff.png`

**Notes for report:**


---

### M08 · due-tint · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M08-due-tint.md and the due-* tokens in @tailwind.config.js.
   Write one function getDueState(task, now) that returns 'calm' | 'warning' | 'alarm' | 'neutral':
   - status done → neutral (always, even if overdue)
   - past due → alarm
   - less than 24h → warning
   - 24h to 2 days → calm
   - more than 2 days → calm
   - no due date → neutral

   Don't tint the whole card. Instead, add a small due badge on each card: a pill-shaped
   chip with a clock icon and text like "Due in 3h", "Due in 2 days" or "Overdue by 1 day".
   Colour the chip (background or border plus icon) using the due-* token for its state.
   Neutral cards with no due date show no chip; done cards can show the date in the
   neutral colour. The rest of the card keeps its normal styling.

   Add a small legend above the board showing each chip colour and what it means.

   Then add a few quick tests or a console check that runs getDueState on example
   dates around each boundary and show me the results.
   ```
2. If its in done change the chip to say done with a green. I want Overdue Due soon, Due in 3+ days and i also want to be able to add times the done chip should be green
3. (Answers picked from Claude's multiple-choice questions) Due time: "Optional time in dueDate (Recommended)". Due soon: "Amber for anything before 3 days, then for 3 days or more change the colour to not be green as done is green". Done chip: "Same green, tick icon (Recommended)".

**Files changed:**
- `src/dueState.js` (new): `getDueState(task, now)`, `dueLabel(task, now)` for the chip text, and `dueDeadline(dueDate)`. A date-only due date counts as due at the end of that day, local time
- `src/App.jsx`: `DUE_STATES` (colour classes and meaning per state), `DueChip` (pill with clock icon) shown on each card that has a due date, `DueLegend` above the board, and a `now` clock in `App` that refreshes every minute so chips update on their own
- `scripts/check-due-state.mjs` (new): 13 boundary checks for `getDueState`, printed as a table
- `package.json`: `check:due` script to run the checks (no new packages)
- `src/dueState.js`, `src/App.jsx` (prompts 2 and 3): "Due soon" now means less than 3 days left; legend reads Overdue (red), Due soon (amber), Due in 3+ days (grey `due-neutral`), Done (green `due-safe` with a tick icon); every done task shows a "Done" chip; the modal's due date is now a "Due" group with Date and an optional Time, saved together in `dueDate` as 'YYYY-MM-DDTHH:mm'; no time still means due at the end of the day
- `scripts/check-due-state.mjs` (prompts 2 and 3): checks updated for the 3-day boundary, times and Done (15 checks)
- `PRD.md`: section 5 `dueDate` format now allows an optional time
- `DESIGN.md`, `tailwind.config.js`: due token descriptions updated to the new meanings
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M08-due.png`

**Notes for report:**


---
