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

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

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
  // TODO M4 data-model:
  //   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', [/* 3-4 seed tasks */]);
  //
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            {/* Replace this line with your team name from PRD §11. */}
            Team starter
          </p>
        </div>
      </header>

      {/* THROWAWAY M3 swatches: delete this line and the TokenSwatches function at the bottom of the file */}
      <TokenSwatches />

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
        Build the four-column board here · M4
      </main>
    </div>
  );
}

// THROWAWAY M3: one swatch per DESIGN.md token so you can see them.
// Delete this whole function (and <TokenSwatches /> above) once you've checked them.
function TokenSwatches() {
  const swatches = [
    ['brand-primary', 'bg-brand-primary'],
    ['brand-accent', 'bg-brand-accent'],
    ['surface-page', 'bg-surface-page'],
    ['surface-card', 'bg-surface-card'],
    ['text-primary', 'bg-text-primary'],
    ['text-muted', 'bg-text-muted'],
    ['border-subtle', 'bg-border-subtle'],
    ['type-feature', 'bg-type-feature'],
    ['type-bug', 'bg-type-bug'],
    ['due-safe', 'bg-due-safe'],
    ['due-warning', 'bg-due-warning'],
    ['due-overdue', 'bg-due-overdue'],
    ['due-neutral', 'bg-due-neutral'],
    ['due-safe-ink', 'bg-due-safe-ink'],
    ['due-warning-ink', 'bg-due-warning-ink'],
    ['due-overdue-ink', 'bg-due-overdue-ink'],
    ['due-neutral-ink', 'bg-due-neutral-ink'],
  ];
  return (
    <section className="mb-6 rounded-md border border-border-subtle bg-surface-card p-4">
      <h2 className="mb-3 text-base font-semibold uppercase">Design tokens (test)</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map(([name, bg]) => (
          <div key={name} className="rounded-md border border-border-subtle">
            <div className={`h-12 rounded-t-md ${bg}`} />
            <p className="p-2 font-mono text-xs">{name}</p>
          </div>
        ))}
      </div>
      <h3 className="mb-2 mt-4 text-sm font-semibold">Due tints with their ink colour</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <p className="rounded-md bg-due-safe p-3 text-sm text-due-safe-ink">Due in 5 days</p>
        <p className="rounded-md bg-due-warning p-3 text-sm text-due-warning-ink">Due today</p>
        <p className="rounded-md bg-due-overdue p-3 text-sm text-due-overdue-ink">Overdue</p>
        <p className="rounded-md bg-due-neutral p-3 text-sm text-due-neutral-ink">Done</p>
      </div>
      <p className="mt-4 text-sm">
        Body text in Plus Jakarta Sans. <span className="font-mono">mono: 0O 1lI</span>
      </p>
    </section>
  );
}
