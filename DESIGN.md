# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

Informed but calm understanding what needs to be prioritised whilst still be a supportive tool for a second screen.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- twine.net colour scheme is visually appealing to a technical audience.

Anti-references — what we are explicitly **not** trying to look like:

- Busy, saturated dashboards where every element is loud, so the one urgent thing gets lost.
- Dark "hacker" themes with grey on black text, which is hard to read over a long session.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#0777da` | Header, "+" button, focus rings |
| `brand-accent` | `#0b5cad` | Highlights, hover states, links |
| `surface-page` | `#f8f4ee` | Page background |
| `surface-card` | `#ffffff` | Card background |
| `text-primary` | `#04121f` | Body text |
| `text-muted` | `#5a5758` | Captions, dates, counts |
| `border-subtle` | `#ece7df` | Card and input borders |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#5b4bb5` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#b42318` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | Ink token | Ink hex | When used |
|---|---|---|---|---|
| `due-overdue` | `#fde3e0` | `due-overdue-ink` | `#b42318` | Overdue: past due |
| `due-warning` | `#fdefd0` | `due-warning-ink` | `#8a5a00` | Due soon: less than 3 days left |
| `due-neutral` | `#ece7df` | `due-neutral-ink` | `#5a5758` | Due in 3+ days |
| `due-safe` | `#def4e7` | `due-safe-ink` | `#177a4c` | Done (overrides date), with a tick icon |

Green is kept for Done only, so tasks with plenty of time use the calm grey. A due date with no time counts as due at the end of that day.

### Teammate avatars (M7 `task-owner`)

White initials on a solid circle. Each teammate gets one colour, in `TEAM` order. Chosen to stay clear of the type and due-date colours.

| Token | Hex | Teammate slot |
|---|---|---|
| `avatar-pink` | `#be185d` | 1st |
| `avatar-slate` | `#475569` | 2nd |
| `avatar-cyan` | `#155e75` | 3rd |
| `avatar-orange` | `#c2410c` | 4th |

### Dark mode

Added after M11. Each light token has a `-dark` twin, used with Tailwind `dark:` classes (e.g. `bg-surface-card dark:bg-surface-card-dark`). The page is a dark navy, not black, and the text is a warm off-white, so it stays clear of the grey-on-black anti-reference. Solid buttons (`brand-primary`, `type-bug`) and the avatar colours keep their light values, because their white text already passes AA on them.

| Token | Hex | Contrast |
|---|---|---|
| `surface-page-dark` | `#0f1b2a` | |
| `surface-card-dark` | `#172638` | |
| `text-primary-dark` | `#f1ede6` | 13.1:1 on card |
| `text-muted-dark` | `#b4aea5` | 7.0:1 on card, 5.9:1 on a column |
| `border-subtle-dark` | `#2e4159` | |
| `brand-primary-dark` | `#6db3f8` | 6.9:1 on card (text, icons, focus rings) |
| `brand-accent-dark` | `#9ccbfa` | 9.0:1 on card (links) |
| `type-feature-dark` | `#b3a8f5` | 7.2:1 on card |
| `type-bug-dark` | `#ff9c8f` | 7.6:1 on card |
| `due-overdue-dark` / `due-overdue-ink-dark` | `#4a1f1d` / `#ffb8ae` | 8.5:1 |
| `due-warning-dark` / `due-warning-ink-dark` | `#3d2f0d` / `#f3cf75` | 8.7:1 |
| `due-neutral-dark` / `due-neutral-ink-dark` | `#2e4159` / `#d3cec6` | 6.7:1 |
| `due-safe-dark` / `due-safe-ink-dark` | `#123a2b` / `#86dcac` | 7.7:1 |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Plus Jakarta Sans (semibold) | Open letter shapes and a tall x-height keep headings readable at a glance on a second screen, and semibold gives clear hierarchy without big size jumps. |
| Body | Plus Jakarta Sans (regular) | Using one family for headings and body means one font to load and a consistent reading rhythm, and its distinct letters stay legible at 14 px for low vision and dyslexic readers. |
| Monospace (tags, badges, code) | JetBrains Mono | It clearly separates look-alike characters such as 0/O and 1/l/I, so tags and copied prompt context cannot be misread. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** White `surface-card` on the warm `surface-page` with a 1px border so the edge is visible without relying on shadow, and the due-date tint always comes with a text label ("Overdue", "Due today") so state is never shown by colour alone.
- **Buttons:** Solid `brand-primary` with white text (4.51:1, passes WCAG AA), rounded-md, at least 44 px tall for an easy target, with a visible focus ring for keyboard users.
- **Modal:** Centred, max-w-md, `text-primary` backdrop at 50% opacity, focus moves into the modal when it opens and Escape closes it, so keyboard and screen reader users are never trapped.
- **Empty states:** Dashed border with one short plain sentence, so an empty column is explained in words rather than just looking blank.
- **Drag affordance (if used):** Added in M12. Cards can be dragged to another column with the mouse (browser drag and drop, no library); the card fades while dragged and the column under it gets a `brand-primary` outline. The status dropdown stays as the way to move a task by keyboard or screen reader, where drag and drop often does not work.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | Add task (with a plus icon in place of the "+") |
| Empty column placeholder | Nothing here yet. |
| Toast after "Copy as Prompt Context" | Copied. Paste it into your AI tool. |
| Confirm-delete message | Delete this task? This cannot be undone. |
| Handoff toast (M7 `task-owner`) | Handed off to {name}. |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** Vibecoding Project Tracker
- **Wordmark style:** Just the name in Plus Jakarta Sans semibold at 24 px in `brand-primary`, no icon. At that size it counts as large text, so its 4.11:1 on `surface-page` passes WCAG AA.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- ~~A dark mode toggle. Pick one mode and ship it.~~ Added after M11, see §2 Dark mode.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
