# M8 · Time-based colour coding on cards

**Tag:** `due-tint` · **Phase 3: Build** · **Time box:** 30 min

> No new fields, just styling based on the existing due date.

## Build

Clear visual language for when tasks are due:

- [ ] More than 2 days out: **calm**
- [ ] Less than 24 hours: **warning**
- [ ] Past due: **alarm**
- [ ] Done: **neutral**

## ⚠ Two gaps in the spec. You decide, then tell Claude

1. **Between 24 hours and 2 days** isn't covered by the slide. Calm or warning?
2. **No due date** (`dueDate` is allowed to be null in the PRD). What colour?

Write down what you picked. It's a design decision you can explain later.

## Done when

- [ ] All four states are visibly distinct on the board
- [ ] Colour updates automatically; the user does nothing
- [ ] Done tasks always look neutral, even if they were overdue
- [ ] `npm run build` passes
- [ ] Tag `due-tint` pushed

## Starter prompt

```
Read @milestones/M08-due-tint.md and the due-* tokens in @tailwind.config.js.
Write one function getDueState(task, now) that returns 'calm' | 'warning' | 'alarm' | 'neutral':
- status done → neutral (always, even if overdue)
- past due → alarm
- less than 24h → warning
- 24h to 2 days → [MY CHOICE]
- more than 2 days → calm
- no due date → [MY CHOICE]
Use it to tint the cards. Add a small legend above the board.
Then add a few quick tests or a console check that runs the function on example
dates around each boundary and show me the results.
```

## Check it yourself

- The seed tasks from M4 should already show at least three states (if their dates are relative to today)
- Edit a task's due date to yesterday → alarm. Then mark it done → neutral
- Edit one to later today → warning

## Ship it

```bash
git add .
git commit -m "due-tint"
git tag due-tint
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: board showing all four states + legend → `docs/screenshots/M08-due.png`
- [ ] Your decisions on the two gaps above, and why
- [ ] How due colour and type colour (M6) sit together on one card
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Everything shows as overdue:** the seed dates are fixed instead of relative to today. Back to the M4 note.
- **Off by an hour:** date-only strings like `2026-10-20` get read as midnight UTC. Tell Claude you're in the UK and ask it to treat due dates as end of day local time (or whatever you prefer).
