# M12 · Secret Sauce ⭐

**Tag:** `secret-sauce` (the slide footer says `project-deliverables`, which is a typo) · **Phase 3: Build** · **Key milestone** · **Time box:** 60 min, hard stop

> Make it unique, make it stand out, make it yours.

The PRD says AI can't predict this one; that's the point. Pick the idea yourself. Claude Code helps build it.

## Build

- [ ] One interaction that makes your tracker different. Slide examples:
  - drag cards across the Kanban to place them
  - collapsible content
  - sounds for actions
  - …or your own idea
- [ ] PRD constraint: **must be visible in the demo and must not break anything else**

## Pick it in 10 minutes, not 60

Ask yourself:
1. What annoyed me while using the tracker for real during M4 to M11?
2. Which idea would I actually use for the rest of the module?
3. Can I explain in two sentences why it's there? (Extra features need a reason)
4. Can I build it in under an hour?

If you've got two ideas, pick the smaller one. Write your choice here before prompting:

> My secret sauce: ______________________
> Why: ______________________

## Done when

- [ ] Your feature works and is visible in the demo
- [ ] Everything from M4 to M11 still works (go through their Done lists quickly)
- [ ] `npm run build` passes
- [ ] Tag `secret-sauce` pushed

## Starter prompt

```
Read @milestones/M12-secret-sauce.md. I want to add: [YOUR IDEA].
The reason is: [WHY].
Plan the smallest version that would look good in a demo. List what could break
in the existing features (modal, persistence, copy button, due colours) and how
you'll avoid it. Don't add packages without asking me first.
```

If your idea is drag-and-drop, Claude may suggest a library. Fine to say yes if you agree, but ask it what the library does and why it beats the built-in browser drag events.

## Check it yourself

- Use the feature 5 times in a row. Anything odd?
- Re-run the quick checks from M5 (add, edit, delete, reload), M8 (colours) and M10 (copy)

## Ship it

```bash
git add .
git commit -m "secret-sauce"
git tag secret-sauce
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot or short screen recording of it in action → `docs/screenshots/M12-sauce.png`
- [ ] What it is and why you added it (in your words: the brief expects extra features to be justified)
- [ ] Ideas you dropped and why
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- 60 minutes up and it's not working? `git restore .` and build the smaller version. A small feature that works beats a big one that breaks the demo.
