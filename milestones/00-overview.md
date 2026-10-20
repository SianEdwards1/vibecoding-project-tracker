# Milestone overview

Tick these off as you push each tag. Check what you've pushed with `git tag`.

You're building this alone, so there are 12 milestones (M2 is skipped). The tags are kept in case the portal is still checked; they do no harm if it isn't.

| | # | Tag | What | Phase | Key | File |
|---|---|---|---|---|---|---|
| [ ] | M1 | `git-linked` | Fork + portal dashboard | 1 Setup | | M01-git-linked.md |
| n/a | M2 | ~~`prd-done`~~ | Skipped (solo build). Do the 10-min leftover before M4 | 2 Plan | | M02-prd-done.md |
| [ ] | M3 | `design-done` | Design system | 2 Plan | | M03-design-done.md |
| [ ] | M4 | `data-model` | Board + tasks | 3 Build | ⭐ | M04-data-model.md |
| [ ] | M5 | `crud-modal` | Add / edit / delete modal | 3 Build | ⭐ | M05-crud-modal.md |
| [ ] | M6 | `tag-style` | Feature / bug colours | 3 Build | | M06-tag-style.md |
| [ ] | M7 | `task-owner` | Driver + handoff | 3 Build | | M07-task-owner.md |
| [ ] | M8 | `due-tint` | Due-date colours | 3 Build | | M08-due-tint.md |
| [ ] | M9 | `task-context` | Task context field | 3 Build | ⭐ | M09-task-context.md |
| [ ] | M10 | `copy-context` | Copy-to-prompt button | 3 Build | | M10-copy-context.md |
| [ ] | M11 | `project-deliverables` | Deliverable anchors | 3 Build | ⭐ | M11-project-deliverables.md |
| [ ] | M12 | `secret-sauce` | Your feature | 3 Build | ⭐ | M12-secret-sauce.md |
| [ ] | M13 | `pitch-ready` | Demo + pitch | 4 Ship | | M13-pitch-ready.md |

## Order and dependencies

- Solo build: you do every milestone, in order. The tracker is still designed for teams, so the team features stay, using example teammates (see M02 file).
- Do the M2 leftover (PRD tidy-up, 10 min) and M3 before starting M4.
- **M4 and M5 must be done before M6, M7, M8 and M11.** Everything hangs off the board and the modal.
- M10 needs M9.
- M12 last before the pitch, because it must not break anything else.

## ⚠ Tag names don't match between the slides and the starter repo

| Milestone | Slides say | README says | PRD table says |
|---|---|---|---|
| M9 | `task-context` | `context` | `context` |
| M10 | `copy-context` | `copy-prompt` | `copy-prompt` |
| M11 | `project-deliverables` | `project-deliverables` | `anchors` |
| M12 | slide footer says `project-deliverables` (typo) | `secret-sauce` | `secret-sauce` |

These files use the slide names. Ask in the hackathon chat which ones the portal checks. Until you know, tag the same commit with both names. It's harmless:

```bash
git tag task-context
git tag context
git push --tags
```

## Commit, tag, push (the full version)

The slides only show a commit; the README adds a tag. Do both, and push the branch as well as the tags. `git push --tags` on its own doesn't update `main`, so Vercel wouldn't redeploy.

```bash
git add .
git commit -m "data-model"
git tag data-model
git push
git push --tags
```

Made a mistake in a tag before pushing it? `git tag -d data-model` deletes it locally, then tag again.
