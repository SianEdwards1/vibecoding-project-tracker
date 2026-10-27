import { useState, useEffect, useRef } from 'react';
import { getDueState, dueLabel, dueGroup } from './dueState';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-context  : a "Copy Context" button that copies the task + context as Markdown.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD', or 'YYYY-MM-DDTHH:mm' with a time
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 * @property {string} context          M9: Markdown briefing for the next AI tool or teammate
 * @property {string|null} contextTool M9: one of CONTEXT_TOOLS, or null
 * @property {string|null} contextUpdatedAt M9: ISO timestamp, set only when the context text changes
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Example team names (PRD §8). This is only the starting team: the Team panel (M7)
// can add and remove people, and the current team is saved in localStorage.
export const TEAM = ['Sian Edwards', 'Ela Morgan', 'Bingo Edwards', 'Bonnie Morgan'];

// Most people the Team panel allows. Avatar colours repeat after the fourth.
const MAX_TEAM_SIZE = 6;

// Colour and icon for each task type (DESIGN.md §2, M6). The card, the modal and
// anything else that shows a type read from here, so they always match.
// Class names are written out in full because Tailwind only builds classes it can find in the code.
export const TASK_TYPES = {
  feature: {
    label: 'Feature',
    textClass: 'text-type-feature dark:text-type-feature-dark',
    borderClass: 'border-type-feature dark:border-type-feature-dark',
    stripeClass: 'border-l-type-feature dark:border-l-type-feature-dark',
    topStripeClass: 'border-t-type-feature dark:border-t-type-feature-dark',
    selectedClass: 'border-type-feature dark:border-type-feature-dark bg-type-feature/10 dark:bg-type-feature-dark/10 text-type-feature dark:text-type-feature-dark',
    // A four-point sparkle: something new.
    icon: <path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z" />,
  },
  bug: {
    label: 'Bug',
    textClass: 'text-type-bug dark:text-type-bug-dark',
    borderClass: 'border-type-bug dark:border-type-bug-dark',
    stripeClass: 'border-l-type-bug dark:border-l-type-bug-dark',
    topStripeClass: 'border-t-type-bug dark:border-t-type-bug-dark',
    selectedClass: 'border-type-bug dark:border-type-bug-dark bg-type-bug/10 dark:bg-type-bug-dark/10 text-type-bug dark:text-type-bug-dark',
    // A bug: body, head and legs.
    icon: (
      <>
        <path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3 3 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
      </>
    ),
  },
};

// The four final-project deliverables, in display order (PRD §5 Anchor, M11).
// Use these IDs everywhere. Each starts with no link (url: null).
export const ANCHORS = [
  { id: 'presentation',  label: 'Presentation',  url: null },
  { id: 'demo',          label: 'Demo',          url: null },
  { id: 'report',        label: 'Report',        url: null },
  { id: 'documentation', label: 'Documentation', url: null },
];

// True if the text is a full web link starting with http:// or https://.
// Anything else (e.g. 'hello' or 'javascript:...') is refused, so every saved link is safe to click.
function isValidUrl(text) {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false; // new URL() throws if the text is not a link at all
  }
}

// The AI tools a task's context can be written for (PRD §5, M9).
export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

// Where "Open in [tool]" goes for each AI tool. Tools with a `promptUrl` take the
// context in the link. The others only open `url`. To add a tool, add a line here.
const AI_TOOL_LINKS = {
  Claude: { url: 'https://claude.ai/new', promptUrl: 'https://claude.ai/new?q=' },
  ChatGPT: { url: 'https://chatgpt.com/', promptUrl: 'https://chatgpt.com/?q=' },
  Cursor: { url: 'https://cursor.com/', promptUrl: 'https://cursor.com/link/prompt?text=' },
  Lovable: { url: 'https://lovable.dev/' },
  Replit: { url: 'https://replit.com/' },
};

// Longer links can be cut off by browsers or the tool, so past this the tool opens without the text.
const MAX_LINK_LENGTH = 7000;

// The link for "Open in [tool]", or null if the tool has no link (Other or None).
// `tooLong` is true when the context did not fit in the link.
function aiToolLink(tool, context) {
  const link = AI_TOOL_LINKS[tool];
  if (!link) return null;
  if (!link.promptUrl) return { href: link.url, tooLong: false };
  const fullUrl = link.promptUrl + encodeURIComponent(context);
  return fullUrl.length > MAX_LINK_LENGTH
    ? { href: link.url, tooLong: true }
    : { href: fullUrl, tooLong: false };
}

// The starting text for a new task's Context field.
const CONTEXT_TEMPLATE = '## Background\n\n## Constraints\n\n## Tried so far\n\n## Pick up\n';

// The Markdown briefing that "Copy Context" and "Open in [tool]" send (M10).
// Empty parts (no owner, no due date, no description, no context) are left out.
// The context is added as written, since it has its own headings from the template.
export function buildContextMarkdown(task) {
  const details = [
    `Type: ${TASK_TYPES[task.type]?.label ?? task.type}`,
    `Status: ${STAGES.find((stage) => stage.id === task.status)?.label ?? task.status}`,
  ];
  if (task.assignee) details.push(`Owner: ${task.assignee}`);
  if (task.dueDate) {
    const [day, time] = task.dueDate.split('T');
    details.push(`Due: ${formatDate(day)}${time ? ` at ${time}` : ''}`);
  }

  const parts = [`# Task: ${task.title.trim()}\n${details.join(' · ')}`];
  const description = task.description?.trim();
  if (description) parts.push(`## Description\n${description}`);
  const context = task.context?.trim();
  if (context) parts.push(context);
  return parts.join('\n\n') + '\n';
}

// Tasks saved before M9 have no context fields. These defaults fill them in
// when a task is opened, so old tasks still work.
const CONTEXT_DEFAULTS = { context: '', contextTool: null, contextUpdatedAt: null };

// types holds TASK_TYPES ids ('feature', 'bug').
// due holds DUE_STATES ids ('alarm', 'warning', 'calm', 'neutral'), the same states as the
// chips on the cards, picked from the clickable due-date key.
const NO_FILTERS = { people: [], types: [], due: [], tools: [] };

function isFiltering(filters) {
  return (
    filters.people.length > 0 ||
    filters.types.length > 0 ||
    filters.due.length > 0 ||
    filters.tools.length > 0
  );
}

// The chip a task shows on its card, as a DUE_STATES id, or null for no chip.
// getDueState() also says 'neutral' for an open task with no date, but those have no
// chip, so they only count as 'neutral' (Done) when they really are done.
function chipState(task, now) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;
  return getDueState(task, now);
}

// True if the task passes every filter that is switched on (they combine with AND).
// Inside one filter, any of the picked options will do, e.g. "Sian or Ela".
function matchesFilters(task, filters, now) {
  if (filters.people.length > 0 && !filters.people.includes(task.assignee)) return false;
  if (filters.types.length > 0 && !filters.types.includes(task.type)) return false;
  if (filters.tools.length > 0 && !filters.tools.includes(task.contextTool)) return false;
  if (filters.due.length > 0 && !filters.due.includes(chipState(task, now))) return false;
  return true;
}

// Colour, icon and legend text for each due state (DESIGN.md §2, M8), in legend order.
// getDueState() in dueState.js picks the state. Green is kept for Done only,
// so "Due later" (3 or more days left) uses the grey neutral tokens.
// Class names are written out in full for Tailwind.
const CLOCK_ICON = (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
// A tick (Lucide check), for Done and for a filter that is switched on.
const CHECK_ICON = <path d="M20 6 9 17l-5-5" />;
const DUE_STATES = {
  alarm: {
    meaning: 'Overdue',
    chipClass: 'border-due-overdue-ink/40 dark:border-due-overdue-ink-dark/40 bg-due-overdue dark:bg-due-overdue-dark text-due-overdue-ink dark:text-due-overdue-ink-dark',
    icon: CLOCK_ICON,
  },
  warning: {
    meaning: 'Due soon',
    chipClass: 'border-due-warning-ink/40 dark:border-due-warning-ink-dark/40 bg-due-warning dark:bg-due-warning-dark text-due-warning-ink dark:text-due-warning-ink-dark',
    icon: CLOCK_ICON,
  },
  calm: {
    meaning: 'Due later',
    chipClass: 'border-due-neutral-ink/40 dark:border-due-neutral-ink-dark/40 bg-due-neutral dark:bg-due-neutral-dark text-due-neutral-ink dark:text-due-neutral-ink-dark',
    icon: CLOCK_ICON,
  },
  neutral: {
    meaning: 'Done',
    chipClass: 'border-due-safe-ink/40 dark:border-due-safe-ink-dark/40 bg-due-safe dark:bg-due-safe-dark text-due-safe-ink dark:text-due-safe-ink-dark',
    // A tick, so Done is not told apart by colour alone.
    icon: CHECK_ICON,
  },
};

// Avatar colours (DESIGN.md §2, M7). Written out in full so Tailwind builds them.
const AVATAR_COLOURS = {
  pink: 'bg-avatar-pink',
  slate: 'bg-avatar-slate',
  cyan: 'bg-avatar-cyan',
  orange: 'bg-avatar-orange',
};

// The starting team, each person with a colour in order.
// Every member is saved as { name, colour, role, password }, so their colour stays the same
// even when someone else is added or removed. The first person (Sian) is the Team Leader.
function makeStartingTeam() {
  const colours = Object.keys(AVATAR_COLOURS);
  return TEAM.map((name, index) => ({
    name,
    colour: colours[index % colours.length],
    role: index === 0 ? 'leader' : 'member',
    password: DEMO_PASSWORD,
  }));
}

// Prototype login. Every teammate is an account, and every password is "password".
// This is not real security: the passwords sit in localStorage as plain text.
const ROLES = { leader: 'Team Leader', member: 'Team Member' };
const DEMO_PASSWORD = 'password';

// A teammate's role. Teams saved before the login have no roles, so the first
// person on the starting team is the leader and everyone else is a member.
function roleOf(member) {
  return member.role ?? (member.name === TEAM[0] ? 'leader' : 'member');
}

// The teammate a login matches, or null. The name can be the full name or just the
// first name (e.g. "Sian"), in any case. A first name two people share only works in full.
function findAccount(team, name, password) {
  const typed = name.trim().toLowerCase();
  const fullMatch = team.find((member) => member.name.toLowerCase() === typed);
  const firstMatches = team.filter((member) => member.name.split(' ')[0].toLowerCase() === typed);
  const member = fullMatch ?? (firstMatches.length === 1 ? firstMatches[0] : null);
  return member && password === (member.password ?? DEMO_PASSWORD) ? member : null;
}

// The colour for a new member: whichever colour fewest people already have.
function nextAvatarColour(team) {
  const colours = Object.keys(AVATAR_COLOURS);
  const timesUsed = (colour) => team.filter((member) => member.colour === colour).length;
  return colours.reduce((best, colour) => (timesUsed(colour) < timesUsed(best) ? colour : best));
}

// A teammate's avatar colour class. Grey if the name is not on the team.
function avatarColour(team, name) {
  const member = team.find((person) => person.name === name);
  return member ? AVATAR_COLOURS[member.colour] : 'bg-text-muted';
}

// 'Sian Edwards' -> 'SE'
function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

// The styling for a task's type. Falls back to feature if the type is ever missing.
function taskTypeStyle(type) {
  return TASK_TYPES[type] ?? TASK_TYPES.feature;
}

// Formats a Date as 'YYYY-MM-DD' in local time.
// (toISOString() uses UTC, which can give the wrong day near midnight.)
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Today's date shifted by a number of days, as 'YYYY-MM-DD'.
function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

// An ISO timestamp a number of hours before now, for when a seed context was last updated.
function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

// Mock tasks for first load. Dates are relative to today so the
// due-date colours (M8) still make sense whenever the app is opened.
// Between them they cover every column, every due state and due-date filter,
// every teammate in TEAM and most AI tools, so every feature has something to show:
//   Overdue: seed-3, seed-5 · Today: seed-2 · This week: seed-1, seed-6, seed-10
//   Later: seed-7 · No date: seed-8 · Done: seed-4, seed-9
//   Most open tasks: Bingo (3) · Most used tool: Claude (3)
function makeSeedTasks() {
  return [
    {
      id: 'seed-1',
      title: 'Build the Anchor Board',
      description: 'Four pinned slots for the final deliverables.',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[2],
      dueDate: daysFromToday(5),
      createdDate: daysFromToday(-2),
      ...CONTEXT_DEFAULTS,
      contextTool: 'Lovable',
    },
    {
      id: 'seed-2',
      title: 'Add the task modal',
      description: 'One modal for adding and editing tasks.',
      type: 'feature',
      status: 'in-progress',
      assignee: TEAM[0],
      dueDate: daysFromToday(0),
      createdDate: daysFromToday(-3),
      // An example of a filled-in context, last updated 2 hours before first load.
      context:
        '## Background\nOne modal for adding and editing tasks, opened from "+ Add task" or a card.\n\n' +
        '## Constraints\nReact + Tailwind only. Use the DESIGN.md tokens. No new packages.\n\n' +
        '## Tried so far\nAdd works. Edit opens the right task but Cancel still saves changes.\n\n' +
        '## Pick up\nMake the modal edit a draft copy, so nothing changes until Save is pressed.\n',
      contextTool: 'Claude',
      contextUpdatedAt: hoursAgo(2),
    },
    {
      id: 'seed-3',
      title: 'Fix due date showing the wrong day',
      description: 'Dates near midnight show as the day before.',
      type: 'bug',
      status: 'review',
      assignee: TEAM[1],
      dueDate: daysFromToday(-1),
      createdDate: daysFromToday(-4),
      context:
        '## Background\nA task due on the 20th shows "Due 19 October" for anyone in the UK after 11pm.\n\n' +
        '## Constraints\nDates are saved as plain YYYY-MM-DD strings (PRD section 5). Don\'t change the format.\n\n' +
        '## Tried so far\nFound it: the date is made with toISOString(), which uses UTC, not local time.\n\n' +
        '## Pick up\nCheck the fix with a due date of today at 23:30, then move this to Done.\n',
      contextTool: 'ChatGPT',
      contextUpdatedAt: hoursAgo(26),
    },
    {
      id: 'seed-4',
      title: 'Set up Vite and Tailwind',
      description: 'Project scaffold with the design tokens added.',
      type: 'feature',
      status: 'done',
      assignee: TEAM[3],
      dueDate: daysFromToday(-3),
      createdDate: daysFromToday(-6),
      ...CONTEXT_DEFAULTS,
      contextTool: 'Cursor',
    },
    {
      id: 'seed-5',
      title: 'Copy Context does nothing in Safari',
      description: 'No toast and nothing on the clipboard when pressed on an iPad.',
      type: 'bug',
      status: 'todo',
      assignee: TEAM[3],
      dueDate: daysFromToday(-2),
      createdDate: daysFromToday(-5),
      context:
        '## Background\nCopy Context works in Chrome and Edge. In Safari on iPad nothing happens at all.\n\n' +
        '## Constraints\nNo new packages. The clipboard only works on https or localhost.\n\n' +
        '## Tried so far\nTested on the live Vercel link, so it is https. No error shows in the console.\n\n' +
        '## Pick up\nCheck whether Safari needs the copy to happen straight from the click, with no await before it.\n',
      contextTool: 'Claude',
      contextUpdatedAt: hoursAgo(50),
    },
    {
      id: 'seed-6',
      title: 'Add dark mode colour tokens',
      description: 'A dark version of every DESIGN.md colour that still passes WCAG AA.',
      type: 'feature',
      status: 'in-progress',
      assignee: TEAM[2],
      dueDate: daysFromToday(2),
      createdDate: daysFromToday(-1),
      ...CONTEXT_DEFAULTS,
      contextTool: 'Cursor',
    },
    {
      id: 'seed-7',
      title: 'Write the 5-minute pitch script',
      description: 'Problem, live demo ending on Copy Context, secret sauce, what is next.',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[2],
      dueDate: daysFromToday(12),
      createdDate: daysFromToday(-1),
      ...CONTEXT_DEFAULTS,
    },
    {
      id: 'seed-8',
      title: 'Toast shows behind the modal',
      description: 'The "Copied" message is hidden when Copy Context is pressed in the modal.',
      type: 'bug',
      status: 'todo',
      assignee: TEAM[0],
      dueDate: null,
      createdDate: daysFromToday(-1),
      ...CONTEXT_DEFAULTS,
      contextTool: 'Replit',
    },
    {
      id: 'seed-9',
      title: 'Hand off list shows the current owner',
      description: 'You could hand a task off to the person who already has it.',
      type: 'bug',
      status: 'done',
      assignee: TEAM[1],
      dueDate: daysFromToday(-1),
      createdDate: daysFromToday(-4),
      ...CONTEXT_DEFAULTS,
      contextTool: 'ChatGPT',
    },
    {
      id: 'seed-10',
      title: 'Stats panel bar charts',
      description: 'Small bar charts for AI tools, due dates and open tasks. No chart library.',
      type: 'feature',
      status: 'review',
      assignee: TEAM[3],
      dueDate: daysFromToday(1),
      createdDate: daysFromToday(-2),
      ...CONTEXT_DEFAULTS,
      contextTool: 'Claude',
    },
  ];
}

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

// Light or dark mode. Follows the computer's setting until the header toggle is used,
// then remembers that choice. Adds or removes the "dark" class on <html>, which
// switches on every dark: class. index.html runs the same rule before the page draws.
function useTheme() {
  // 'light', 'dark', or null for "no choice made yet, follow the system".
  const [chosen, setChosen] = useLocalStorage('vibetracker.theme', null);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Keeps up if the system setting changes while the app is open.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const theme = chosen ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return [theme, setChosen];
}

// Everything a keyboard user can Tab to.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

// Keeps keyboard focus inside a modal while it is open (DESIGN.md §4): Tab from the last
// control goes back to the first, and Shift+Tab from the first goes to the last.
// When the modal closes, focus goes back to whatever opened it (e.g. the card or button).
function useFocusTrap(dialogRef) {
  // Read while the modal is first drawn, before autoFocus moves focus into it.
  const [opener] = useState(() => document.activeElement);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Tab' || !dialogRef.current) return;
      // Only visible controls. Hidden radio buttons are skipped as Tab skips them anyway.
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.getClientRects().length > 0 && !element.classList.contains('sr-only')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = dialogRef.current.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Waits a moment and only acts if the modal really has gone. (In development React
      // runs this cleanup once straight after opening as a test, with the modal still there.)
      // Skipped if what opened it has gone too, e.g. the card of a task that was just deleted.
      setTimeout(() => {
        if (!dialogRef.current && opener?.isConnected) opener.focus();
      });
    };
  }, [dialogRef, opener]);
}

export default function App() {
  const [theme, setTheme] = useTheme();

  // The seed is only used when nothing is saved in the browser yet.
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', makeSeedTasks());

  // The current team, as a list of { name, colour }.
  const [team, setTeam] = useLocalStorage('vibetracker.team', makeStartingTeam());

  // The name of whoever is logged in, or null. Saved, so a refresh keeps them logged in.
  // If their account has since been removed, they count as logged out.
  const [userName, setUserName] = useLocalStorage('vibetracker.user', null);
  const currentUser = team.find((member) => member.name === userName) ?? null;
  const isLeader = currentUser !== null && roleOf(currentUser) === 'leader';

  // The task open in the modal, or null when the modal is closed.
  const [editing, setEditing] = useState(null);

  // True while the Team panel is open.
  const [showingTeam, setShowingTeam] = useState(false);

  // True while the Stats panel is open.
  const [showingStats, setShowingStats] = useState(false);

  // The current time, refreshed every minute so the due chips update on their own.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // A new teammate gets a Team Member account with the demo password.
  // Only the leader can add or remove people, and no one can remove themselves.
  function addTeammate(name) {
    if (!isLeader) return;
    setTeam([
      ...team,
      { name, colour: nextAvatarColour(team), role: 'member', password: DEMO_PASSWORD },
    ]);
  }

  function removeTeammate(name) {
    if (!isLeader || name === userName) return;
    setTeam(team.filter((member) => member.name !== name));
    // Their filter chip goes too, so it can't be left switched on with no way to turn it off.
    setFilters({ ...filters, people: filters.people.filter((person) => person !== name) });
  }

  // The filter bar (M12). Not saved, so the board shows everything again after a reload.
  // people and tools are lists (empty = no filter). due is one DUE_FILTERS id, or null.
  const [filters, setFilters] = useState(NO_FILTERS);
  const filtering = isFiltering(filters);
  const visibleTasks = tasks.filter((task) => matchesFilters(task, filters, now));

  // The STAGES ids of the collapsed columns (M12). Saved, so they stay collapsed after a reload.
  const [collapsedColumns, setCollapsedColumns] = useLocalStorage('vibetracker.collapsed', []);

  function toggleColumn(id) {
    setCollapsedColumns(
      collapsedColumns.includes(id)
        ? collapsedColumns.filter((collapsed) => collapsed !== id)
        : [...collapsedColumns, id]
    );
  }

  // Opens the modal with a blank task. It is only added to the board on Save.
  function openNewTask() {
    setEditing({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: currentUser.name,
      dueDate: null,
      createdDate: daysFromToday(0),
      ...CONTEXT_DEFAULTS,
      context: CONTEXT_TEMPLATE,
    });
  }

  // Replaces the task if it already exists, otherwise adds it.
  function saveTask(saved) {
    const exists = tasks.some((task) => task.id === saved.id);
    setTasks(
      exists
        ? tasks.map((task) => (task.id === saved.id ? saved : task))
        : [...tasks, saved]
    );
    setEditing(null);
  }

  // Drag and drop (M12): a card dropped on a column takes that column's status.
  // The toast confirms it, and screen readers read it out.
  function moveTask(id, status) {
    const task = tasks.find((saved) => saved.id === id);
    if (!task || task.status === status) return;
    setTasks(tasks.map((saved) => (saved.id === id ? { ...saved, status } : saved)));
    showToast(`Moved to ${STAGES.find((stage) => stage.id === status).label}.`);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    setEditing(null);
  }

  // The message at the bottom of the screen (hand-offs and copying). `visible` is kept
  // separate from `message` so the text stays put while it fades out. `count` restarts
  // the timer if two messages come close together.
  const [toast, setToast] = useState({ message: '', visible: false, count: 0 });

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.count]);

  function showToast(message) {
    setToast((current) => ({ message, visible: true, count: current.count + 1 }));
  }

  // Saves the task with its new owner, then shows the confirmation.
  function handOffTask(saved) {
    saveTask(saved);
    showToast(`Handed off to ${saved.assignee}.`);
  }

  // Copies the task's briefing (M10). The clipboard needs https or localhost,
  // and the browser can refuse, so a failure shows its own message.
  async function copyContext(task) {
    try {
      await navigator.clipboard.writeText(buildContextMarkdown(task));
      showToast('Copied to clipboard!');
    } catch {
      showToast('Could not copy to the clipboard. Please try again.');
    }
  }

  // The deliverable links (M11). Saved under their own key, so they never touch the tasks.
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', ANCHORS);

  // Sets one anchor's link. A url of null clears it. Only the leader can change links.
  function saveAnchorUrl(id, url) {
    if (!isLeader) return;
    setAnchors(
      ANCHORS.map((anchor) => ({
        ...anchor,
        url: anchor.id === id ? url : (anchors.find((saved) => saved.id === anchor.id)?.url ?? null),
      }))
    );
  }

  // Back to the login screen, with nothing left open or filtered for the next person.
  function logOut() {
    setUserName(null);
    setEditing(null);
    setShowingTeam(false);
    setShowingStats(false);
    setFilters(NO_FILTERS);
  }

  // No one logged in: the login screen instead of the board. This comes after all the
  // hooks above, because React needs every hook to run on every render.
  if (!currentUser) {
    return <LoginScreen team={team} onLogIn={(member) => setUserName(member.name)} />;
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-primary dark:text-brand-primary-dark">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {/* Replace this line with your team name from PRD §11. */}
            Team starter
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Who is logged in. */}
          <div className="flex items-center gap-2 pr-2">
            <Avatar name={currentUser.name} team={team} />
            <span className="text-sm leading-tight">
              <span className="sr-only">Logged in as </span>
              <span className="block font-medium">{currentUser.name}</span>
              <span className="block text-xs text-text-muted dark:text-text-muted-dark">
                {ROLES[roleOf(currentUser)]}
              </span>
            </span>
          </div>
          {/* Icon-only, so the label says what pressing it does and the tooltip shows the same words. */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`${secondaryButtonClass} inline-flex w-11 items-center justify-center px-0`}
          >
            <Icon className="h-5 w-5">{theme === 'dark' ? SUN_ICON : MOON_ICON}</Icon>
          </button>
          <button
            type="button"
            onClick={() => setShowingStats(true)}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{CHART_ICON}</Icon>
            Stats
          </button>
          <button
            type="button"
            onClick={() => setShowingTeam(true)}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{USERS_ICON}</Icon>
            Team ({team.length})
          </button>
          {/* The plus icon takes the place of the "+" in DESIGN.md's "+ Add task". */}
          <button
            type="button"
            onClick={openNewTask}
            className={`${primaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{PLUS_ICON}</Icon>
            Add task
          </button>
          <button
            type="button"
            onClick={logOut}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{LOG_OUT_ICON}</Icon>
            Log out
          </button>
        </div>
      </header>

      <AnchorBoard anchors={anchors} canEdit={isLeader} onSave={saveAnchorUrl} />

      <FilterBar
        filters={filters}
        team={team}
        shown={visibleTasks.length}
        total={tasks.length}
        onChange={setFilters}
      />

      {/* A flex row instead of a grid, so open columns share the space a collapsed strip leaves. */}
      <main className="flex gap-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            label={stage.label}
            tasks={visibleTasks.filter((task) => task.status === stage.id)}
            collapsed={collapsedColumns.includes(stage.id)}
            onToggleCollapsed={() => toggleColumn(stage.id)}
            onDropTask={(id) => moveTask(id, stage.id)}
            onMoveTask={moveTask}
            filtering={filtering}
            team={team}
            now={now}
            onOpen={setEditing}
            onCopy={copyContext}
          />
        ))}
      </main>

      {editing && (
        <TaskModal
          // A new key per task resets the modal's draft when a different task is opened.
          key={editing.id}
          task={editing}
          isNew={!tasks.some((task) => task.id === editing.id)}
          team={team}
          now={now}
          onSave={saveTask}
          onHandOff={handOffTask}
          onCopy={copyContext}
          onDelete={deleteTask}
          onClose={() => setEditing(null)}
        />
      )}

      {showingTeam && (
        <TeamModal
          team={team}
          tasks={tasks}
          canManage={isLeader}
          currentUserName={currentUser.name}
          onAdd={addTeammate}
          onRemove={removeTeammate}
          onClose={() => setShowingTeam(false)}
        />
      )}

      {showingStats && (
        <StatsModal
          // The filtered tasks, so the stats always describe what the board is showing.
          tasks={visibleTasks}
          total={tasks.length}
          filtering={filtering}
          team={team}
          now={now}
          onClose={() => setShowingStats(false)}
        />
      )}

      {/* Always on the page (just invisible) so screen readers announce new messages. */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-text-primary px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-text-primary-dark dark:text-text-primary transition-opacity duration-200 ${
          toast.visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toast.message}
      </div>
    </div>
  );
}

// Shared Tailwind classes for buttons and form fields (DESIGN.md §4).
// Blue text turns brand-accent on hover, because brand-primary on its own hover tint
// is under 4.5:1. Placeholders use text-muted, as the browser's grey is too faint.
const buttonBaseClass =
  'min-h-11 rounded-md px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-page-dark';
const primaryButtonClass = `${buttonBaseClass} bg-brand-primary text-white hover:bg-brand-accent`;
const secondaryButtonClass = `${buttonBaseClass} border border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark hover:border-text-muted dark:hover:border-text-muted-dark`;
const dangerButtonClass = `${buttonBaseClass} border border-type-bug dark:border-type-bug-dark bg-surface-card dark:bg-surface-card-dark text-type-bug dark:text-type-bug-dark hover:bg-due-overdue dark:hover:bg-due-overdue-dark`;
const confirmDeleteButtonClass = `${buttonBaseClass} bg-type-bug text-white hover:opacity-90`;
// A lighter button for small actions next to a field: small text and no border, but still 44 px tall.
const smallButtonClass =
  'inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-brand-primary dark:text-brand-primary-dark hover:bg-brand-primary/10 hover:text-brand-accent dark:hover:bg-brand-primary-dark/10 dark:hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark';
// The small actions on a card. The outer part is the 44 px tall press area (DESIGN.md §4),
// and the pill inside is the smaller part you see.
const cardActionClass = 'group inline-flex min-h-11 items-center focus:outline-none';
const cardPillClass =
  'inline-flex items-center gap-1 rounded-full border border-border-subtle dark:border-border-subtle-dark px-2 py-0.5 text-xs font-medium text-brand-primary dark:text-brand-primary-dark group-hover:bg-brand-primary/10 group-hover:text-brand-accent dark:group-hover:bg-brand-primary-dark/10 dark:group-hover:text-brand-primary-dark group-focus-visible:ring-2 group-focus-visible:ring-brand-primary dark:group-focus-visible:ring-brand-primary-dark';
const fieldClass =
  'mt-1 w-full rounded-md border border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark px-3 py-2 text-sm placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary-dark';

// The row of four deliverable cards above the board (M11).
// It always shows the four ANCHORS in order, filling in any saved link by id.
// Team Members can open the links but not change them, so they see a note once here instead.
function AnchorBoard({ anchors, canEdit, onSave }) {
  return (
    <section aria-labelledby="anchor-board-heading" className="mb-4">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
        <h2 id="anchor-board-heading" className="text-sm font-semibold uppercase text-text-muted dark:text-text-muted-dark">
          Deliverables
        </h2>
        {!canEdit && (
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Only the team leader can edit deliverable links
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {ANCHORS.map((anchor) => {
          const url = anchors.find((saved) => saved.id === anchor.id)?.url ?? null;
          return (
            <AnchorCard
              key={anchor.id}
              anchor={{ ...anchor, url }}
              canEdit={canEdit}
              onSave={(newUrl) => onSave(anchor.id, newUrl)}
            />
          );
        })}
      </div>
    </section>
  );
}

// One deliverable card. With no link it shows an input and Save.
// With a link it shows the link (opens in a new tab) plus Edit and Clear.
// The dot is empty with no link and filled with one, and the hidden text says the same for screen readers.
// Without `canEdit` (Team Members) there is no input, Edit or Clear, only the link or "No link yet".
function AnchorCard({ anchor, canEdit, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const hasLink = Boolean(anchor.url);
  const showInput = canEdit && (!hasLink || editing);
  const inputId = `anchor-${anchor.id}`;
  const errorId = `anchor-${anchor.id}-error`;

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page on form submit
    const text = draft.trim();
    if (!isValidUrl(text)) {
      setError('Enter a full link starting with https://');
      return;
    }
    onSave(text);
    setEditing(false);
    setError('');
  }

  function startEditing() {
    setDraft(anchor.url);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError('');
  }

  function clearLink() {
    onSave(null);
    setDraft('');
    setError('');
  }

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark px-3 py-2">
      {/* The label on the left, with Edit / Clear (or Cancel while editing) on the same line to save height. */}
      <div className="flex min-h-11 items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 rounded-full border-2 border-brand-primary dark:border-brand-primary-dark ${
              hasLink ? 'bg-brand-primary dark:bg-brand-primary-dark' : 'bg-transparent'
            }`}
          />
          {anchor.label}
          <span className="sr-only">{hasLink ? ' (link added)' : ' (no link yet)'}</span>
        </h3>
        {editing ? (
          <button type="button" onClick={cancelEditing} className={smallButtonClass}>
            Cancel
          </button>
        ) : (
          hasLink && canEdit && (
            <div className="flex">
              <button type="button" onClick={startEditing} className={smallButtonClass}>
                <Icon>{PENCIL_ICON}</Icon>
                Edit<span className="sr-only"> {anchor.label} link</span>
              </button>
              <button type="button" onClick={clearLink} className={smallButtonClass}>
                <Icon>{X_ICON}</Icon>
                Clear<span className="sr-only"> {anchor.label} link</span>
              </button>
            </div>
          )
        )}
      </div>

      {showInput ? (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
          <label htmlFor={inputId} className="sr-only">
            {anchor.label} link
          </label>
          <div className="flex gap-2">
            <input
              id={inputId}
              type="url"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setError('');
              }}
              placeholder="https://"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : undefined}
              className={`${fieldClass.replace('mt-1 ', '')} min-w-0 flex-1`}
            />
            <button type="submit" className={primaryButtonClass}>
              Save
            </button>
          </div>
          {error && (
            <span id={errorId} role="alert" className="text-xs text-type-bug dark:text-type-bug-dark">
              {error}
            </span>
          )}
        </form>
      ) : !hasLink ? (
        <p className="flex min-h-11 items-center text-sm text-text-muted dark:text-text-muted-dark">
          No link yet.
        </p>
      ) : (
        <a
          href={anchor.url}
          target="_blank"
          rel="noopener noreferrer"
          title={anchor.url}
          className="inline-flex min-h-11 min-w-0 items-center gap-1.5 text-sm font-medium text-brand-accent dark:text-brand-accent-dark underline hover:text-brand-primary dark:hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark"
        >
          <Icon className="h-3.5 w-3.5">{EXTERNAL_LINK_ICON}</Icon>
          <span className="truncate">{anchor.url}</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

// The drag data type for a task card. A made-up type, so columns can tell a card
// apart from anything else dragged onto the page.
const TASK_DRAG_TYPE = 'application/x-vibetracker-task';

// One board column: a heading with a count and a collapse button, then its task cards.
// Collapsed, it is a thin strip with the name and count, and the whole strip is the
// button that opens it again. The count follows the filters, like the cards do.
function Column({
  label,
  tasks,
  collapsed,
  onToggleCollapsed,
  onDropTask,
  onMoveTask,
  filtering,
  team,
  now,
  onOpen,
  onCopy,
}) {
  // Collapsing swaps one button for another, so focus is moved onto the new one
  // instead of being lost. `toggled` stops this happening on first load.
  const toggleRef = useRef(null);
  const toggled = useRef(false);
  useEffect(() => {
    if (toggled.current) toggleRef.current?.focus();
  }, [collapsed]);

  function handleToggle() {
    toggled.current = true;
    onToggleCollapsed();
  }

  // True while a card is dragged over this column, to show the outline.
  const [dropping, setDropping] = useState(false);

  // The browser's own drag and drop events, so no library is needed.
  // Collapsed strips take drops too.
  const dropHandlers = {
    onDragOver(event) {
      // Only cards from this board, not text or files dragged in from elsewhere.
      if (!event.dataTransfer.types.includes(TASK_DRAG_TYPE)) return;
      event.preventDefault(); // this is what tells the browser a drop is allowed here
      event.dataTransfer.dropEffect = 'move';
      setDropping(true);
    },
    onDragLeave(event) {
      // Moving over a card inside the column also fires this, so only stop when leaving the column.
      if (!event.currentTarget.contains(event.relatedTarget)) setDropping(false);
    },
    onDrop(event) {
      setDropping(false);
      const id = event.dataTransfer.getData(TASK_DRAG_TYPE);
      if (!id) return;
      event.preventDefault();
      onDropTask(id);
    },
  };
  const dropClass = dropping
    ? 'ring-2 ring-inset ring-brand-primary dark:ring-brand-primary-dark'
    : '';

  const countText = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
  const countClass =
    'rounded-full bg-surface-card dark:bg-surface-card-dark px-2 text-xs font-normal text-text-muted dark:text-text-muted-dark';

  if (collapsed) {
    return (
      <section
        {...dropHandlers}
        className={`flex min-h-64 w-14 shrink-0 rounded-lg bg-border-subtle/60 dark:bg-border-subtle-dark/60 ${dropClass}`}
      >
        {/* A button inside the heading, so it can still be found by heading. */}
        <h2 className="flex flex-1">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded="false"
            onClick={handleToggle}
            title={`Expand ${label}`}
            className="flex flex-1 flex-col items-center gap-3 rounded-lg py-3 text-base font-semibold uppercase hover:bg-border-subtle dark:hover:bg-border-subtle-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark"
          >
            <Icon>{CHEVRON_RIGHT_ICON}</Icon>
            <span className="sr-only">Expand </span>
            {/* Turned on its side so the name fits the strip, read top to bottom. */}
            <span className="[writing-mode:vertical-rl]">{label}</span>
            <span className={countClass}>
              {tasks.length}
              <span className="sr-only"> {tasks.length === 1 ? 'task' : 'tasks'}</span>
            </span>
          </button>
        </h2>
      </section>
    );
  }

  return (
    <section
      {...dropHandlers}
      className={`flex min-h-64 min-w-0 flex-1 flex-col gap-3 rounded-lg bg-border-subtle/60 dark:bg-border-subtle-dark/60 p-3 ${dropClass}`}
    >
      <div className="flex items-center gap-2 border-b border-text-muted/20 dark:border-text-muted-dark/20 pb-1">
        <h2 className="flex flex-1 items-center justify-between gap-2 text-base font-semibold uppercase">
          {label}
          <span className={countClass}>
            {tasks.length}
            <span className="sr-only"> {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </span>
        </h2>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded="true"
          aria-label={`Collapse ${label}, ${countText}`}
          title={`Collapse ${label}`}
          onClick={handleToggle}
          className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted dark:text-text-muted-dark hover:bg-border-subtle dark:hover:bg-border-subtle-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark"
        >
          <Icon>{CHEVRON_LEFT_ICON}</Icon>
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-text-muted/40 dark:border-text-muted-dark/40 p-4 text-sm text-text-muted dark:text-text-muted-dark">
          {filtering ? 'No tasks here match the filters.' : 'Nothing here yet.'}
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            team={team}
            now={now}
            onOpen={() => onOpen(task)}
            onCopy={() => onCopy(task)}
            onMove={(status) => onMoveTask(task.id, status)}
          />
        ))
      )}
    </section>
  );
}

// The icon for a task type, in that type's colour. It has a label for screen readers,
// unless `decorative` is set because the type name is already written next to it.
function TypeIcon({ type, className = 'h-4 w-4', decorative = false }) {
  const style = taskTypeStyle(type);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(decorative ? { 'aria-hidden': 'true' } : { role: 'img', 'aria-label': style.label })}
      className={`${className} shrink-0 ${style.textClass}`}
    >
      {style.icon}
    </svg>
  );
}

// A small pill with the type's icon and name, e.g. in the modal heading.
function TypeBadge({ type }) {
  const style = taskTypeStyle(type);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs ${style.borderClass} ${style.textClass}`}
    >
      <TypeIcon type={type} className="h-3.5 w-3.5" decorative />
      {style.label}
    </span>
  );
}

// A single task card. The top part is a button so it can be opened with a mouse or the keyboard.
// The coloured left stripe and corner icon show the task type.
// The due chip shows how soon it is due, or "Done". Unfinished tasks with no due date have no chip.
// "Copy Context" and the AI tool link sit below the button, not inside it, so pressing them
// does not open the modal (a button inside a button is not allowed in HTML anyway).
function TaskCard({ task, team, now, onOpen, onCopy, onMove }) {
  const style = taskTypeStyle(task.type);
  const dueText = dueLabel(task, now);
  const dueState = getDueState(task, now);
  const toolLink = aiToolLink(task.contextTool, buildContextMarkdown(task));
  // True while this card is being dragged, so it fades in its old place.
  const [dragging, setDragging] = useState(false);
  return (
    // The whole card can be dragged to another column. The "Move to" menu does the
    // same job for keyboard, touch and screen reader users.
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(TASK_DRAG_TYPE, task.id);
        event.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={`rounded-md border border-l-4 border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark hover:shadow-md ${style.stripeClass} ${
        dragging ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-start gap-2 rounded-md p-3 pb-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{task.title}</span>
          <span className="mt-2 flex items-center gap-2 text-xs text-text-muted dark:text-text-muted-dark">
            <Avatar name={task.assignee} team={team} />
            {task.assignee}
          </span>
          {dueText && (
            <span className="mt-2 block">
              <DueChip state={dueState}>{dueChipText(dueState, dueText)}</DueChip>
            </span>
          )}
        </span>
        {/* The type's icon and name together, in the type's colour. */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 font-mono text-xs ${style.textClass}`}
        >
          <TypeIcon type={task.type} decorative />
          {style.label}
        </span>
      </button>
      <div className="flex flex-wrap justify-end gap-1 px-2">
        <MoveMenu task={task} onMove={onMove} />
        <button type="button" onClick={onCopy} className={cardActionClass}>
          <span className={cardPillClass}>
            <Icon className="h-3 w-3">{COPY_ICON}</Icon>
            Copy Context
          </span>
          <span className="sr-only"> for {task.title}</span>
        </button>
        {toolLink && (
          <a
            href={toolLink.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open in ${task.contextTool}`}
            // Links drag their web address by default. Off, so dragging here moves the card.
            draggable={false}
            className={cardActionClass}
          >
            <span className={cardPillClass}>
              <Icon className="h-3 w-3">{EXTERNAL_LINK_ICON}</Icon>
              <span className="sr-only">Open {task.title} in </span>
              {task.contextTool}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

// The "Move to" button on a card and its menu of the other three columns, for anyone
// who can't drag: keyboard, touch and screen reader users. Choosing one does the same as a drop.
// Keys: Enter, Space or Down Arrow open it, the arrow keys, Home and End move between
// the columns, Enter chooses one, and Esc or Tab closes it and goes back to the button.
function MoveMenu({ task, onMove }) {
  const [open, setOpen] = useState(false);
  // Which column to focus when the menu opens: 0 is the first, -1 the last (Up Arrow).
  const [startAt, setStartAt] = useState(0);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = `move-menu-${task.id}`;
  const targets = STAGES.filter((stage) => stage.id !== task.status);

  useEffect(() => {
    if (open) itemRefs.current.at(startAt)?.focus();
  }, [open, startAt]);

  // A press anywhere outside the menu closes it.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event) {
      if (!wrapperRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  function openMenu(first) {
    setStartAt(first);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(-1);
    }
  }

  function handleMenuKeyDown(event) {
    const items = itemRefs.current;
    const index = items.indexOf(document.activeElement);
    let next = null;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (next !== null) {
      event.preventDefault();
      items[next].focus();
    }
  }

  function choose(status) {
    setOpen(false);
    onMove(status);
    // The card is drawn again in its new column, so focus follows it to its Move to button there.
    // If that column is collapsed or filtered out, there is no button to go to.
    setTimeout(() => document.getElementById(`move-button-${task.id}`)?.focus());
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        id={`move-button-${task.id}`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu(0))}
        onKeyDown={handleButtonKeyDown}
        className={cardActionClass}
      >
        <span className={cardPillClass}>
          <Icon className="h-3 w-3">{MOVE_ICON}</Icon>
          Move to
        </span>
        <span className="sr-only"> ({task.title})</span>
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={`Move ${task.title} to`}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 z-10 w-40 rounded-md border border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark py-1 shadow-lg"
        >
          {targets.map((stage, index) => (
            <li key={stage.id} role="none">
              <button
                ref={(element) => (itemRefs.current[index] = element)}
                type="button"
                role="menuitem"
                // Only the arrow keys move between the columns, so Tab doesn't stop on each one.
                tabIndex={-1}
                onClick={() => choose(stage.id)}
                className="flex min-h-11 w-full items-center px-3 text-left text-sm hover:bg-brand-primary/10 focus:bg-brand-primary/10 dark:hover:bg-brand-primary-dark/10 dark:focus:bg-brand-primary-dark/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary dark:focus-visible:ring-brand-primary-dark"
              >
                {stage.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// The words on a card's due chip. They always start with the state's name from the
// key (Overdue, Due soon, Due later, Done), so the state never relies on colour alone.
function dueChipText(state, label) {
  return state === 'warning' || state === 'calm'
    ? `${DUE_STATES[state].meaning} · ${label.replace(/^Due /, '')}`
    : label;
}

// A small pill with an icon, coloured for the due state.
// The text always says the state too, so it never relies on colour alone.
function DueChip({ state, children }) {
  const style = DUE_STATES[state];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs ${style.chipClass}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
      >
        {style.icon}
      </svg>
      {children}
    </span>
  );
}

// The options under the "Due dates" filter button: the due-date key, where each chip is
// also a filter button. Press one to show only tasks with that chip on their card.
// More than one can be on. A switched-on chip gets a solid outline in its own ink colour
// and bold text, so it doesn't rely on colour alone.
function DueKeyChips({ selected, onToggle }) {
  return (
    <>
      {Object.entries(DUE_STATES).map(([state, style]) => {
        const pressed = selected.includes(state);
        return (
          <button
            key={state}
            type="button"
            aria-pressed={pressed}
            onClick={() => onToggle(state)}
            title={pressed ? `Stop filtering by ${style.meaning}` : `Show only ${style.meaning}`}
            className={cardActionClass}
          >
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs group-focus-visible:ring-2 group-focus-visible:ring-brand-primary group-focus-visible:ring-offset-2 dark:group-focus-visible:ring-brand-primary-dark dark:group-focus-visible:ring-offset-surface-card-dark ${style.chipClass} ${
                pressed
                  ? 'font-semibold outline outline-2 outline-current'
                  : 'group-hover:outline group-hover:outline-1 group-hover:outline-current'
              }`}
            >
              <Icon className="h-3.5 w-3.5">{style.icon}</Icon>
              {style.meaning}
            </span>
          </button>
        );
      })}
      <span className="ml-1 text-xs text-text-muted dark:text-text-muted-dark">
        No chip means no due date. Dates with no time are due at the end of the day.
      </span>
    </>
  );
}

// The filter bar above the board (M12): person, type, due dates and AI tool, and how many
// tasks are showing. Each filter is a button that opens its options underneath, one at a time.
// Each option is a toggle button, and a switched-on one gets a tick and a stronger
// border as well as a tint, so it doesn't rely on colour alone.
function FilterBar({ filters, team, shown, total, onChange }) {
  // Which filter's options are open: 'person', 'type', 'due', 'tool', or null for none.
  const [open, setOpen] = useState(null);

  // Clearing removes the "Clear filters" button, so focus moves to the first filter
  // button instead of being lost.
  const firstButtonRef = useRef(null);

  // Adds the value to the list, or takes it out if it is already there.
  function toggle(list, value) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  function clearFilters() {
    onChange(NO_FILTERS);
    firstButtonRef.current?.focus();
  }

  // How many options are on in each filter, shown on its button while it is closed.
  const groups = [
    { id: 'person', label: 'Person', active: filters.people.length },
    { id: 'type', label: 'Type', active: filters.types.length },
    { id: 'due', label: 'Due dates', active: filters.due.length },
    { id: 'tool', label: 'AI tool', active: filters.tools.length },
  ];

  return (
    <section
      aria-labelledby="filter-heading"
      className="mb-4 rounded-md border border-border-subtle bg-surface-card px-3 py-2 dark:border-border-subtle-dark dark:bg-surface-card-dark"
    >
      <div className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1">
        <h2
          id="filter-heading"
          className="flex items-center gap-2 text-sm font-semibold uppercase text-text-muted dark:text-text-muted-dark"
        >
          <Icon>{FILTER_ICON}</Icon>
          Filters
        </h2>
        <div className="flex flex-wrap gap-1">
          {groups.map((group, index) => (
            <FilterToggle
              key={group.id}
              buttonRef={index === 0 ? firstButtonRef : undefined}
              label={group.label}
              active={group.active}
              expanded={open === group.id}
              controls={`filter-${group.id}`}
              onClick={() => setOpen(open === group.id ? null : group.id)}
            />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Read out by screen readers whenever the number changes. */}
          <p role="status" className="text-sm text-text-muted dark:text-text-muted-dark">
            Showing {shown} of {total} {total === 1 ? 'task' : 'tasks'}
          </p>
          {isFiltering(filters) && (
            <button type="button" onClick={clearFilters} className={smallButtonClass}>
              <Icon>{X_ICON}</Icon>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {open === 'person' && (
        <FilterGroup id="filter-person" label="Person">
          {team.map((member) => (
            <FilterChip
              key={member.name}
              pressed={filters.people.includes(member.name)}
              onClick={() => onChange({ ...filters, people: toggle(filters.people, member.name) })}
              title={member.name}
              withAvatar
            >
              <Avatar name={member.name} team={team} />
              {/* First name only to keep the row short. The full name is the tooltip
                  and is read out by screen readers. */}
              <span aria-hidden="true">{member.name.split(' ')[0]}</span>
              <span className="sr-only">{member.name}</span>
            </FilterChip>
          ))}
        </FilterGroup>
      )}

      {/* Each type keeps its own icon and colour from TASK_TYPES, as on the cards.
          Switched on, it also gets the type's tint and a tick. */}
      {open === 'type' && (
        <FilterGroup id="filter-type" label="Type">
          {Object.entries(TASK_TYPES).map(([value, style]) => (
            <FilterChip
              key={value}
              pressed={filters.types.includes(value)}
              pressedClass={`font-semibold ${style.selectedClass}`}
              onClick={() => onChange({ ...filters, types: toggle(filters.types, value) })}
            >
              <TypeIcon type={value} className="h-3.5 w-3.5" decorative />
              <span className={`font-mono ${style.textClass}`}>{style.label}</span>
            </FilterChip>
          ))}
        </FilterGroup>
      )}

      {/* The due-date key, with each chip as a filter option. */}
      {open === 'due' && (
        <FilterGroup id="filter-due" label="Due dates">
          <DueKeyChips
            selected={filters.due}
            onToggle={(state) => onChange({ ...filters, due: toggle(filters.due, state) })}
          />
        </FilterGroup>
      )}

      {open === 'tool' && (
        <FilterGroup id="filter-tool" label="AI tool">
          {CONTEXT_TOOLS.map((tool) => (
            <FilterChip
              key={tool}
              pressed={filters.tools.includes(tool)}
              onClick={() => onChange({ ...filters, tools: toggle(filters.tools, tool) })}
            >
              {tool}
            </FilterChip>
          ))}
        </FilterGroup>
      )}

    </section>
  );
}

// The button that opens or closes one filter's options. aria-expanded tells screen
// readers whether the options are showing. The count says how many are switched on,
// so you can see a filter is in use even while it is closed.
function FilterToggle({ label, active, expanded, controls, onClick, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={expanded}
      // Only points at the options while they are on the page.
      aria-controls={expanded ? controls : undefined}
      onClick={onClick}
      className={cardActionClass}
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium group-focus-visible:ring-2 group-focus-visible:ring-brand-primary dark:group-focus-visible:ring-brand-primary-dark ${
          active > 0 || expanded
            ? 'border-brand-primary bg-brand-primary/10 dark:border-brand-primary-dark dark:bg-brand-primary-dark/10'
            : 'border-border-subtle group-hover:border-text-muted dark:border-border-subtle-dark dark:group-hover:border-text-muted-dark'
        }`}
      >
        {label}
        {active > 0 && (
          <span className="font-semibold">
            ({active}
            <span className="sr-only"> on</span>)
          </span>
        )}
        <Icon className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          {CHEVRON_DOWN_ICON}
        </Icon>
      </span>
    </button>
  );
}

// A labelled row of filter options, shown under the filter buttons when one is open.
function FilterGroup({ id, label, children }) {
  return (
    <div
      id={id}
      role="group"
      aria-labelledby={`${id}-label`}
      className="mt-1 flex flex-wrap items-center gap-x-1 border-t border-border-subtle pt-1 dark:border-border-subtle-dark"
    >
      <span
        id={`${id}-label`}
        className="mr-1 text-xs font-medium text-text-muted dark:text-text-muted-dark"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

// One filter option. Like the card actions, the outer button is the 44 px press area
// and the pill inside is the part you see. `pressedClass` swaps the blue switched-on
// look for another one, e.g. a task type's own colour.
function FilterChip({
  pressed,
  onClick,
  title,
  withAvatar = false,
  pressedClass = 'border-brand-primary bg-brand-primary/10 font-semibold dark:border-brand-primary-dark dark:bg-brand-primary-dark/10',
  buttonRef,
  children,
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      title={title}
      className={cardActionClass}
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full border py-0.5 text-xs group-focus-visible:ring-2 group-focus-visible:ring-brand-primary dark:group-focus-visible:ring-brand-primary-dark ${
          withAvatar ? 'pl-0.5 pr-2' : 'px-2'
        } ${
          pressed
            ? pressedClass
            : 'border-border-subtle bg-surface-card group-hover:border-text-muted dark:border-border-subtle-dark dark:bg-surface-card-dark dark:group-hover:border-text-muted-dark'
        }`}
      >
        {children}
        {pressed && <Icon className="h-3.5 w-3.5">{CHECK_ICON}</Icon>}
      </span>
    </button>
  );
}

// A circle with the teammate's initials in their colour. Hidden from screen readers
// because the full name is always written next to it.
function Avatar({ name, team }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColour(team, name)}`}
    >
      {initials(name)}
    </span>
  );
}

// Two arrows pointing opposite ways, between the owner and "Hand off to…" (Lucide arrow-right-left).
// Decorative only: the words next to it already say what it means.
function SwapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-brand-primary dark:text-brand-primary-dark"
    >
      <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
    </svg>
  );
}

// A small line icon in the text colour. Decorative only: the button text next to it says what it does.
function Icon({ children, className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      {children}
    </svg>
  );
}

// Three blocks on a page (Lucide layout-template), for "Use template".
const TEMPLATE_ICON = (
  <>
    <rect width="18" height="7" x="3" y="3" rx="1" />
    <rect width="9" height="7" x="3" y="14" rx="1" />
    <rect width="5" height="7" x="16" y="14" rx="1" />
  </>
);

// A box with an arrow leaving it (Lucide external-link), for "Open in [tool]".
const EXTERNAL_LINK_ICON = (
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>
);

// A clipboard (Lucide clipboard), for "Copy Context".
const COPY_ICON = (
  <>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </>
);

// Two people (Lucide users), for the Team button.
const USERS_ICON = (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

// A plus (Lucide plus), for "Add task".
const PLUS_ICON = <path d="M5 12h14M12 5v14" />;

// A pencil (Lucide pencil), for editing.
const PENCIL_ICON = (
  <>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </>
);

// Three bars on an axis (Lucide chart-column), for the Stats button.
const CHART_ICON = (
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9M13 17V5M8 17v-3" />
  </>
);

// A person with a plus (Lucide user-plus), for adding a teammate.
const USER_PLUS_ICON = (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </>
);

// A bin (Lucide trash-2), for removing or deleting.
const BIN_ICON = (
  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
);

// A funnel (Lucide filter), for the filter bar heading.
const FILTER_ICON = <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;

// A downward arrowhead (Lucide chevron-down), for things that open and close.
const CHEVRON_DOWN_ICON = <path d="m6 9 6 6 6-6" />;

// Arrowheads pointing left and right (Lucide chevron-left and chevron-right),
// for collapsing a column into a strip and opening it again.
const CHEVRON_LEFT_ICON = <path d="m15 18-6-6 6-6" />;
const CHEVRON_RIGHT_ICON = <path d="m9 18 6-6-6-6" />;

// An arrow pointing right (Lucide arrow-right), for "Move to" on a card.
const MOVE_ICON = <path d="M5 12h14M13 6l6 6-6 6" />;

// A door with an arrow leaving it (Lucide log-out), for "Log out".
const LOG_OUT_ICON = <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;

// A cross (Lucide x), for "Clear filters" and closing things.
const X_ICON = <path d="M18 6 6 18M6 6l12 12" />;

// A sun (Lucide sun), shown in dark mode for "Switch to light mode".
const SUN_ICON = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </>
);

// A crescent moon (Lucide moon), shown in light mode for "Switch to dark mode".
const MOON_ICON = <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />;

// Shows an ISO 'YYYY-MM-DD' date as e.g. '20 October 2026'.
function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Shows how long ago an ISO timestamp was, e.g. '2 hours ago' or 'just now'.
function timeAgo(isoTime, now) {
  const seconds = Math.round((new Date(isoTime) - now) / 1000); // negative = in the past
  if (seconds > -60) return 'just now';
  const units = [
    ['year', 365 * 24 * 60 * 60],
    ['month', 30 * 24 * 60 * 60],
    ['week', 7 * 24 * 60 * 60],
    ['day', 24 * 60 * 60],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  const [unit, size] = units.find(([, size]) => Math.abs(seconds) >= size);
  return new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' }).format(
    Math.round(seconds / size),
    unit
  );
}

// One modal for adding and editing a task. It edits a draft copy,
// so nothing changes on the board until Save is pressed.
function TaskModal({ task, isNew, team, now, onSave, onHandOff, onCopy, onDelete, onClose }) {
  // Older tasks may not have the context fields yet, so fill in the defaults first.
  const [draft, setDraft] = useState({ ...CONTEXT_DEFAULTS, ...task });
  // The context as it was when the modal opened, to tell if it has been edited.
  const savedContext = task.context ?? '';
  const contextChanged = draft.context !== savedContext;
  const [error, setError] = useState('');
  // True while the "Delete this task?" message is showing.
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // True while the "Replace your context with the template?" message is showing.
  const [confirmingTemplate, setConfirmingTemplate] = useState(false);

  const dialogRef = useRef(null);
  useFocusTrap(dialogRef);

  // Escape backs out of an open message first, otherwise closes the modal without saving.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (confirmingDelete) setConfirmingDelete(false);
      else if (confirmingTemplate) setConfirmingTemplate(false);
      else onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmingDelete, confirmingTemplate, onClose]);

  function update(field, value) {
    setDraft({ ...draft, [field]: value });
  }

  // Puts the template in the Context field. If that would replace the user's own text,
  // it shows a small "Replace your context?" message in the modal first.
  function applyTemplate() {
    const hasOwnText = draft.context.trim() !== '' && draft.context !== CONTEXT_TEMPLATE;
    if (hasOwnText) setConfirmingTemplate(true);
    else update('context', CONTEXT_TEMPLATE);
  }

  function replaceWithTemplate() {
    update('context', CONTEXT_TEMPLATE);
    setConfirmingTemplate(false);
  }

  // The modal copies and links the draft, so unsaved edits are included.
  const toolLink = aiToolLink(draft.contextTool, buildContextMarkdown(draft));

  // dueDate holds the date and the optional time together, e.g. '2026-10-20T14:30'.
  // The modal shows them as two inputs, so split it here and join it back on change.
  const [dueDay, dueTime = ''] = (draft.dueDate ?? '').split('T');

  function updateDue(day, time) {
    // An empty date input gives '', which is saved as null (no due date, so no time either).
    if (!day) update('dueDate', null);
    else update('dueDate', time ? `${day}T${time}` : day);
  }

  // The draft with a tidied title, or null (and an error message) if the title is empty.
  // contextUpdatedAt only moves on when the context text itself has changed.
  function checkedDraft() {
    const title = draft.title.trim();
    if (!title) {
      setError('Please add a title.');
      return null;
    }
    const contextUpdatedAt = contextChanged ? new Date().toISOString() : draft.contextUpdatedAt;
    return { ...draft, title, contextUpdatedAt };
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page on form submit
    const checked = checkedDraft();
    if (checked) onSave(checked);
  }

  // Picking a name in "Hand off to…" saves straight away, including any other edits.
  function handOff(name) {
    const checked = checkedDraft();
    if (checked) onHandOff({ ...checked, assignee: name });
  }

  return (
    // The backdrop. Only a press on the backdrop itself closes the modal,
    // not a press that started inside the form.
    <div
      className="fixed inset-0 flex items-center justify-center bg-text-primary/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-heading"
        onSubmit={handleSubmit}
        className={`flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg border-t-8 bg-surface-card dark:bg-surface-card-dark p-6 md:max-w-4xl ${taskTypeStyle(draft.type).topStripeClass}`}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 id="task-modal-heading" className="text-lg font-semibold">
            {isNew ? 'Add task' : 'Edit task'}
          </h2>
          <TypeBadge type={draft.type} />
        </div>

        {/* Two columns on wider screens: the task itself on the left,
            the AI tool and Context on the right. */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <label className="block text-sm font-medium">
              Title
              <input
                type="text"
                autoFocus
                value={draft.title}
                onChange={(event) => {
                  update('title', event.target.value);
                  setError('');
                }}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'task-title-error' : undefined}
                className={fieldClass}
              />
              {error && (
                <span id="task-title-error" role="alert" className="mt-1 block text-xs text-type-bug dark:text-type-bug-dark">
                  {error}
                </span>
              )}
            </label>

            <label className="block text-sm font-medium">
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) => update('description', event.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* One button per type. They are radio buttons underneath (hidden with sr-only),
                  so arrow keys and screen readers work. The selected one is highlighted
                  in its type colour from TASK_TYPES. */}
              <fieldset className="text-sm font-medium">
                <legend>Type</legend>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {Object.entries(TASK_TYPES).map(([value, style]) => {
                    const selected = draft.type === value;
                    return (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="task-type"
                          value={value}
                          checked={selected}
                          onChange={() => update('type', value)}
                          className="peer sr-only"
                        />
                        <span
                          className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 font-mono text-sm peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary dark:peer-focus-visible:ring-brand-primary-dark ${
                            selected
                              ? `font-semibold ${style.selectedClass}`
                              : 'border-border-subtle dark:border-border-subtle-dark bg-surface-card dark:bg-surface-card-dark text-text-muted dark:text-text-muted-dark hover:border-text-muted dark:hover:border-text-muted-dark'
                          }`}
                        >
                          <TypeIcon type={value} decorative />
                          {style.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label className="block text-sm font-medium">
                Status
                <select
                  value={draft.status}
                  onChange={(event) => update('status', event.target.value)}
                  className={fieldClass}
                >
                  {STAGES.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* A new task picks its first owner here. An existing task changes owner
                through the Owner box instead. */}
            {isNew && (
              <label className="block text-sm font-medium">
                Assignee
                <select
                  value={draft.assignee}
                  onChange={(event) => update('assignee', event.target.value)}
                  className={fieldClass}
                >
                  {team.map((member) => (
                    <option key={member.name} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* Owner box: who has the task now, a swap icon, then who to hand it to. */}
            {!isNew && (
              <fieldset className="rounded-md border border-border-subtle dark:border-border-subtle-dark p-3">
                <legend className="px-1 text-sm font-medium">Owner</legend>
                <div className="flex items-center gap-3">
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                    <Avatar name={draft.assignee} team={team} />
                    <span className="truncate">{draft.assignee}</span>
                  </span>
                  <SwapIcon />
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Hand off to</span>
                    {/* Always shows the placeholder: picking a name hands off at once. */}
                    <select
                      value=""
                      onChange={(event) => handOff(event.target.value)}
                      disabled={team.length < 2}
                      className={`${fieldClass.replace('mt-1 ', '')} disabled:cursor-not-allowed disabled:text-text-muted dark:disabled:text-text-muted-dark`}
                    >
                      <option value="" disabled>
                        {team.length > 1 ? 'Hand off to…' : 'No one else on the team'}
                      </option>
                      {team
                        .filter((member) => member.name !== draft.assignee)
                        .map((member) => (
                          <option key={member.name} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              </fieldset>
            )}

            {/* Date and an optional time. With no time, the task is due at the end of the day. */}
            <fieldset className="text-sm font-medium">
              <legend>Due</legend>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-xs font-normal text-text-muted dark:text-text-muted-dark">
                  Date
                  <input
                    type="date"
                    value={dueDay}
                    onChange={(event) => updateDue(event.target.value, dueTime)}
                    className={`${fieldClass} text-text-primary dark:text-text-primary-dark`}
                  />
                </label>
                <label className="block text-xs font-normal text-text-muted dark:text-text-muted-dark">
                  Time (optional)
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(event) => updateDue(dueDay, event.target.value)}
                    disabled={!dueDay}
                    className={`${fieldClass} text-text-primary dark:text-text-primary-dark disabled:cursor-not-allowed disabled:text-text-muted dark:disabled:text-text-muted-dark`}
                  />
                </label>
              </div>
            </fieldset>

            <p className="text-sm text-text-muted dark:text-text-muted-dark">Created {formatDate(draft.createdDate)}</p>
          </div>

          {/* Right column: the AI tool and the Context briefing that goes to it.
              Below the md breakpoint the two columns stack, left one first. */}
          <div className="flex min-w-0 flex-col gap-4 border-border-subtle dark:border-border-subtle-dark md:border-l md:pl-6">
            {/* The AI tool, plus a link to open it when the tool has one in AI_TOOL_LINKS. */}
            <div>
              <div className="flex items-end gap-2">
                <label className="block flex-1 text-sm font-medium">
                  AI tool (optional)
                  <select
                    value={draft.contextTool ?? ''}
                    onChange={(event) => update('contextTool', event.target.value || null)}
                    className={fieldClass}
                  >
                    <option value="">None</option>
                    {CONTEXT_TOOLS.map((tool) => (
                      <option key={tool} value={tool}>
                        {tool}
                      </option>
                    ))}
                  </select>
                </label>
                {toolLink && (
                  <a
                    href={toolLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
                  >
                    <Icon>{EXTERNAL_LINK_ICON}</Icon>
                    Open in {draft.contextTool}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
              {toolLink?.tooLong && (
                <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
                  Too long for a link, so {draft.contextTool} opens without your text. Use Copy Context
                  and paste it in.
                </p>
              )}
            </div>

            {/* The briefing to paste into an AI tool or pass to a teammate.
                It grows to fill the rest of the column. */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-end justify-between gap-2">
                <label htmlFor="task-context" className="text-sm font-medium">
                  Context
                  <span className="ml-2 text-xs font-normal text-text-muted dark:text-text-muted-dark">Markdown supported</span>
                </label>
                <div className="flex gap-1">
                  <button type="button" onClick={applyTemplate} className={smallButtonClass}>
                    <Icon>{TEMPLATE_ICON}</Icon>
                    Use template
                  </button>
                  <button type="button" onClick={() => onCopy(draft)} className={smallButtonClass}>
                    <Icon>{COPY_ICON}</Icon>
                    Copy Context
                  </button>
                </div>
              </div>
              {confirmingTemplate && (
                <div
                  role="alertdialog"
                  aria-labelledby="template-confirm-text"
                  className="mt-1 flex flex-wrap items-center gap-2 rounded-md border border-border-subtle dark:border-border-subtle-dark bg-surface-page dark:bg-surface-page-dark p-2"
                >
                  <p id="template-confirm-text" className="flex-1 text-xs">
                    Replace your context with the template?
                  </p>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setConfirmingTemplate(false)}
                    className={smallButtonClass}
                  >
                    Keep my text
                  </button>
                  <button type="button" onClick={replaceWithTemplate} className={smallButtonClass}>
                    Replace
                  </button>
                </div>
              )}
              <textarea
                id="task-context"
                rows={14}
                value={draft.context}
                onChange={(event) => update('context', event.target.value)}
                aria-describedby="task-context-updated"
                className={`${fieldClass} flex-1 font-mono`}
              />
              <p id="task-context-updated" className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
                {draft.contextUpdatedAt ? (
                  <time
                    dateTime={draft.contextUpdatedAt}
                    title={new Date(draft.contextUpdatedAt).toLocaleString('en-GB')}
                  >
                    Last updated {timeAgo(draft.contextUpdatedAt, now)}
                  </time>
                ) : (
                  'Not updated yet'
                )}
                {contextChanged && ' (unsaved changes)'}
              </p>
            </div>
          </div>
        </div>

        {confirmingDelete ? (
          // Shown in place of the normal buttons after Delete is pressed.
          <div
            role="alertdialog"
            aria-labelledby="delete-confirm-text"
            className="flex flex-col gap-3 rounded-md border border-type-bug dark:border-type-bug-dark bg-due-overdue dark:bg-due-overdue-dark p-3"
          >
            <p id="delete-confirm-text" className="text-sm font-medium text-due-overdue-ink dark:text-due-overdue-ink-dark">
              Delete this task? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmingDelete(false)}
                className={secondaryButtonClass}
              >
                Keep task
              </button>
              <button
                type="button"
                onClick={() => onDelete(draft.id)}
                className={`${confirmDeleteButtonClass} inline-flex items-center gap-1.5`}
              >
                <Icon>{BIN_ICON}</Icon>
                Delete task
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className={`${dangerButtonClass} inline-flex items-center gap-1.5`}
              >
                <Icon>{BIN_ICON}</Icon>
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className={`${secondaryButtonClass} ml-auto`}>
              Cancel
            </button>
            <button type="submit" className={primaryButtonClass}>
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// The Team panel: see who is on the team and how many open tasks each person has,
// add someone, or remove someone after a confirm step. Changes save straight away.
// Team Members (`canManage` false) only see the list and a note. The leader has no bin
// next to their own name, so no one can remove themselves.
function TeamModal({ team, tasks, canManage, currentUserName, onAdd, onRemove, onClose }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  // The name showing "Remove {name}?", or null.
  const [confirmingRemove, setConfirmingRemove] = useState(null);
  // After "Keep", the bin button comes back and focus goes back onto it.
  const [returnFocusTo, setReturnFocusTo] = useState(null);
  // After a removal that row is gone, so focus moves to the name field.
  const nameInputRef = useRef(null);

  const dialogRef = useRef(null);
  useFocusTrap(dialogRef);

  // Escape backs out of the confirm message first, otherwise closes the panel.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (confirmingRemove) keepTeammate();
      else onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmingRemove, onClose]);

  const isFull = team.length >= MAX_TEAM_SIZE;

  function handleAdd(event) {
    event.preventDefault(); // stop the browser reloading the page on form submit
    const name = newName.trim();
    if (!name) {
      setError('Please type a name.');
      return;
    }
    if (team.some((member) => member.name.toLowerCase() === name.toLowerCase())) {
      setError(`${name} is already on the team.`);
      return;
    }
    onAdd(name);
    setNewName('');
    setError('');
  }

  // Someone who still owns open tasks can't be removed, so no open task is left without an owner.
  // Done tasks don't count: they keep the old owner's name as a record of who did them.
  // That is checked first, so the confirm message only shows when removing is allowed.
  function handleRemove(name) {
    const owned = tasks.filter(
      (task) => task.assignee === name && task.status !== 'done'
    ).length;
    if (owned > 0) {
      setError(
        `${name} still owns ${owned} open ${owned === 1 ? 'task' : 'tasks'}. Hand ${owned === 1 ? 'it' : 'them'} off first.`
      );
      return;
    }
    setError('');
    setReturnFocusTo(null);
    setConfirmingRemove(name);
  }

  // The name field only appears once the team is no longer full, so focus
  // moves after the team has updated rather than straight away.
  const justRemoved = useRef(false);
  useEffect(() => {
    if (!justRemoved.current) return;
    justRemoved.current = false;
    nameInputRef.current?.focus();
  }, [team.length]);

  function confirmRemove() {
    justRemoved.current = true;
    onRemove(confirmingRemove);
    setConfirmingRemove(null);
  }

  function keepTeammate() {
    setReturnFocusTo(confirmingRemove);
    setConfirmingRemove(null);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-text-primary/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-heading"
        onSubmit={handleAdd}
        className="flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg border-t-8 border-t-brand-primary dark:border-t-brand-primary-dark bg-surface-card dark:bg-surface-card-dark p-6"
      >
        <h2 id="team-modal-heading" className="text-lg font-semibold">
          Team
        </h2>

        <ul className="flex flex-col divide-y divide-border-subtle dark:divide-border-subtle-dark">
          {team.map((member) => {
            // Open means anything not in Done.
            const open = tasks.filter(
              (task) => task.assignee === member.name && task.status !== 'done'
            ).length;
            if (confirmingRemove === member.name) {
              // Shown in place of the row after the bin is pressed, like "Delete this task?".
              return (
                <li key={member.name} className="py-2">
                  <div
                    role="alertdialog"
                    aria-labelledby="remove-confirm-text"
                    className="flex flex-wrap items-center gap-2 rounded-md border border-type-bug bg-due-overdue p-2 dark:border-type-bug-dark dark:bg-due-overdue-dark"
                  >
                    <Avatar name={member.name} team={team} />
                    <p
                      id="remove-confirm-text"
                      className="min-w-0 flex-1 text-sm font-medium text-due-overdue-ink dark:text-due-overdue-ink-dark"
                    >
                      Remove {member.name} from the team?
                    </p>
                    <button
                      type="button"
                      autoFocus
                      onClick={keepTeammate}
                      className={secondaryButtonClass}
                    >
                      Keep
                    </button>
                    <button
                      type="button"
                      onClick={confirmRemove}
                      className={`${confirmDeleteButtonClass} inline-flex items-center gap-1.5`}
                    >
                      <Icon>{BIN_ICON}</Icon>
                      Remove
                    </button>
                  </div>
                </li>
              );
            }
            return (
              <li key={member.name} className="flex items-center gap-3 py-2">
                <Avatar name={member.name} team={team} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{member.name}</span>
                  <span className="block text-xs text-text-muted dark:text-text-muted-dark">
                    {open} open {open === 1 ? 'task' : 'tasks'}
                  </span>
                </span>
                {canManage && member.name !== currentUserName && (
                  <button
                    type="button"
                    autoFocus={returnFocusTo === member.name}
                    onClick={() => handleRemove(member.name)}
                    aria-label={`Remove ${member.name}`}
                    title={`Remove ${member.name}`}
                    className={`${dangerButtonClass} inline-flex w-11 items-center justify-center px-0`}
                  >
                    <Icon>{BIN_ICON}</Icon>
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="rounded-md bg-due-overdue dark:bg-due-overdue-dark p-3 text-sm text-due-overdue-ink dark:text-due-overdue-ink-dark">
            {error}
          </p>
        )}

        {!canManage ? (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Only the team leader can manage the team
          </p>
        ) : isFull ? (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            The team is full ({MAX_TEAM_SIZE} people). Remove someone to add another.
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <label className="block flex-1 text-sm font-medium">
              Add a teammate
              <input
                ref={nameInputRef}
                type="text"
                autoFocus
                maxLength={40}
                value={newName}
                onChange={(event) => {
                  setNewName(event.target.value);
                  setError('');
                }}
                placeholder="Full name"
                className={fieldClass}
              />
            </label>
            <button type="submit" className={`${primaryButtonClass} inline-flex items-center gap-1.5`}>
              <Icon>{USER_PLUS_ICON}</Icon>
              Add
            </button>
          </div>
        )}

        <div className="flex justify-end">
          {/* Members have no name field to start on, so focus starts here instead. */}
          <button
            type="button"
            autoFocus={!canManage}
            onClick={onClose}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{X_ICON}</Icon>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

// The login screen (prototype login), shown instead of the board when no one is logged in.
// The error doesn't say whether the name or the password was wrong.
function LoginScreen({ team, onLogIn }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Goes up on every failed try. Used as the error's key, so the alert is put on the
  // page again and screen readers read it out again, even when the words are the same.
  const [failedTries, setFailedTries] = useState(0);

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page on form submit
    const member = findAccount(team, name, password);
    if (!member) {
      setError('Name or password is incorrect');
      setFailedTries(failedTries + 1);
      return;
    }
    onLogIn(member);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="login-heading"
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border-t-8 border-t-brand-primary dark:border-t-brand-primary-dark bg-surface-card dark:bg-surface-card-dark p-6 shadow-sm"
      >
        <div>
          <h1 id="login-heading" className="text-2xl font-semibold text-brand-primary dark:text-brand-primary-dark">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Log in to see the board.</p>
        </div>
        <label className="block text-sm font-medium">
          Name
          <input
            type="text"
            autoFocus
            autoComplete="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'login-error' : undefined}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'login-error' : undefined}
            className={fieldClass}
          />
        </label>
        <button type="submit" className={primaryButtonClass}>
          Log in
        </button>
        {error && (
          <p
            key={failedTries}
            id="login-error"
            role="alert"
            className="rounded-md bg-due-overdue dark:bg-due-overdue-dark p-3 text-sm text-due-overdue-ink dark:text-due-overdue-ink-dark"
          >
            {error}
          </p>
        )}
        <p className="border-t border-border-subtle dark:border-border-subtle-dark pt-3 text-xs text-text-muted dark:text-text-muted-dark">
          Demo accounts: Sian / password (Team Leader), Ela / password (Team Member)
        </p>
      </form>
    </main>
  );
}

// The due-date groups in the Stats panel, in display order (dueGroup() ids).
// Each open task is in exactly one, so "This week" here leaves out today.
const STATS_DUE_GROUPS = [
  { id: 'overdue', label: 'Overdue' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Rest of this week' },
  { id: 'later', label: 'Later' },
  { id: 'none', label: 'No date' },
];

// "Claude", "Claude and ChatGPT", "Sian, Ela and Bingo".
function joinNames(names) {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// The names with the highest count, and that count. No names if every count is 0.
// Ties are all kept.
function topNames(rows) {
  const count = Math.max(0, ...rows.map((row) => row.value));
  const names = count === 0 ? [] : rows.filter((row) => row.value === count).map((row) => row.label);
  return { names, count };
}

// e.g. "Claude, with 3 tasks." or "Sian and Ela, with 2 open tasks each."
function topSentence({ names, count }, what) {
  return `${joinNames(names)}, with ${count} ${what}${count === 1 ? '' : 's'}${names.length > 1 ? ' each' : ''}.`;
}

// The Stats panel (M12): four small summaries of the tasks the filters are showing.
// The bars are plain divs, no chart library. Every bar has its number written next to it,
// so nothing is shown by bar length or colour alone.
function StatsModal({ tasks, total, filtering, team, now, onClose }) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const openTasks = tasks.filter((task) => task.status !== 'done');
  const doneCount = tasks.length - openTasks.length;

  // 1. Tasks per AI tool, including tasks with no tool picked.
  const toolRows = [
    ...CONTEXT_TOOLS.map((tool) => ({
      label: tool,
      value: tasks.filter((task) => task.contextTool === tool).length,
    })),
    { label: 'No tool', value: tasks.filter((task) => !task.contextTool).length },
  ];
  // "No tool" is not a tool, so it can't be the most used one.
  const topTools = topNames(toolRows.slice(0, -1));

  // 2. Open tasks per due-date group.
  const dueRows = STATS_DUE_GROUPS.map((group) => ({
    label: group.label,
    value: openTasks.filter((task) => dueGroup(task, now) === group.id).length,
  }));

  // 3. Open tasks per person, with their avatar.
  const personRows = team.map((member) => ({
    label: member.name,
    avatar: member.name,
    value: openTasks.filter((task) => task.assignee === member.name).length,
  }));
  const topPeople = topNames(personRows);

  // 4. Only the people who have overdue tasks, most first.
  const overdueRows = team
    .map((member) => ({
      label: member.name,
      avatar: member.name,
      value: openTasks.filter(
        (task) => task.assignee === member.name && dueGroup(task, now) === 'overdue'
      ).length,
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);

  const plural = (count) => (count === 1 ? 'task' : 'tasks');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-text-primary/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-heading"
        className="flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg border-t-8 border-t-brand-primary bg-surface-card p-6 dark:border-t-brand-primary-dark dark:bg-surface-card-dark"
      >
        <div>
          <h2 id="stats-modal-heading" className="text-lg font-semibold">
            Stats
          </h2>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {filtering
              ? `Based on the ${tasks.length} of ${total} ${plural(total)} your filters are showing.`
              : `Based on all ${total} ${plural(total)}.`}
          </p>
        </div>

        <StatsSection
          title="Most used AI tool"
          summary={
            topTools.names.length > 0
              ? topSentence(topTools, 'task')
              : 'No AI tool picked on these tasks yet.'
          }
        >
          <BarList rows={toolRows} team={team} />
        </StatsSection>

        <StatsSection
          title="Due dates"
          summary={`${openTasks.length} open ${plural(openTasks.length)}. ${doneCount} done ${doneCount === 1 ? 'task is' : 'tasks are'} not counted.`}
        >
          <BarList rows={dueRows} team={team} />
        </StatsSection>

        <StatsSection
          title="Most open tasks"
          summary={
            topPeople.names.length > 0 ? topSentence(topPeople, 'open task') : 'No one has open tasks.'
          }
        >
          <BarList rows={personRows} team={team} />
        </StatsSection>

        <StatsSection
          title="Overdue tasks"
          summary={
            overdueRows.length > 0
              ? `${overdueRows.length} ${overdueRows.length === 1 ? 'person has' : 'people have'} overdue tasks.`
              : 'No one has overdue tasks.'
          }
        >
          {overdueRows.length > 0 && <BarList rows={overdueRows} team={team} />}
        </StatsSection>

        <div className="flex justify-end">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
          >
            <Icon>{X_ICON}</Icon>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// One summary in the Stats panel: a heading, one sentence with the answer, then the bars.
function StatsSection({ title, summary, children }) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="text-sm font-semibold uppercase">{title}</h3>
        <p className="text-sm">{summary}</p>
      </div>
      {children}
    </section>
  );
}

// A small bar chart: one row per item with its name, a bar and the number.
// Bars are sized against the biggest number in the list. The bar is hidden from
// screen readers, which hear "Claude: 3" from the text instead.
function BarList({ rows, team }) {
  const highest = Math.max(1, ...rows.map((row) => row.value));
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <li key={row.label} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1.5">
            {row.avatar && <Avatar name={row.avatar} team={team} />}
            <span className="truncate" title={row.label}>
              {row.label}
            </span>
            <span className="sr-only">:</span>
          </span>
          <span
            aria-hidden="true"
            className="h-2 rounded-full bg-border-subtle dark:bg-border-subtle-dark"
          >
            {row.value > 0 && (
              <span
                className="block h-2 rounded-full bg-brand-primary dark:bg-brand-primary-dark"
                style={{ width: `${(row.value / highest) * 100}%` }}
              />
            )}
          </span>
          <span className="text-right font-mono">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}
