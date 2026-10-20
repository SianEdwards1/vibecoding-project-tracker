# M9 · Task Context field ⭐

**Tag:** `task-context` (README says `context`; see the overview) · **Phase 3: Build** · **Key milestone** · **Time box:** 40 min

> The vibecoding differentiator. Copy context, paste into any AI tool, continue vibecoding.

## Build

- [ ] Add a **"Context"** section to the task modal: one Markdown text area
- [ ] Below it, an optional small **"AI tool"** dropdown: Claude, ChatGPT, Cursor, Lovable, Replit, Other
- [ ] Save a `contextUpdatedAt` **timestamp** automatically whenever the field is edited
- [ ] Show a small **"last updated 2 h ago"** hint near the field
- [ ] Pre-fill new tasks with a **placeholder template**, e.g. Background / Constraints / Tried so far / Pick up

Field names from PRD §5: `context`, `contextTool`, `contextUpdatedAt`.

**Stretch:** a Markdown preview pane next to the text area so you see formatting live.

## Done when

- [ ] Context text area visible in the modal, with a clear label
- [ ] Content survives a reload and shows when the task is reopened
- [ ] AI tool dropdown saves to `contextTool`
- [ ] Last-updated message visible next to the field
- [ ] `npm run build` passes
- [ ] Tag pushed

## Starter prompt

```
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

## Check it yourself

- Write some context, save, refresh, reopen. Still there?
- Save the task again without touching the context. Did the "last updated" time change? (It shouldn't)
- Open an old seed task. No crash?

## Use it for real from now on

The README's tip: keep the Context field of your real tasks up to date while you build. By the end you'll have real examples of the tool being used, which is useful evidence and good demo data.

## Ship it

```bash
git add .
git commit -m "task-context"
git tag task-context
git tag context
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: modal with a filled-in context and the last-updated hint → `docs/screenshots/M09-context.png`
- [ ] Why the template has the sections it has (keep them, or change them and say why)
- [ ] The edge case about when the timestamp updates: what you chose
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Old tasks crash the modal:** they don't have the new fields. Ask Claude to default missing fields when loading.
