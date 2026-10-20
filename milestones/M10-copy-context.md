# M10 · "Copy Context" button

**Tag:** `copy-context` (README says `copy-prompt`; see the overview) · **Phase 3: Build** · **Time box:** 30 min

> Click the button, paste into any AI chat. This is the demo's hero moment.

## Build

- [ ] A button labelled **"Copy Context"** on each card and inside the modal
- [ ] Pressing it copies a Markdown block to the clipboard
- [ ] The block includes: title, description, and the full Context field
- [ ] Format it cleanly so it reads as a natural briefing when pasted into an AI chat

**Stretch:** a small "Copied to clipboard!" toast on success.

## Done when

- [ ] Button visible on every card and inside the modal
- [ ] Pressing it copies the Markdown block (check by pasting into a text editor)
- [ ] Pasted text reads cleanly in an AI chat
- [ ] `npm run build` passes
- [ ] Tag pushed

## Before you prompt: decide the format

Paste a draft of what you want the copied text to look like into the prompt. For example (change it to suit you):

```
# Task: {title}
Type: {type} · Status: {status} · Owner: {assignee} · Due: {dueDate}

## Description
{description}

{context}
```

## Starter prompt

```
Read @milestones/M10-copy-context.md.
Write one function buildContextMarkdown(task) that returns this format:
[PASTE YOUR FORMAT HERE]
Skip empty sections rather than printing blank headings.
Add a "Copy Context" button on each card and in the modal that copies it with
navigator.clipboard.writeText. Clicking the button on a card must NOT open the modal.
Show a short "Copied to clipboard!" confirmation. If copying fails, say so.
```

## Check it yourself

- Copy from a card, paste into Notepad / Notes. Does it look right?
- Paste it into an actual AI chat with "help me continue this task". Does the AI understand it without extra explanation? That's the real test
- Click the card button: the modal should not open
- Try it on the live Vercel site too (clipboard needs https, which Vercel has)

## Ship it

```bash
git add .
git commit -m "copy-context"
git tag copy-context
git tag copy-prompt
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: the button on a card and the confirmation → `docs/screenshots/M10-copy.png`
- [ ] Screenshot: the pasted text in an AI chat → `docs/screenshots/M10-pasted.png`
- [ ] Why you chose that format, and anything you changed after testing it in a real AI chat
- [ ] Prompt log entry, requirement ID(s)

## If you get stuck

- **Copy does nothing on some browser:** check the console. Clipboard access needs https or localhost, and a user click.
