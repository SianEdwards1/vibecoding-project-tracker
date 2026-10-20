# Vibecoding Project Tracker

Uni prototype (individual assessment). Kanban board for vibecoding tasks, built milestone by milestone.
Built solo, but the product is for vibecoding teams. Teammate names are example data from PRD.md section 8. The TEAM constant is the starting team only: since M7 the team can be edited in the Team panel and is saved in localStorage (`vibetracker.team`).
M2 is skipped. Ignore any "Person A/B/C" or team-split instructions in the starter files.
Stack: Vite + React + Tailwind. Data in localStorage via the existing `useLocalStorage` hook. Deployed on Vercel from `main`.

## Commands
- `npm install`: install dependencies
- `npm run dev`: dev server (usually http://localhost:5173)
- `npm run build`: production build. Must pass before a milestone counts as done

## Where things are
- `milestones/`: one spec file per milestone. The milestone file I point you to is the spec for that session
- `PRD.md` section 5: the Task and Anchor data model. Don't change field names or types without asking me
- `DESIGN.md` and `tailwind.config.js`: colour and type tokens. Use the tokens, don't hard-code new hex values
- `docs/prompt-log.md`: prompt log

## Rules
- Work on one milestone at a time. Don't build ahead.
- IMPORTANT: no backend, no auth, no new npm packages unless I agree first. If you think one is needed, explain why and wait.
- I'm new to React. After each change, explain in 3 to 5 plain sentences what changed and in which files.
- Before saying a milestone is done: run `npm run build`, show the result, then go through the milestone's "Done when" list and tell me which items I need to check in the browser myself.
- Seed/mock tasks must use due dates relative to today (computed at first load), so the due-date colours still show correctly whenever the app is opened.
- Don't commit, tag or push unless I ask.
- Use UK English in UI text. Plain wording, no em dashes.

## Prompt log
When a milestone is finished, append an entry to `docs/prompt-log.md` using the template in that file:
date, milestone, my prompts word for word, files changed.
Leave the "What I checked", "What I changed or rejected" and "Notes for report" fields empty. I fill those in.
