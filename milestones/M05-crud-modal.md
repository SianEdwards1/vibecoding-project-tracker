# M5 · Add / edit / delete tasks via modal ⭐

**Tag:** `crud-modal` · **Phase 3: Build** · **Key milestone** · **Time box:** 45 min

> Make the board editable. Without this, the demo is static.

## Build

- [ ] A **"+" button** opens a modal with every field from the task data model
- [ ] **Clicking a card** opens the same modal in edit mode, pre-filled
- [ ] A **delete button** removes the task
- [ ] A **status dropdown** inside the modal moves tasks between columns (no drag-and-drop yet)
- [ ] Persist everything to localStorage

(The slide says "every field from M3"; it means the data model fields from M4.)

## Done when

- [ ] "+" creates a new task that appears on the board
- [ ] Clicking a card opens an editable form
- [ ] Delete removes the task and the change persists
- [ ] Closing and reopening the browser keeps everything intact
- [ ] `npm run build` passes
- [ ] Tag `crud-modal` pushed

## Starter prompt

```
Read @milestones/M05-crud-modal.md.
Plan a single TaskModal component used for both add and edit.
Fields: title, description, type (feature/bug), status, assignee (dropdown of the
example team names in the TEAM constant only), due date, and created date shown read-only.
"+" opens it empty; clicking a card opens it pre-filled. Include Save, Cancel and Delete.
Status is a dropdown, no drag-and-drop. Save to localStorage via the existing hook.
Escape key and clicking outside should close it without saving.
Explain the plan before building.
```

## Check it yourself

Go through this in order:
1. Add a task → appears in the right column
2. Edit its title → card updates
3. Change status → card moves column
4. Delete it → gone
5. Close the browser fully, reopen → state is how you left it
6. Try saving with an empty title. What happens? Decide what *should* happen

## Ship it

```bash
git add .
git commit -m "crud-modal"
git tag crud-modal
git push
git push --tags
```

## Capture for your report

- [ ] Screenshots: empty add modal, filled edit modal → `docs/screenshots/M05-add.png`, `M05-edit.png`
- [ ] Decisions you made: e.g. delete confirm or not, what happens with an empty title, how the modal closes. Note what you chose and why
- [ ] Prompt log entry
- [ ] Requirement ID(s) this covers

## If you get stuck

- **Edits don't stick after refresh:** the save isn't going through the `useLocalStorage` setter. Ask Claude to check.
- **Clicking the delete button also opens the modal / closes it oddly:** event bubbling. Tell Claude what you clicked and what happened.
