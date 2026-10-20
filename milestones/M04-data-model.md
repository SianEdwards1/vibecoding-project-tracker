# M4 · Task data model + board view ⭐

**Tag:** `data-model` · **Phase 3: Build** · **Key milestone** · **Time box:** 45 min (plus 10 min Vercel)

> Get the Kanban on the screen. Everything else hangs off this.

**Before you start:** the M2 leftover is done (example team names in PRD §8).

## Build

- [ ] A task is an object with: `id`, `title`, `description`, `type` (feature / bug), `status`, `assignee`, `dueDate`, `createdDate` (matches PRD §5; the starter already has it in `src/App.jsx`)
- [ ] Render a Kanban board with four columns, in this order, with these exact labels: **To Do, In Progress, Review, Done**
- [ ] Pre-populate 3 or 4 mock tasks so the board isn't empty on first load
- [ ] Each card shows at least the task title and the assignee

## Done when

- [ ] Four columns visible with the right labels
- [ ] 3 to 4 mock tasks spread across columns
- [ ] Every card shows title + assignee
- [ ] `npm run build` passes
- [ ] Tag `data-model` pushed

## Starter prompt

```
Read @milestones/M04-data-model.md and @PRD.md (sections 5, 7 and 8).
Plan how to build the four-column board in src/App.jsx using the existing Task model,
STAGES constant and useLocalStorage hook. Use the colour tokens from tailwind.config.js.
Seed 4 mock tasks across different columns, using the example team names "Sian Edwards", "Ela Morgan" and "Bingo Edwards" and "Bonnie Morgan". Keep those names in one TEAM constant so later milestones reuse it.
Mock due dates must be relative to today (e.g. today + 5 days, today + 12 hours,
yesterday) so the due-date colours in M8 still work whenever someone opens the app.
Explain the plan in plain English before building.
```

## Check it yourself

- Refresh the page. Same tasks still there? (They should be, from localStorage)
- Open DevTools (F12) → Application → Local Storage. You can see your tasks stored as text. Worth understanding, and handy for a screenshot
- Clear that storage and refresh: the seed tasks should come back. This is exactly what the marker will see the first time

## Deploy to Vercel (do it now, once)

1. Go to vercel.com, sign up with GitHub (Hobby, free)
2. **Add New → Project**, import your fork
3. Leave the defaults (Vite is detected), click **Deploy**
4. Copy the **production** URL (short one, `something.vercel.app`) into PRD §11
5. Open it in a private/incognito window to check it works without logging in

From now on every `git push` to `main` updates the live site.

## Ship it

```bash
git add .
git commit -m "data-model"
git tag data-model
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot of the board → `docs/screenshots/M04-board.png`
- [ ] Screenshot of the task data in Local Storage (DevTools) → `docs/screenshots/M04-localstorage.png`
- [ ] Your live URL, tested in incognito
- [ ] Prompt log entry, plus anything you changed or rejected from Claude's plan
- [ ] Requirement ID(s) this covers (from your own requirements list)

## If you get stuck

- **Blank page:** F12 → Console. Paste the red error into Claude Code.
- **Old data showing after changing seed tasks:** localStorage keeps the old ones. Clear it in DevTools and refresh.
- **Vercel build fails:** run `npm run build` locally. If it fails there too, fix that first; the error is the same.
