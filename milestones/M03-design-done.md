# M3 · Design system

**Tag:** `design-done` · **Phase 2: Plan** · **Time box:** 40 min

> Pick the visual identity before you build, so the board starts with your palette.

(The slide says Person B does this in parallel with M2. Solo, you just do it before M4.)

The PRD says design taste is yours, not the model's. Make the choices yourself; use Claude Code (or Google Stitch, which the slide suggests) to try them out and to paste values in.

## Build

Fill in `DESIGN.md`:

- [ ] **#1 Mood:** one sentence
- [ ] **#2 Colours:** brand, surface, feature, bug, and four due-date states (calm, warning, alarm, done/neutral)
- [ ] **#3 Typography:** heading font, body font, monospace font
- [ ] **#4 Component principles:** 3 to 4 sentences
- [ ] **#5 Microcopy:** a few lines (button labels, empty states, confirmations)
- [ ] Paste the hex values into `tailwind.config.js` so everyone can use them as tokens

Tips from the slide: the DESIGN.md tutorial from class, start from the draft or from scratch, use your AI tool or Google Stitch.

## Done when

- [ ] Every section of DESIGN.md filled in
- [ ] Colours are in `tailwind.config.js`
- [ ] `npm run dev` still runs with no errors
- [ ] Tag `design-done` pushed

## Starter prompt (after you've chosen your colours and fonts)

```
Read @DESIGN.md and @tailwind.config.js. I've chosen the colours and fonts in DESIGN.md.
Add them to tailwind.config.js as named tokens (e.g. brand, surface, feature, bug,
due-calm, due-warning, due-alarm, due-done). If the fonts need loading, add them in
index.html. Then show me a throwaway test block in App.jsx with one swatch per token
so I can see them, and tell me how to remove it after.
Also check each due-date colour against the text colour for contrast and tell me the ratios.
```

## Check it yourself

- Look at the swatches. Can you tell the four due-date states apart at a glance?
- Do feature and bug look different enough from the due-date colours? (M6 and M8 both colour the cards, so they'll appear together)

## Ship it

```bash
git add .
git commit -m "design-done"
git tag design-done
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot of the swatches / DESIGN.md → `docs/screenshots/M03-design.png`
- [ ] For each colour and font: why you picked it (your reasons, in your words)
- [ ] Any alternatives you tried and dropped
- [ ] Contrast ratios if you checked them
- [ ] If you used Stitch or another tool, note it in `docs/prompt-log.md`

## If you get stuck

- Choice paralysis on colours: pick the brand colour first, then everything else just has to sit well next to it.
- Fonts not showing: check they're actually loaded (Google Fonts link in `index.html`) and named the same way in `tailwind.config.js`.
