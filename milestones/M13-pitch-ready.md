# M13 · Demo + pitch

**Tag:** `pitch-ready` · **Phase 4: Ship** · **Time box:** 45 min

> Demo dataset loaded, pitch rehearsed.

There was no detailed slide for this one. This file is built from the README and PRD §13. The PRD says to write the pitch script in your own voice, so Claude Code's job here is only the demo data and final checks.

## Build

- [ ] **Demo dataset:** the seed tasks tell a story. Real-looking vibecoding tasks, a mix of feature and bug, every column used, every due-date state visible, at least two tasks with a real filled-in Context, every example teammate assigned something
- [ ] **Anchors:** at least the Demo link filled in
- [ ] **Live site:** loads on Vercel without errors
- [ ] **Pitch:** 5 minutes, rehearsed at least once out loud with a timer

## Done when (from PRD §13)

- [ ] The board loads on Vercel without errors
- [ ] The "Copy Context" demo works live
- [ ] 5-minute pitch rehearsed
- [ ] All 12 tags pushed (M1, M3 to M13; M2 skipped). Visible on the portal, if it's still in use
- [ ] Tag `pitch-ready` pushed

## Starter prompt (demo data only)

```
Read @milestones/M13-pitch-ready.md. Update the seed data so first-time visitors
see a realistic demo board: 8 to 10 vibecoding tasks for building this tracker,
mixed feature/bug, all four columns, every due-date state (dates relative to today),
every name in the TEAM constant assigned something, and 2 to 3 tasks with a properly filled-in
context. Use the real context I wrote on my own tasks where you can (I'll paste them).
Then run npm run build and list anything in the console that looks like an error.
```

## Final checks (marker's eye view)

- [ ] Open the **production** Vercel URL in a private/incognito window: no login asked, seed data shows
- [ ] Clear localStorage on the live site, reload: board resets to the demo data
- [ ] Click through every feature once: add, edit, delete, status, hand-off, due colours, context, copy, anchors, your secret sauce
- [ ] Check the browser console for red errors
- [ ] Try it in a second browser (e.g. Chrome and Edge/Safari)

## Pitch prep (yours to write)

A simple shape that fits 5 minutes:
1. The problem (30 s)
2. Live demo, ending on Copy Context → paste into an AI chat (3 min)
3. Your secret sauce (1 min)
4. What's next (30 s)

Have a backup: screenshots or a recording in case the Wi-Fi dies.

## Ship it

```bash
git add .
git commit -m "pitch-ready"
git tag pitch-ready
git push
git push --tags
```

## Capture for your report

- [ ] Final screenshot set: full board, modal, anchors, secret sauce → `docs/screenshots/M13-*.png`
- [ ] Short screen recording of the full flow (backup if the link ever has problems)
- [ ] The live production URL, tested in incognito
- [ ] Feedback from the pitch audience: what they asked, what confused them
- [ ] Check `docs/prompt-log.md` is complete; fill in any empty "your part" fields while you still remember

## After the hackathon

The brief lets you keep refining after the hackathon. If you do, keep using the same loop: milestone-style file, prompt log entry, screenshot, commit. Push a small change or log in to Vercel now and then until your marks are back.
