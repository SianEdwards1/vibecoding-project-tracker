# M11 · Deliverable Anchor Board ⭐

**Tag:** `project-deliverables` (PRD table says `anchors`; see the overview) · **Phase 3: Build** · **Key milestone** · **Time box:** 30 min

> A home for the four final-project deliverables, pinned as a top banner.

## Build

- [ ] 4 cards / elements pinned at the top of the page: **Presentation, Demo, Report, Documentation**
- [ ] Each card has a single URL input field
- [ ] Each has a status indicator (empty / filled dot) that changes when a link is added

Data model from PRD §5: `Anchor = { id, label, url }`, ids `presentation | demo | report | documentation`.

## Done when

- [ ] Four labelled cards always visible above the Kanban board
- [ ] Each card accepts and saves a URL
- [ ] Status indicator changes when a link is present
- [ ] Links survive a page reload
- [ ] `npm run build` passes
- [ ] Tag `project-deliverables` pushed

## Starter prompt

```
Read @milestones/M11-project-deliverables.md and the Anchor model in PRD.md section 5.
Add a row of four anchor cards above the board (Presentation, Demo, Report,
Documentation). Each has a URL input and a dot: empty when there's no URL, filled
when there is. Save to localStorage with its own key, separate from tasks.
When a URL is saved, make it clickable (opens in a new tab).
Decide with me what counts as a valid URL before building.
```

## Check it yourself

- Add a link, refresh. Still there? Dot filled?
- Clear one. Dot goes back to empty?
- Type rubbish (`hello`). What happens? Is that what you want?
- Put your own live Vercel URL in the **Demo** slot. Nice touch for the pitch

## Ship it

```bash
git add .
git commit -m "project-deliverables"
git tag project-deliverables
git tag anchors
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: anchor row with some filled, some empty → `docs/screenshots/M11-anchors.png`
- [ ] What you decided about URL validation, and why
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Anchors wipe the tasks (or the other way round):** they're sharing a localStorage key. Ask Claude to give anchors their own.
