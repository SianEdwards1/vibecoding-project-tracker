# M7 · Task Owner

**Tag:** `task-owner` · **Phase 3: Build** · **Time box:** 30 min

> Who is doing what?

**Solo build note:** this stays, because the tracker is designed for teams even though you're building it alone. The teammates are the example names from PRD §8. In the demo, you're showing how a team would use it.

## Build

- [ ] Show the assignee's initials / avatar prominently on each card
- [ ] Add a **"Hand off to…"** dropdown that reassigns the task to another teammate
- [ ] Optional: a strip at the top showing what each team member is currently driving

## Done when

- [ ] Every card shows whose task it is at a glance
- [ ] "Hand off to…" reassigns successfully
- [ ] Reassignment is acknowledged visually (e.g. a short toast or highlight)
- [ ] `npm run build` passes
- [ ] Tag `task-owner` pushed

## Starter prompt

```
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

## Check it yourself

- Hand a task from one person to another. Does the avatar change? Did you see the confirmation?
- Refresh. Did the new owner stick?
- If you built the strip: does it update straight away after a hand-off?

## Ship it

```bash
git add .
git commit -m "task-owner"
git tag task-owner
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: cards with avatars → `docs/screenshots/M07-avatars.png`
- [ ] Screenshot: the hand-off confirmation (take it quickly, or ask Claude to make it stay longer while you screenshot) → `docs/screenshots/M07-handoff.png`
- [ ] Why the confirmation looks the way it does (toast vs. highlight vs. something else)
- [ ] If you skipped or built the optional strip, note why
- [ ] Why ownership and hand-off belong in the product even though you built it alone (it's about who the product is for, not who built it)
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Hand-off dropdown also lists the current owner:** decide if that's fine; tell Claude if not.
