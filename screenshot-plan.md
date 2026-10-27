# Screenshot plan and requirement check

Prototype: Vibecoding Project Tracker. All code references are `src/App.jsx` unless another file is named.
Line numbers are from the working copy on 27 Oct 2026 (uncommitted login, boards and accessibility changes included). If you commit or edit first, re-check them.

Demo accounts: `sian@email.com` / `password` and `ela@email.com` / `password`.

---

## Part A: Requirement check

Key: ✅ fully met · ⚠️ partly met · ❌ not met

### Functional

| ID | Where | Verdict | Why |
|---|---|---|---|
| FR1 | `STAGES` 42, `Column` 1305, rendered in `App` at 1041 | ✅ | Four columns in that order, IDs fixed in one constant. |
| FR2 | `TaskModal` 2329, title check `checkedDraft` 2391, `saveTask` 847, `openNewTask` 831 | ⚠️ | Title, description, type, status, owner and due date are all in the modal, and the empty title is refused with "Please add a title.". But on an existing task the owner is changed by "Hand off to…" (2552), which saves straight away, not on Save. |
| FR3 | `confirmingDelete` 2337, confirm block 2711, `deleteTask` 866 | ✅ | "Delete this task?" message with Keep / Delete. |
| FR4 | Drag: `TaskCard` draggable 1489, drop handlers 1335. Menu: `MoveMenu` 1559, `MenuButton` 1598. Toast: `moveTask` 859 to 863 | ✅ | Both ways call `moveTask`, which shows "Moved to Review." It is a menu button rather than a native dropdown, which is fine. |
| FR5 | `Column` collapsed view 1364, `toggleColumn` 822, saved in `vibetracker.collapsed` 820 | ✅ | Each column collapses to a strip and expands again. |
| FR6 | `TASK_TYPES` 59, `TypeIcon` 1442, `TypeBadge` 1461, card stripe in `TaskCard` 1478 | ✅ | Colour plus icon plus the words "Feature" or "Bug". |
| FR7 | Default owner 838, `Avatar` 2152, `initials` 394, hand-off 2539 to 2571, toast 887 | ✅ | Defaults to the logged-in user, initials on the card, toast "Handed off to …". Wording clash: "owner" of a task vs "Owner" of a board (see Part D). |
| FR8 | `TeamModal` 2770, add checks 2799 to 2806, `MAX_TEAM_SIZE` 54, block 2812, confirm in the team list, `addTeammate` 795, `removeTeammate` 800 | ✅ | Unknown email, already on board and board full all refused. Removal needs confirmation and is blocked if the person owns open tasks. |
| FR9 | `src/dueState.js` `getDueState` 29, `dueLabel` 76, `DUE_STATES` 210, `dueChipText` 1852, `DueChip` 1860, due inputs 2575, timer 767 | ⚠️ | Works, and updates every minute. But the chip labels are "Overdue", "Due soon", "Due later", "Done", not "Due in under 3 days" / "Due in 3+ days". |
| FR10 | `CONTEXT_TEMPLATE` 137, new tasks get it in `openNewTask` 842, textarea 2686 | ✅ | Field is plain text that holds Markdown (not rendered as formatted Markdown). |
| FR11 | `contextUpdatedAt` set in `checkedDraft` 2394, shown 2695 to 2705, `timeAgo` 2309, template confirm 2664 | ✅ | Only changes when the context text changes. Replace needs confirmation only if the user wrote their own text. |
| FR12 | `buildContextMarkdown` 142, `copyContext` 894, buttons on card 1527 and modal 2658 | ✅ | Empty owner, due date, description and context are left out. |
| FR13 | `CONTEXT_TOOLS` 109, `AI_TOOL_LINKS` 113, `aiToolLink` 126, card link 1536, modal link 2624 | ✅ | Claude, ChatGPT and Cursor get the context in the link. Lovable and Replit only open. "Other" has no link (wording, see Part D). |
| FR14 | `ANCHORS` 90, `AnchorBoard` 1143, `AnchorCard` 1177, `isValidUrl` 99, `saveAnchorUrl` 905 | ⚠️ | Owner only, works. But `isValidUrl` also accepts `http://`, so "must start with https://" is not enforced. |
| FR15 | `FilterBar` 1925, `matchesFilters` 190, per-board filters 811, "Showing X of Y" 1980 | ⚠️ | All four filters work and reset on reload. But "Showing X of Y tasks" is always shown, not only while filters are on. |
| FR16 | `StatsModal` 3227, sections 3307 to 3335, `BarList` 3376 | ✅ | Most used AI tool, due date spread, most open tasks, overdue by person. It is called "Stats", not "status pane". |
| FR17 | `useTheme` 648, toggle 976, no-flash script in `index.html` | ✅ | Also follows the system setting until the user picks. |
| FR18 | `SignUpForm` 3128, `accountErrors` 365, `looksLikeEmail` 351, `signUp` 772 | ✅ | All listed checks. Also refuses a name already taken (not in the wording). |
| FR19 | `LogInForm` 3053, `findAccount` 356, error 3065, `vibetracker.session` 725, `logOut` 916 | ✅ | General error, stays logged in, log out works. Email is case-insensitive. |
| FR20 | `CreateBoardModal` 1776, `createBoard` 783 | ✅ | Name required, creator is Owner, board opens straight away with its own tasks, members and links. |
| FR21 | `BoardSwitcher` 1721, `openBoard` 778, `vibetracker.lastBoard` 730, board chosen 734 to 737 | ✅ | Shows "Board name · Role" with a tick on the open board. Last board reopens after login or refresh. |
| FR22 | Roles per board in `boards[].members`, `isOwner` 741, notes 1152 and 2947, hidden controls in `AnchorCard` 1182 and `TeamModal` 2922 | ✅ | Members see notes in place of the controls. The functions also check the role (795, 800, 905). |

### Non-functional

| ID | Where | Verdict | Why |
|---|---|---|---|
| NFR1 | Tokens in `tailwind.config.js`, `fieldClass` 1137, `buttonBaseClass` 1123 | ⚠️ | All text passes 4.5:1 in both modes (lowest 4.51:1, white on blue button). Focus rings pass. But input and secondary-button borders are 1.23:1 (light) and 1.47:1 (dark), below the 3:1 for UI components. |
| NFR2 | `TASK_TYPES` 59, `dueChipText` 1852, filter ticks in `FilterChip` 2116, anchor dot 1222, menu tick 1706, bar numbers 3376 | ✅ | Every colour has words, an icon or a shape with it. |
| NFR3 | `MoveMenu` 1559, `MenuButton` keys 1631 to 1658 | ✅ | Nothing needs dragging. Moving takes two clicks (open, choose), which meets WCAG 2.5.7 but isn't literally "single click". |
| NFR4 | Focus classes on every control (e.g. 1123, 1137), `useFocusTrap` 679, Esc in each modal (1785, 2344, 2786, 3233) | ⚠️ | All four modals trap focus, close on Esc and return focus. Two edge cases lose focus: moving a card into a collapsed column (1583), and creating a board from the "no boards" screen (opener has gone). |
| NFR5 | Toast `role="status"` `aria-live="polite"` 1108, `role="alert"` on every error (e.g. `TextField` 3014, anchor 1272, task title 2453, team 2940, login 3104) | ✅ | |
| NFR6 | All updates are local React state plus localStorage | ✅ (not measured) | No network calls, so it should be well under 0.1 s, but no timing has been recorded. |
| NFR7 | No `dangerouslySetInnerHTML` anywhere, `encodeURIComponent` in `aiToolLink` 130, `isValidUrl` 99 | ✅ | React shows text as text. `javascript:` links are refused. |
| NFR8 | Accounts in `signUp` 772: name, email, password, avatar colour | ✅ | No other personal data. |
| NFR9 | `findAccount` 356 compares plain text, `DEMO_PASSWORD` 248 | ❌ | Passwords are stored and compared in plain text in localStorage. Hashing needs a backend (and bcrypt is an npm package). |
| NFR10 | Vite static build (`npm run build`), deployed on Vercel | ✅ | |
| NFR11 | Column layout 1041, cards `TaskCard` 1478, modal edit, drag and drop | ✅ (subjective) | Left to right columns, cards, click to open, drag to move, like Trello. Needs a comparison to prove. |
| NFR12 | Delete confirm 2711, remove confirm in `TeamModal`, template confirm 2664 | ⚠️ | Deleting tasks, removing members and replacing context all need confirmation. But Esc (2344) or one click on the backdrop (2416) closes the task modal and throws away unsaved context edits without asking. |

### Data

| ID | Where | Verdict | Why |
|---|---|---|---|
| DR1 | `useLocalStorage` 622 | ❌ (by design) | localStorage only, one browser. The requirement already says so. |
| DR2 | `signUp` 772, `makeStartingAccounts` 251 | ⚠️ | Accounts hold name, email, password and avatar colour. Preferences (theme, collapsed columns) are saved per browser, not per account. |
| DR3 | `makeStartingData` 287, `createBoard` 783 | ✅ | `{ id, name, members: [{ email, role }], tasks, anchors }`. |
| DR4 | Task typedef 26 to 38, `openNewTask` 831 | ⚠️ | Has id, title, description, type, status, due date and time, context, context last changed, AI tool, created date. Missing: board ID (tasks sit inside their board), owner ID (owner is stored by name), updated date. |
| DR5 | `CONTEXT_TEMPLATE` 137 | ✅ | |
| DR6 | `AI_TOOL_LINKS` 113 | ✅ | `url`, and `promptUrl` only for tools that take a prompt. |
| DR7 | `ANCHORS` 90, `boards[].anchors` | ✅ | |
| DR8 | `getDueState` / `dueGroup` in `src/dueState.js`, stats worked out in `StatsModal` 3242 to 3275 | ✅ | Nothing calculated is saved. |

---

## Part B: Screenshot plan

### Before you start
- Use a **fresh browser profile or a private window** on the Vercel link. With nothing saved, the app creates the seed data: "Group Project" (Sian Owner; Ela, Bingo and Bonnie Members; 10 tasks covering every column and due state) and "Ela's Board" (Ela Owner, Sian Member, 3 tasks). Your normal browser has older migrated data, so the cards won't match these steps.
- Set the window to about 1440 px wide, light mode, zoom 100%.
- Keep the address bar in shot for S5 (it proves NFR10).
- Toasts disappear after 3 seconds. Use Win + Shift + S and click the action just before the snip, or use a screen recording and take a frame.

### Screenshots

| ✓ | # | Covers | Steps | Point out |
|---|---|---|---|---|
| ☐ | S1 | FR19, NFR5 | Open the app. Type `sian@email.com` and password `wrong`, press Enter. | Visible labels, "Email or password is incorrect" (doesn't say which), demo hint. |
| ☐ | S2a | FR18 | Click "Sign up". Leave Name empty, Email `bad-email`, Password `short`. Press Enter. | One error under each field. |
| ☐ | S2b | FR18 | Same form: Name `Test User`, Email `sian@email.com`, Password `password1`. Submit. | "This email is already registered." |
| ☐ | S3 | FR18, FR20 | Change Email to `test@email.com`, submit. | Logged in straight away, "You're not on any boards yet" empty state, Create board button. |
| ☐ | S4 | FR20, FR22 | Click "Create board", press Create with the name empty (S4a, error). Type `Test Board`, Create (S4b). | Name required error; new empty board, switcher shows "Test Board · Owner", header role "Owner". Then Log out. |
| ☐ | S5 | FR1, FR6, FR7, FR9, FR14, FR21, NFR2, NFR10, NFR11 | Log in as Sian. On Group Project, in the Demo deliverable type `https://example.com/demo`, Save. Full-window screenshot. | Four columns; Feature/Bug labels; initials avatars; due chips "Overdue", "Due soon", "Due later", "Done"; Demo link with Edit/Clear (Owner); switcher "Group Project · Owner"; Vercel URL in the address bar. |
| ☐ | S6 | FR21, NFR4 | Tab to the board switcher, press Enter. | Both boards with roles ("Group Project · Owner", "Ela's Board · Member"), tick on the open one, "Create board", visible focus on the first item. |
| ☐ | S7a | FR22, FR21 | Choose "Ela's Board". | Header says "Member"; "Only the owner can edit deliverable links"; no inputs. |
| ☐ | S7b | FR22 | Click "Team". | "Only the owner can manage the team", no bins, each member's role. Close, switch back to Group Project. |
| ☐ | S8 | FR2, FR7, FR10, DR5, NFR5 | Click "Add task", press Save with the title empty. | All fields; "Please add a title."; Assignee defaults to Sian; Context pre-filled with the four headings. Cancel. |
| ☐ | S9a | FR2, FR11, FR13, FR12 | Click the card "Add the task modal". | Edit mode, Owner box with "Hand off to…", AI tool Claude with "Open in Claude", "Last updated 2 hours ago", Copy Context button. |
| ☐ | S9b | FR11, NFR12 | In the same modal click "Use template". | "Replace your context with the template?" with Keep my text / Replace. Click Keep my text. |
| ☐ | S10 | FR7 | In "Hand off to…" pick Ela Morgan. | Toast "Handed off to Ela Morgan.", card now shows Ela's initials. |
| ☐ | S11 | FR3, NFR12 | Open "Toast shows behind the modal", click Delete. | "Delete this task?" confirmation. Click Keep. |
| ☐ | S12 | FR4, NFR3 | On "Build the Anchor Board" click "Move to" (S12a, menu open). Choose Review (S12b). | Menu of the other three columns; toast "Moved to Review."; card in Review. |
| ☐ | S13 | FR12 | On "Toast shows behind the modal" (no due date) click Copy Context, then paste into Notepad. Snip both. | Toast "Copied to clipboard!"; pasted Markdown has no "Due" part. |
| ☐ | S14 | FR13, NFR7 | On "Add the task modal" click the "Claude" pill. | New tab at claude.ai with the briefing in the box; `%0A`-style encoding in the address bar. |
| ☐ | S15 | FR14, NFR7 | Click Edit on the Demo link, replace it with `javascript:alert(1)`, Save. | "Enter a full link starting with https://" and nothing runs. Cancel. |
| ☐ | S16a | FR8 | Team panel, type `nobody@email.com`, Add. | "No account with that email". (Optionally `bingo@email.com` for "Already on this board".) |
| ☐ | S16b | FR8, NFR12 | Click the bin next to Bingo Edwards. | "Bingo Edwards still owns 3 open tasks. Hand them off first." |
| ☐ | S16c | FR8, NFR12 | Add `test@email.com`, then click the bin next to Test User. | "Remove Test User from the team?" with Keep / Remove. |
| ☐ | S17 | FR15, FR5 | Close the panel. Collapse the Done column. Filters > Person > Bingo, then Type > Bug. | "Showing X of Y tasks", "Clear filters", ticks on chosen options, Done as a narrow strip. |
| ☐ | S18 | FR16, DR8 | Clear filters, click "Stats". | Four sections, each bar with its number. |
| ☐ | S19 | FR17, NFR1 | Close Stats, click the moon button. Full-window screenshot. | Same board in dark mode. |
| ☐ | S20 | FR9 | Open any task, set the due date to today and the time 2 minutes from now, Save. Snip the chip; wait 3 minutes without reloading, snip again. | "Due soon · in 2 min" changes to "Overdue by 1 min" with no reload. |
| ☐ | S21 | FR19, FR21 | Switch to "Ela's Board", press F5. | Still logged in, still on Ela's Board. |

### Evidence that isn't a normal screenshot

| ✓ | # | Covers | Evidence | Point out |
|---|---|---|---|---|
| ☐ | E1 | DR1, DR2, DR3, DR4, DR7, NFR8, NFR9 | DevTools (F12) > Application > Local storage > the site. Click `vibetracker.accounts`, then `vibetracker.boards`. | Data lives in the browser only (DR1); accounts hold name, email, password, colour only (NFR8, DR2); **password in plain text (NFR9 not met)**; board with members, roles, tasks, anchors (DR3, DR7); task fields (DR4). |
| ☐ | E2 | FR19, FR21 | Same pane, `vibetracker.session` and `vibetracker.lastBoard`. | Why login and last board survive a refresh. |
| ☐ | E3 | NFR1 | Lighthouse > Accessibility, both modes. Plus a contrast checker (e.g. WebAIM) on `#ece7df` vs `#ffffff`. | Text contrast passes. Field borders 1.23:1 (honest gap). |
| ☐ | E4 | NFR4, NFR3 | Short screen recording: Tab to a card, Move to with arrows, Enter; open a task, Tab past the last field (focus loops), Esc (focus back on the card). | Visible focus ring each step, trap, Esc, focus return. |
| ☐ | E5 | NFR5 | DevTools > Elements, select the toast, open the Accessibility pane. Or NVDA Speech Viewer while moving a card. | Role "status", live region "polite"; errors role "alert". |
| ☐ | E6 | NFR6 | DevTools > Performance, record, move a card with Move to, stop. | The click to paint time (expect a few ms). |
| ☐ | E7 | NFR7 | Create a task titled `<img src=x onerror=alert(1)>`; screenshot the card. Plus code snippet `isValidUrl` (99 to 106) and `aiToolLink` (126 to 134). | Shown as plain text, nothing runs. |
| ☐ | E8 | NFR9 | Code snippet `findAccount` (356 to 360). | Plain-text compare; explain production would hash with bcrypt on a server. |
| ☐ | E9 | NFR11 | Your own screenshot of a Trello board next to S5. | Same column layout, cards, add button. |
| ☐ | E10 | DR5, DR6, DR8 | Code snippets: `CONTEXT_TEMPLATE` (137), `AI_TOOL_LINKS` (113 to 119), `getDueState` (`src/dueState.js` 29 to 36). | Hard-coded template, tool table, due states calculated not stored. |
| ☐ | E11 | NFR10 | Covered by S5 address bar. Optionally a phone screenshot of the Vercel link. | Runs in a browser, nothing to install. |

---

## Part C: Secret sauce (beyond the literal requirements)

| # | What and where | Closest req | Why it helps (UX principle) | Screenshot? |
|---|---|---|---|---|
| 1 | Seed data with dates relative to today (`makeSeedTasks` 436, `daysFromToday` 418) covering every column, due state and tool | none | The app never looks empty or out of date when opened (Recognition rather than recall). | No, implied by S5 |
| 2 | Second demo board, "Ela's Board", with 3 tasks (`makeElasBoardTasks` 578) | FR21, FR22 | Lets a marker see per-board roles without setting anything up (Flexibility and efficiency of use). | Covered by S7 |
| 3 | One-off migration of old single-board data into "Group Project" (`makeStartingData` 287) | none | Existing users lose nothing on upgrade (Error prevention). | No, mention in text |
| 4 | Autofocus on the first field of every form and panel (680, 1825, 2442, login and sign-up fields) | NFR4 | Users can start typing straight away (Efficiency of use). | No |
| 5 | Enter submits every form; Esc closes panels and backs out of a confirmation first (2344, 2786) | NFR4 | Fewer clicks, and Esc never skips past an open question (User control and freedom). | No |
| 6 | Arrow, Home, End keys in menus; Tab or Esc closes (1631 to 1658) | NFR3 | Matches how menus work everywhere else (Consistency and standards). | E4 recording |
| 7 | Focus follows a moved card to its new column (1583) and moves to the next sensible control after collapsing or clearing filters (1323, 1940) | NFR4 | Keyboard users don't lose their place (Visibility of system status). | No |
| 8 | Toasts for move, hand-off and copy, fading after 3 s (874 to 885, transition 1110) | FR4, FR7 | Confirms the action without blocking work (Visibility of system status). | Covered by S10, S12 |
| 9 | Copy failure has its own message (899) | FR12 | Users know to try again instead of pasting nothing (Help users recover from errors). | No |
| 10 | "Too long for a link" fallback over 7000 characters (`MAX_LINK_LENGTH` 122, message 2639) | FR13 | The tool still opens and the user is told to paste instead (Error prevention). | No |
| 11 | Optional due time, and "end of the day" when no time is set (`dueDeadline` in `src/dueState.js` 14, time disabled until a date 2593) | FR9 | Matches how people think about deadlines (Match between system and real world). | No |
| 12 | Done overrides overdue: a finished task shows "Done", never red (`getDueState` 30) | FR9 | No false alarms on finished work (Aesthetic and minimalist design). | Covered by S5 |
| 13 | Clickable due-date key that is also a filter, with "No chip means no due date" note (`DueKeyChips` 1887, 1915) | FR15, FR9 | The legend explains the colours and filters in one place (Recognition rather than recall). | Covered by S17 |
| 14 | Filters per board and reflected in Stats (811, 3224) | FR15, FR16 | The numbers always match what is on screen (Consistency). | Covered by S17, S18 |
| 15 | Collapsed columns remembered after reload (`vibetracker.collapsed` 820) | FR5 | The board stays the way the user left it (User control and freedom). | No |
| 16 | Task count on each column heading, also on collapsed strips (1360) | FR1 | See workload without opening anything (Visibility of system status). | Covered by S5 |
| 17 | Empty column messages: "Nothing here yet." / "No tasks here match the filters." (1421) | FR1, FR15 | Explains why a column is empty (Visibility of system status). | Optional, in S17 |
| 18 | "No boards" empty state with your email shown (`NoBoards` 1756) | FR18, FR20 | Tells new users exactly what to do next (Help and documentation). | Covered by S3 |
| 19 | "Last updated 2 hours ago" with the exact time as a tooltip, and "(unsaved changes)" (2695 to 2705, `timeAgo` 2309) | FR11 | Users can judge if a briefing is stale (Visibility of system status). | Covered by S9a |
| 20 | Hand-off saves at once and is disabled when you are alone on the board (2554, 2555) | FR7 | One action, no forgotten Save (Efficiency of use). | No |
| 21 | Team panel shows each person's role and open task count (2919) | FR8 | The Owner sees who can be removed before trying (Error prevention). | Covered by S7b |
| 22 | Owner can't remove themselves, no bin on own row (2922) | FR8 | Stops a board ending up with no Owner (Error prevention). | Covered by S16 |
| 23 | Sign-up refuses a name already taken (369) | FR18 | Owners on cards stay unambiguous (Error prevention). | Optional |
| 24 | Email is case-insensitive at log in and sign-up (356, 374) | FR19 | `Sian@Email.com` still works (Error prevention). | No |
| 25 | Demo accounts hint on the login screen (3119) | FR19 | Markers can log in without asking (Help and documentation). | Covered by S1 |
| 26 | Failed login re-announced each try (`key={failedTries}` 3104) | NFR5 | Screen reader users hear every failure (Visibility of system status). | No |
| 27 | Theme follows the system until chosen, remembered, and no light flash on load (`useTheme` 648, `index.html` script) | FR17 | Respects the user's own setting (User control and freedom). | No |
| 28 | Tooltips on icon-only buttons and truncated text (977, 1286, 1377, 1412, 1539, 2928, 3384) | NFR4 | Explains icons on hover (Recognition rather than recall). | No |
| 29 | Hidden screen reader text, e.g. "(opens in a new tab)", "(link added)" (1291, 1548, 2633) | NFR5 | Screen reader users get the same context as sighted users (Accessibility). | No |
| 30 | 44 px minimum touch targets (`min-h-11` in `buttonBaseClass` 1123, `cardActionClass`) | NFR3 | Easier to hit on touch screens (Fitts's law). | No |
| 31 | Drag feedback: card fades, target column outlined, collapsed strips accept drops (1497, 1335) | FR4 | Shows where the card will land (Visibility of system status). | Optional mid-drag |
| 32 | Two-column task modal on wide screens, stacked on narrow ones (2436) | FR2 | Task details and context side by side (Aesthetic and minimalist design). | Covered by S9a |
| 33 | Type picker as two large buttons with icons (2476) | FR6 | Faster than a dropdown for two choices (Fitts's law). | Covered by S8 |
| 34 | Stats sentences, ties kept, "No tool" never counted as a tool (3205 to 3250) | FR16 | A plain answer before the chart (Match between system and real world). | Covered by S18 |
| 35 | Anchor dot: empty with no link, filled with one (1222) | FR14 | Shows progress on deliverables at a glance (Visibility of system status). | Covered by S5 |
| 36 | Fonts: Plus Jakarta Sans for text, JetBrains Mono for chips and badges (`index.html`, `tailwind.config.js`) | none | Code-like labels stand out from prose (Aesthetic and minimalist design). | No |
| 37 | Logo | none | There isn't one. The header is text only ("Vibecoding Project Tracker" plus "Team starter" placeholder). | No |

---

## Part D

### GAPS (requirement doesn't match the code) and wording that would match

| ID | Gap | Suggested wording |
|---|---|---|
| FR2 | Owner on an existing task changes through hand-off, which saves straight away. | "…saving only on Save (except hand-off, which saves at once)…" |
| FR7 | "Owner" means both task owner and board Owner. | Use "assignee" for tasks: "Give every task an assignee (defaulting to its creator)…" |
| FR9 | Chip labels differ. | "…labelled chip (Overdue, Due soon (under 3 days), Due later (3+ days), Done)…" |
| FR13 | "Other" has no link, so it can't be opened; grammar. | "Tag a task with an AI tool (…), and open the tool in a new tab where it has a link, including the context when the tool accepts it." |
| FR14 | `http://` links are accepted. | Either change the wording to "must start with http:// or https://", or change `isValidUrl` (line 99) to accept `https:` only. |
| FR15 | "Showing X of Y tasks" is always shown. | "…always showing 'Showing X of Y tasks', and clearing filters on reload." |
| FR16 | It is called Stats. | "Show a Stats panel with…" |
| FR18 | Also rejects a name already taken. | "…rejecting an empty or already used name, an invalid or already registered email…" |
| NFR1 | Input and secondary-button borders are 1.23:1 (light) / 1.47:1 (dark). | Fix `fieldClass` border to a 3:1 colour, or narrow the wording to "text and focus indicators". |
| NFR3 | Move to is two clicks. | "…work by keyboard and by single pointer clicks, without dragging." |
| NFR4 | Focus is lost in two edge cases. | Add "except when the element that opened the modal no longer exists" or fix in code. |
| NFR6 | Not measured. | Keep it, and add the E6 trace as evidence. |
| NFR9 | Passwords are plain text. | "In production, store passwords hashed (e.g. bcrypt) on the server. The prototype stores demo passwords in plain text." and drop MVP. |
| NFR12 | Esc or a backdrop click discards unsaved task edits, including context, with no warning. | "…deleting tasks, removing members or replacing context…", or add an "unsaved changes" check. |
| DR1 | localStorage, not a server database. | Already stated. Mark as production, not MVP for the prototype. |
| DR2 | No preferences on the account; avatar colour is stored. | "Accounts: name, email, password and avatar colour. Theme and collapsed columns are saved per browser." |
| DR4 | No board ID, no owner ID (name used), no updated date. | "Tasks (stored inside their board): ID, title, description, type, status, assignee name, due date and time, context, context last changed, AI tool, created date." |

### EXTRAS (no requirement at all), to justify or remove

| Extra | Where | Suggested justification |
|---|---|---|
| Seed data and the demo board | 436, 578 | Needed for the demo and the CLAUDE.md rule that seed dates are relative to today. |
| Data migration to "Group Project" | 287 | Protects existing users' data; invisible to new users. |
| Collapsed columns remembered | 820 | Small persistence detail of FR5. Could fold into FR5. |
| Due-date key as a filter, "Clear filters" | 1887, 1985 | Part of FR15's usability. Could fold into FR15. |
| Stats follow the filters | 3224 | Part of FR16. Could fold into FR16. |
| Task count per column | 1360 | Workload at a glance. Could fold into FR1. |
| Empty states (columns, no boards) | 1421, 1756 | Standard empty-state guidance. |
| "Too long for a link" fallback | 2639 | Edge case of FR13. |
| Optional due time and end-of-day rule | 2575, `src/dueState.js` 14 | FR9 already says "date and time"; the end-of-day rule needs stating. |
| Demo hint on login | 3119 | For markers; remove in production. |
| Theme follows system setting | 648 | Part of FR17. |
| Duplicate name check at sign-up | 369 | Tasks store the owner by name, so names must be unique. |
| Owner can't remove themselves | 2922 | Keeps every board with an Owner. Add to FR8. |
| Fonts | `index.html` | DESIGN.md tokens; no requirement needed. |
