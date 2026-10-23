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

### M09 · task-context · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M09-task-context.md and PRD.md section 5 (context, contextTool, contextUpdatedAt).
   Add a labelled "Context" Markdown textarea to the task modal, with an optional
   "AI tool" dropdown below it (Claude, ChatGPT, Cursor, Lovable, Replit, Other).
   New tasks get this template in the context field:
   ## Background
   ## Constraints
   ## Tried so far
   ## Pick up
   Set contextUpdatedAt to the current ISO time only when the context text actually
   changes on save (not on every save). Show "last updated X ago" under the field.
   Existing tasks without these fields must still load without errors.
   Plan first. Don't do the stretch preview yet.
   ```
2. im happy for time stamp to be blank, yeah
3. Rearrange the edit and create modal Title top definetely i think then type status and owner then context ai tool and due
4. can u put a use temblate button above the context field which then puts in the create placeholder text

   ```
   In the task detail panel, next to the Context field, add two buttons: "Copy" and "Open in [tool]".

   - Copy: copies the Context text to the clipboard and shows "Copied" for 2 seconds.
   - Open in [tool]: only shown when the AI tool is ChatGPT, Claude or Cursor.
     It always copies the text first, then opens the tool in a new tab using:
     - ChatGPT: https://chatgpt.com/?q=
     - Claude: https://claude.ai/new?q=
     - Cursor: https://cursor.com/link/prompt?text=
     Encode the text with encodeURIComponent.
     If the full URL is over 7,000 characters, open the base URL with no text instead
     and show "Too long for a link, it's on your clipboard, just paste".
   - For Claude Code, Copilot, Other or None, only show Copy.

   Keep the tool URLs in one small config object so I can add tools later.
   ```

   For the other tools that are listed just find the generic link for them ignore the copy bit for now
5. The use template i dont want the browser warning i also what use template smaller with an icon that matches it as well as open in i want an icon

**Files changed:**
- `src/App.jsx`: `CONTEXT_TOOLS`, `CONTEXT_TEMPLATE` and `CONTEXT_DEFAULTS` constants; new tasks start with the template; the modal fills in missing context fields for older tasks; a "Context" Markdown textarea with a "Last updated X ago" hint (or "Not updated yet", plus "(unsaved changes)" while edited) and an "AI tool (optional)" dropdown; `contextUpdatedAt` is only set on Save or Hand off when the context text differs from when the modal opened, so an untouched template stays blank; `timeAgo()` helper using the built-in `Intl.RelativeTimeFormat`; the modal now scrolls inside itself when taller than the screen; seed task 2 has an example context; `Task` JSDoc lists the new fields
- `src/App.jsx` (prompt 3): modal fields reordered to Title, Description, Type and Status, Assignee (new task) or Owner box (existing task), Context, AI tool, Due
- `src/App.jsx` (prompt 4): "Use template" button above Context (asks before replacing your own text); `AI_TOOL_LINKS` config and `aiToolLink()`; an "Open in [tool]" link next to the AI tool dropdown for Claude, ChatGPT and Cursor (context passed in the link) and Lovable and Replit (home page only); links over 7,000 characters open the tool without the text and show a message. No Copy button or clipboard code yet (left for M10)
- `src/App.jsx` (prompt 5): the browser pop-up for "Use template" replaced by a small in-modal message ("Keep my text" / "Replace", Escape closes it); "Use template" is now a smaller borderless button (`smallButtonClass`) with a template icon; "Open in [tool]" has an external-link icon; new `Icon` component with Lucide `layout-template` and `external-link` paths
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M09-context.png`

**Notes for report:**


---

### M10 · copy-context · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M10-copy-context.md.
   Write one function buildContextMarkdown(task) that returns this format:
   [PASTE YOUR FORMAT HERE]
   Skip empty sections rather than printing blank headings.
   Add a "Copy Context" button on each card and in the modal that copies it with
   navigator.clipboard.writeText. Clicking the button on a card must NOT open the modal.
   Show a short "Copied to clipboard!" confirmation. If copying fails, say so.
   ```

   Maybe i also have a small open tool button aswell i dont know if format is relevant bearing in mind a template is already used in conext text window
2. (Answers to Claude's questions) Format: "Briefing only" (title, details line, description, then the Context as written). Empty headings inside the Context: "Keep Context as written". Open tool button: "Also add one to cards".
3. i want the copy to be smaller i want a way to see which tool will be opened so a small label saying actual tool

**Files changed:**
- `src/App.jsx`: new `buildContextMarkdown(task)` that builds `# Task: {title}`, a `Type · Status · Owner · Due` line, `## Description`, then the Context as written (no owner, due date, description or context means that part is left out); the hand-off toast is now shared through `showToast()`; new `copyContext()` copies with `navigator.clipboard.writeText` and shows "Copied to clipboard!" or "Could not copy to the clipboard. Please try again."; task cards are now a box holding the open button plus a separate "Copy Context" button and an icon-only "Open in [tool]" link (only when the task has a tool with a link), so pressing them does not open the modal; the modal has a "Copy Context" button next to "Use template" that copies the draft, unsaved edits included; the modal's "Open in [tool]" link now sends the full briefing instead of only the Context; new `COPY_ICON` (Lucide `copy`)
- `src/App.jsx` (prompt 3): the card's "Copy Context" and tool link are now small outlined pills (`cardActionClass` and `cardPillClass`), with a 44 px press area kept around each one; the tool link shows the tool's name (e.g. "Claude") next to the icon; `Icon` takes an optional `className` for a smaller size
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M10-copy.png`, `docs/screenshots/M10-pasted.png`

**Notes for report:**


---

### M11 · project-deliverables · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @milestones/M11-project-deliverables.md and the Anchor model in PRD.md section 5.
   Add a row of four anchor cards above the board (Presentation, Demo, Report,
   Documentation). Each has a URL input and a dot: empty when there's no URL, filled
   when there is. Save to localStorage with its own key, separate from tasks.
   When a URL is saved, make it clickable (opens in a new tab).
   Decide with me what counts as a valid URL before building.
   ```
2. (Answers to Claude's questions) Valid URL: "http(s) only" (must parse as a URL and start with http:// or https://; 'hello' and 'javascript:' links are refused). Save style: "Save button + Clear".
3. make the height smaller of deliverables

**Files changed:**
- `src/App.jsx`: new `ANCHORS` constant (the four deliverables from PRD §5, each with `url: null`); new `isValidUrl(text)` that accepts only http:// and https:// links; anchors saved under their own localStorage key `vibetracker.anchors` with `saveAnchorUrl()` (null clears a link); new `AnchorBoard` (a "Deliverables" row of four cards above the due-date key and the board) and `AnchorCard` (status dot, URL input with Save and an error message, then once saved a link that opens in a new tab with Edit and Clear)
- `src/App.jsx` (prompt 3): the anchor cards are shorter. Edit and Clear (or Cancel while editing) now sit on the same line as the label instead of their own row, the card padding and gaps are smaller, and there is less space around the "Deliverables" heading
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M11-anchors.png`

**Notes for report:**


---

### M12 · secret-sauce · 2026-10-20

**AI tool:** Claude Code

**Prompts (word for word):**
1. ```
   Read @tailwind.config.js and the main board components before starting. Work through
   these in order, and stop after each section so I can check it before you move on.

   ## 1. Dark mode
   - Add a light/dark toggle in the header (sun/moon icon).
   - Default to the system setting, and remember my choice.
   - Use Tailwind's dark: classes. Every colour, including the due-* tokens, needs a
     dark version that still passes contrast checks.

   ## 2. Filters
   Add a filter bar above the board with:
   - Person (multi-select, shows avatars or initials)
   - Due date (Overdue, Due today, This week, No date)
   - AI tool (multi-select)
   Filters combine (AND). Show a "Clear filters" button when any are active, and a count
   like "Showing 8 of 23 tasks".

   ## 3. Collapsible columns
   - Add a collapse button (chevron icon) to each column header.
   - A collapsed column becomes a thin vertical strip showing the column name and task count.
   - Remember which columns are collapsed.

   ## 4. Stats panel
   Add a "Stats" button (chart icon) next to the Team button. It opens a modal showing:
   - Most used AI tool (with counts for each tool)
   - How tasks are spread across due dates (Overdue, Today, This week, Later, No date)
   - Who has the most open tasks
   - Who has overdue tasks, and how many
   Keep it simple: small bar charts or counts, no heavy chart library unless one is
   already installed. Stats should respect the current filters.

   ## 5. Team menu
   - Add person: user-plus icon
   - Remove person: bin icon, with a confirm step before removing
   - Show each person's avatar or initials and their open task count

   ## 6. Icons
   For any button with an obvious matching icon, add it (e.g. edit = pencil, delete = bin,
   copy = clipboard, close = X, settings = cog, filter = funnel). Use one icon library
   consistently. If one is already installed, use that. Otherwise use lucide-react.
   Icon-only buttons need an aria-label and a tooltip.

   ## 7. Accessibility and visual review
   Go through the whole UI in both light and dark mode and fix:
   - Text and badge contrast (aim for WCAG AA, 4.5:1 for normal text)
   - Due states must not rely on colour alone. Keep the clock icon and the "Due in..." text
   - Visible focus styles on all interactive elements
   - Everything usable by keyboard, including modals (focus trap, Esc to close)
   - Consistent spacing, border radius and font sizes across cards, columns and modals
   Then give me a short list of what you changed and anything you'd still improve.

   Don't add new features beyond this list. If something conflicts with existing code or
   you need to make a design call, tell me what you chose and why.
   ```
2. Looks good this is M12 stuff Dark mode lppks good move on
3. I think the filter options should be collasable so if you choose to filter by perople the options are then clickable
4. Ready for u to move on
5. Happt with this
6. Next
7. next
8. ready
9. Can u make tasks drag and dropable
10. can u put some dummy data in please
11. Secret sauce pt 2. I want to also be able to filter by feature or bug with their icons and colours persent when filtering. I want the due dates key to be in the filter pane instead of it being seperate atm. On each individual card on the kanban board I want next to the bug or feature icon i want text as well saying bug or feature

12. The due date filter i want to look like the key but be clickable i want to be able to filter to overdue due soon due in 3+days and done with their respective colours. In the create and edit modal im thinking the ai tool be on the right side like expand the modal to be bigger and u can edit the task on the left and the ai tool and context on the right
13. In the filters menu u have Person which expands to show people type which expands to show the type and ai tool I want Due dates to be in that row and once expanded you have the current due dates selector

**Files changed:**
- `tailwind.config.js`: `darkMode: 'class'`; a `-dark` twin for every colour token (brand, surface, text, border, type and all `due-*` tints and inks), each checked for WCAG AA contrast
- `index.html`: a small script that sets light or dark before the page draws (saved choice, otherwise the system setting), so it doesn't flash light first
- `src/index.css`: dark page background and text; `color-scheme: dark` so date pickers and dropdowns go dark too
- `src/dueState.js`: new `dueGroup(task, now)` (done, none, overdue, today, week, later), shared by the filters and the Stats panel
- `scripts/check-due-state.mjs`: 10 new checks for `dueGroup` (25 checks in total)
- `src/App.jsx` (section 1): `dark:` classes next to every colour class; `useTheme()` hook saved under `vibetracker.theme`; sun/moon toggle in the header
- `src/App.jsx` (section 2, prompt 3): `FilterBar` with Person (avatars), Due date and AI tool filters (AND between filters, any-of inside one), "Showing X of Y tasks", "Clear filters"; each filter is a button that opens its options, one at a time, and shows how many are on while closed; empty columns say "No tasks here match the filters."; removing a teammate also clears their filter
- `src/App.jsx` (section 3): collapse button on each column header; a collapsed column is a thin strip with the name and count; saved under `vibetracker.collapsed`; the board is now a flex row so open columns widen
- `src/App.jsx` (section 4): "Stats" button and `StatsModal` with most used AI tool, open tasks by due date, most open tasks per person and who has overdue tasks; plain div bar charts with the number next to each bar; uses the filtered tasks
- `src/App.jsx` (section 5): Team panel shows open task counts; user-plus icon on Add; icon-only bin button on Remove with a "Remove {name} from the team?" confirm step (Keep / Remove)
- `src/App.jsx` (section 6): icons on Team, Add task, anchor Edit and Clear, Delete, Delete task, Remove and Close; Copy Context now uses a clipboard icon; every icon is an inline Lucide icon through the one `Icon` component, no package added
- `src/App.jsx` (section 7): `useFocusTrap()` keeps Tab inside the Task, Team and Stats modals and returns focus to what opened them; blue text turns brand-accent on hover (brand-primary on its hover tint was 3.94:1); placeholders use text-muted (the browser grey was 2.54:1); Stats and Team modals use the same gap and max height as the Task modal
- `src/App.jsx` (prompt 9): cards can be dragged to another column with the browser's own drag and drop events (no library); `moveTask()` changes the status and shows "Moved to {column}."; the dragged card fades and the column under it gets a blue outline; collapsed strips take drops too; only cards from this board are accepted (`TASK_DRAG_TYPE`); the card's tool link no longer drags its web address
- `src/App.jsx` (prompt 10): `makeSeedTasks()` now has 10 tasks (was 4), still with dates relative to today: every column, every due state and due-date filter, every TEAM name, 6 of the AI tools, 3 tasks with a filled-in context; new `hoursAgo()` helper for the context timestamps. (Overlaps the M13 demo dataset step.)
- `src/App.jsx` (prompt 11): new "Type" filter (Feature / Bug), its chips in each type's own icon and colour, switched on with the type's tint and a tick; `types` added to the filters; `FilterChip` takes an optional `pressedClass`; the due-date key moved from above the board into the bottom row of the filter pane; each card now shows "Feature" or "Bug" next to the type icon, in the type's colour
- `src/App.jsx` (prompt 12): the due-date key is now the due-date filter (`DueKeyFilter`): its Overdue, Due soon, Due in 3+ days and Done chips are toggle buttons in their own colours, more than one can be on, and a switched-on chip gets a solid outline and bold text; the old "Due date" filter button and its Overdue / Due today / This week / No date options are gone (`DUE_FILTERS` removed); new `chipState()` so Done only matches finished tasks; the task modal is wider (`md:max-w-4xl`) with two columns: title, description, type, status, owner, due and created on the left, AI tool and a taller Context on the right, stacking on narrow screens
- `src/App.jsx` (prompt 13): "Due dates" is a filter button again, in the row between Type and AI tool, showing its count while closed; opening it shows the clickable due-date key chips (`DueKeyChips`, was `DueKeyFilter`); the key no longer sits as a separate row at the bottom of the pane
- `DESIGN.md`: §4 Modal notes the wider two-column task modal
- `DESIGN.md`: new "Dark mode" token table with contrast ratios in §2; dark mode crossed out of §7 Out of scope; "+ Add task" microcopy now says a plus icon replaces the "+"; §4 drag affordance now describes drag and drop, with the status dropdown kept for keyboard and screen reader users
- `docs/prompt-log.md`: this entry

**What I checked:**
- [ ] Done-when list ticked in the browser
- [ ] `npm run build` passed

**What I changed or rejected (and why):**


**Requirement ID(s) this relates to:**


**Screenshots:** `docs/screenshots/M12-sauce.png`

**Notes for report:**


---
