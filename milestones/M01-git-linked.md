# M1 · Fork + dashboard

**Tag:** `git-linked` · **Phase 1: Setup** · **Time box:** 20 min

> Connect your repo to the Hackathon Portal.

No Claude Code needed for this one. It's all clicking.

## Build

- [ ] Register on the Hackathon Portal: [vc-hackathon-hub.vercel.app](https://vc-hackathon-hub.vercel.app) (Login with GitHub)
- [ ] In your portal profile, paste your repo URL into **GitHub Repository** and save. Use your fork's URL (`https://github.com/<you>/<repo>`)
- [ ] Add the webhook that sends commit events to the dashboard. The portal gives you the details; on GitHub it goes in your repo's **Settings → Webhooks → Add webhook**
- [ ] Edit something small in `README.md` (e.g. add your name under the title)

## Done when

- [ ] `git remote -v` shows your username, not the lecturer's
- [ ] Your repo appears on the portal dashboard
- [ ] Tag `git-linked` is pushed and shows on the portal

## Ship it

```bash
git add .
git commit -m "git-linked"
git tag git-linked
git push
git push --tags
```

## Capture for your report

- [ ] Screenshot: your repo on the portal dashboard → `docs/screenshots/M01-portal.png`
- [ ] Note your repo URL somewhere you'll find it later

## If you get stuck

- **"Permission denied" on push:** you're probably pushing to the original repo, not your fork. Check `git remote -v`.
- **Portal doesn't update:** check the webhook in GitHub (Settings → Webhooks). A green tick next to the latest delivery means it's working; a red one shows the error.
- **Git asks for a password:** GitHub needs a personal access token or GitHub Desktop / the `gh` CLI, not your account password.
