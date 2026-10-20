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
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', makeSeedTasks());

  // The task open in the modal, or null when the modal is closed.
  const [editing, setEditing] = useState(null);

  // Opens the modal with a blank task. It is only added to the board on Save.
  function openNewTask() {
    setEditing({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[0],
      dueDate: null,
      createdDate: daysFromToday(0),
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

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    setEditing(null);
  }

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
        <button type="button" onClick={openNewTask} className={primaryButtonClass}>
          + Add task
        </button>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <main className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            label={stage.label}
            tasks={tasks.filter((task) => task.status === stage.id)}
            onOpen={setEditing}
          />
        ))}
      </main>

      {editing && (
        <TaskModal
          // A new key per task resets the modal's draft when a different task is opened.
          key={editing.id}
          task={editing}
          isNew={!tasks.some((task) => task.id === editing.id)}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// Shared Tailwind classes for buttons and form fields (DESIGN.md §4).
const buttonBaseClass =
  'min-h-11 rounded-md px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2';
const primaryButtonClass = `${buttonBaseClass} bg-brand-primary text-white hover:bg-brand-accent`;
const secondaryButtonClass = `${buttonBaseClass} border border-border-subtle bg-surface-card hover:border-text-muted`;
const dangerButtonClass = `${buttonBaseClass} border border-type-bug bg-surface-card text-type-bug hover:bg-due-overdue`;
const confirmDeleteButtonClass = `${buttonBaseClass} bg-type-bug text-white hover:opacity-90`;
const fieldClass =
  'mt-1 w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary';

// One board column: a heading with a count, then its task cards.
function Column({ label, tasks, onOpen }) {
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
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={() => onOpen(task)} />
        ))
      )}
    </section>
  );
}

// A single task card. It is a button so it can be opened with a mouse or the keyboard.
function TaskCard({ task, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-md border border-border-subtle bg-surface-card p-3 text-left hover:border-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <span className="block text-sm font-medium">{task.title}</span>
      <span className="mt-1 block text-xs text-text-muted">{task.assignee}</span>
    </button>
  );
}

// Shows an ISO 'YYYY-MM-DD' date as e.g. '20 October 2026'.
function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// One modal for adding and editing a task. It edits a draft copy,
// so nothing changes on the board until Save is pressed.
function TaskModal({ task, isNew, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);
  const [error, setError] = useState('');
  // True while the "Delete this task?" message is showing.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Escape backs out of the delete message first, otherwise closes the modal without saving.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (confirmingDelete) setConfirmingDelete(false);
      else onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmingDelete, onClose]);

  function update(field, value) {
    setDraft({ ...draft, [field]: value });
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page on form submit
    const title = draft.title.trim();
    if (!title) {
      setError('Please add a title.');
      return;
    }
    onSave({ ...draft, title });
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-heading"
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-surface-card p-6"
      >
        <h2 id="task-modal-heading" className="text-lg font-semibold">
          {isNew ? 'Add task' : 'Edit task'}
        </h2>

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
            <span id="task-title-error" className="mt-1 block text-xs text-type-bug">
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
          <label className="block text-sm font-medium">
            Type
            <select
              value={draft.type}
              onChange={(event) => update('type', event.target.value)}
              className={fieldClass}
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
            </select>
          </label>

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

          <label className="block text-sm font-medium">
            Assignee
            <select
              value={draft.assignee}
              onChange={(event) => update('assignee', event.target.value)}
              className={fieldClass}
            >
              {TEAM.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Due date
            <input
              type="date"
              value={draft.dueDate ?? ''}
              // An empty date input gives '', which is saved as null (no due date).
              onChange={(event) => update('dueDate', event.target.value || null)}
              className={fieldClass}
            />
          </label>
        </div>

        <p className="text-sm text-text-muted">Created {formatDate(draft.createdDate)}</p>

        {confirmingDelete ? (
          // Shown in place of the normal buttons after Delete is pressed.
          <div
            role="alertdialog"
            aria-labelledby="delete-confirm-text"
            className="flex flex-col gap-3 rounded-md border border-type-bug bg-due-overdue p-3"
          >
            <p id="delete-confirm-text" className="text-sm font-medium text-due-overdue-ink">
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
                className={confirmDeleteButtonClass}
              >
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
                className={dangerButtonClass}
              >
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
