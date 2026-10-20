# M6 · Feature vs. bug visual distinction

**Tag:** `tag-style` · **Phase 3: Build** · **Time box:** 25 min

> Visual win. Make the board feel vibecoding-specific.

## Build

- [ ] Tasks tagged "feature" use one accent colour
- [ ] Tasks tagged "bug" use a different accent colour
- [ ] A small icon in the corner of each card
- [ ] The same colour scheme on the board, in the modal, and anywhere else a task is shown

## Done when

- [ ] Feature and bug cards look visibly different
- [ ] Colour and icon are consistent everywhere a task appears
- [ ] `npm run build` passes
- [ ] Tag `tag-style` pushed

## Starter prompt

```
Read @milestones/M06-tag-style.md and the feature/bug tokens in @tailwind.config.js.
Make feature and bug tasks visually distinct using those tokens, with a small icon
in the corner of each card. Put the colour + icon logic in one shared place so the
card, the modal and anything else use exactly the same styling.
Don't add an icon library unless I agree; inline SVG is fine.
Leave room for M8 due-date colours: suggest how type colour and due colour will
both fit on one card without clashing (e.g. one as a border/badge, one as a tint).
```

## Check it yourself

- Can you tell feature from bug without reading any text?
- Squint test, or view it in greyscale (DevTools → Rendering → Emulate vision deficiencies). Does the icon still tell them apart?
- Open the modal for each type. Same colour and icon as the card?

## Ship it

```bash
git add .
git commit -m "tag-style"
git tag tag-style
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: board with both types → `docs/screenshots/M06-types.png`
- [ ] Screenshot: modal showing the type styling → `docs/screenshots/M06-modal.png`
- [ ] Optional: greyscale / colour-blind emulation screenshot
- [ ] Why you used both colour and an icon, and where type colour sits on the card. Your reasoning
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Modal and card colours drift apart:** the logic got copied instead of shared. Ask Claude to pull it into one helper.
