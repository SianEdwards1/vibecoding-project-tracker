# M2 · PRD reviewed: SKIPPED (solo build)

**Tag:** none · **Status:** skipped

M2 was a team exercise (review the PRD together, split milestones between Person A, B and C). You're building alone, so there's nothing to split and no tag to push.

You're building solo, but **the tracker is still for teams**. So the assignee and hand-off features (M4, M5, M7) stay, and they need some example teammates to show off.

## The 10-minute leftover (do this before M4)

- [ ] Copy the updated `PRD.md` from this pack over the one in your repo (it already has the team-only parts removed)
- [ ] §8 **Example team:** pick 3 names (yours plus 2 made-up teammates is fine). These become the only options in the assignee dropdown
- [ ] §11 **Project identity:** project name and a one-sentence tagline. Leave the URL until M4
- [ ] §2 **Target users:** the starter text was written for a different course. Rewrite it in your own words
- [ ] §14 **Changes from the starter PRD:** fill in the "why" column

- [ ] Tidy the files this pack doesn't replace (DESIGN.md and code comments). Paste this into Claude Code:

```
Search DESIGN.md, src/ and tailwind.config.js for anything that assumes a team
build: "Person A/B/C", "parallel to M2", milestone owners, "your team".
List what you find first. Then reword only those lines so they fit a solo build.
Don't change any code behaviour.
```

No tag. Commit it as a normal commit:

```bash
git add .
git commit -m "PRD updated for solo build"
git push
```

## Capture for your report

- [ ] Keep the original starter PRD for reference. It's in your git history; `git show HEAD~1:PRD.md` (or whichever commit) shows the old version
- [ ] The §14 change log is your record of what you changed from the client's original spec and why
