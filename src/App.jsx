import { useState, useEffect } from 'react';

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
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
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
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Example team names (PRD §8). The only valid values for `Task.assignee`.
export const TEAM = ['Sian Edwards', 'Ela Morgan', 'Bingo Edwards', 'Bonnie Morgan'];

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

// Mock tasks for first load. Dates are relative to today so the
// due-date colours (M8) still make sense whenever the app is opened.
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

export default function App() {
  // The seed is only used when nothing is saved in the browser yet.
  // setTasks is unused until M5 adds editing.
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', makeSeedTasks());

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-primary">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-text-muted">
            {/* Replace this line with your team name from PRD §11. */}
            Team starter
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            label={stage.label}
            tasks={tasks.filter((task) => task.status === stage.id)}
          />
        ))}
      </main>
    </div>
  );
}

// One board column: a heading with a count, then its task cards.
function Column({ label, tasks }) {
  return (
    <section className="flex min-h-64 flex-col gap-3 rounded-lg bg-border-subtle/60 p-3">
      <h2 className="flex items-baseline justify-between border-b border-text-muted/20 pb-2 text-base font-semibold uppercase">
        {label}
        <span className="rounded-full bg-surface-card px-2 text-xs font-normal text-text-muted">
          {tasks.length}
        </span>
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-text-muted/40 p-4 text-sm text-text-muted">
          Nothing here yet.
        </p>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </section>
  );
}

// A single task card. M4 shows title and assignee; later milestones add more.
function TaskCard({ task }) {
  return (
    <article className="rounded-md border border-border-subtle bg-surface-card p-3">
      <h3 className="text-sm font-medium">{task.title}</h3>
      <p className="mt-1 text-xs text-text-muted">{task.assignee}</p>
    </article>
  );
}
