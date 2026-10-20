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
    textClass: 'text-type-feature',
    borderClass: 'border-type-feature',
    stripeClass: 'border-l-type-feature',
    topStripeClass: 'border-t-type-feature',
    selectedClass: 'border-type-feature bg-type-feature/10 text-type-feature',
    // A four-point sparkle: something new.
    icon: <path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z" />,
  },
  bug: {
    label: 'Bug',
    textClass: 'text-type-bug',
    borderClass: 'border-type-bug',
    stripeClass: 'border-l-type-bug',
    topStripeClass: 'border-t-type-bug',
    selectedClass: 'border-type-bug bg-type-bug/10 text-type-bug',
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

// Avatar colours (DESIGN.md §2, M7). Written out in full so Tailwind builds them.
const AVATAR_COLOURS = {
  pink: 'bg-avatar-pink',
  slate: 'bg-avatar-slate',
  cyan: 'bg-avatar-cyan',
  orange: 'bg-avatar-orange',
};

// The starting team, each person with a colour in order.
// Every member is saved as { name, colour }, so their colour stays the same
// even when someone else is added or removed.
function makeStartingTeam() {
  const colours = Object.keys(AVATAR_COLOURS);
  return TEAM.map((name, index) => ({ name, colour: colours[index % colours.length] }));
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

  // The current team, as a list of { name, colour }.
  const [team, setTeam] = useLocalStorage('vibetracker.team', makeStartingTeam());

  // The task open in the modal, or null when the modal is closed.
  const [editing, setEditing] = useState(null);

  // True while the Team panel is open.
  const [showingTeam, setShowingTeam] = useState(false);

  function addTeammate(name) {
    setTeam([...team, { name, colour: nextAvatarColour(team) }]);
  }

  function removeTeammate(name) {
    setTeam(team.filter((member) => member.name !== name));
  }

  // Opens the modal with a blank task. It is only added to the board on Save.
  function openNewTask() {
    setEditing({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: team[0].name,
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

  // The hand-off message at the bottom of the screen. `visible` is kept separate from
  // `message` so the text stays put while it fades out. `count` restarts the timer
  // if two hand-offs happen close together.
  const [toast, setToast] = useState({ message: '', visible: false, count: 0 });

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.count]);

  // Saves the task with its new owner, then shows the confirmation.
  function handOffTask(saved) {
    saveTask(saved);
    setToast((current) => ({
      message: `Handed off to ${saved.assignee}.`,
      visible: true,
      count: current.count + 1,
    }));
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowingTeam(true)}
            className={secondaryButtonClass}
          >
            Team ({team.length})
          </button>
          <button type="button" onClick={openNewTask} className={primaryButtonClass}>
            + Add task
          </button>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <main className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            label={stage.label}
            tasks={tasks.filter((task) => task.status === stage.id)}
            team={team}
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
          team={team}
          onSave={saveTask}
          onHandOff={handOffTask}
          onDelete={deleteTask}
          onClose={() => setEditing(null)}
        />
      )}

      {showingTeam && (
        <TeamModal
          team={team}
          tasks={tasks}
          onAdd={addTeammate}
          onRemove={removeTeammate}
          onClose={() => setShowingTeam(false)}
        />
      )}

      {/* Always on the page (just invisible) so screen readers announce new messages. */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-text-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition-opacity duration-200 ${
          toast.visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toast.message}
      </div>
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
function Column({ label, tasks, team, onOpen }) {
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
          <TaskCard key={task.id} task={task} team={team} onOpen={() => onOpen(task)} />
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

// A single task card. It is a button so it can be opened with a mouse or the keyboard.
// The coloured left stripe and corner icon show the task type.
function TaskCard({ task, team, onOpen }) {
  const style = taskTypeStyle(task.type);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full items-start gap-2 rounded-md border border-l-4 border-border-subtle bg-surface-card p-3 text-left hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${style.stripeClass}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{task.title}</span>
        <span className="mt-2 flex items-center gap-2 text-xs text-text-muted">
          <Avatar name={task.assignee} team={team} />
          {task.assignee}
        </span>
      </span>
      <TypeIcon type={task.type} />
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
      className="h-5 w-5 shrink-0 text-brand-primary"
    >
      <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
    </svg>
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
function TaskModal({ task, isNew, team, onSave, onHandOff, onDelete, onClose }) {
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

  // The draft with a tidied title, or null (and an error message) if the title is empty.
  function checkedDraft() {
    const title = draft.title.trim();
    if (!title) {
      setError('Please add a title.');
      return null;
    }
    return { ...draft, title };
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-heading"
        onSubmit={handleSubmit}
        className={`flex w-full max-w-md flex-col gap-4 rounded-lg border-t-8 bg-surface-card p-6 ${taskTypeStyle(draft.type).topStripeClass}`}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 id="task-modal-heading" className="text-lg font-semibold">
            {isNew ? 'Add task' : 'Edit task'}
          </h2>
          <TypeBadge type={draft.type} />
        </div>

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
                      className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 font-mono text-sm peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary ${
                        selected
                          ? `font-semibold ${style.selectedClass}`
                          : 'border-border-subtle bg-surface-card text-text-muted hover:border-text-muted'
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

          {/* A new task picks its first owner here. An existing task changes owner
              through the Owner box below. */}
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

        {/* Owner box: who has the task now, a swap icon, then who to hand it to. */}
        {!isNew && (
          <fieldset className="rounded-md border border-border-subtle p-3">
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
                  className={`${fieldClass.replace('mt-1 ', '')} disabled:cursor-not-allowed disabled:text-text-muted`}
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

// The Team panel: see who is on the team, how many tasks each person has
// in progress, add someone or remove someone. Changes save straight away.
function TeamModal({ team, tasks, onAdd, onRemove, onClose }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  // Someone who still owns tasks can't be removed, so no task is ever left without an owner.
  function handleRemove(name) {
    const owned = tasks.filter((task) => task.assignee === name).length;
    if (owned > 0) {
      setError(
        `${name} still owns ${owned} ${owned === 1 ? 'task' : 'tasks'}. Hand ${owned === 1 ? 'it' : 'them'} off first.`
      );
      return;
    }
    onRemove(name);
    setError('');
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-text-primary/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-heading"
        onSubmit={handleAdd}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border-t-8 border-t-brand-primary bg-surface-card p-6"
      >
        <h2 id="team-modal-heading" className="text-lg font-semibold">
          Team
        </h2>

        <ul className="flex flex-col divide-y divide-border-subtle">
          {team.map((member) => {
            const inProgress = tasks.filter(
              (task) => task.assignee === member.name && task.status === 'in-progress'
            ).length;
            return (
              <li key={member.name} className="flex items-center gap-3 py-2">
                <Avatar name={member.name} team={team} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{member.name}</span>
                  <span className="block text-xs text-text-muted">{inProgress} in progress</span>
                </span>
                {team.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member.name)}
                    aria-label={`Remove ${member.name}`}
                    className={dangerButtonClass}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="rounded-md bg-due-overdue p-3 text-sm text-due-overdue-ink">
            {error}
          </p>
        )}

        {isFull ? (
          <p className="text-sm text-text-muted">
            The team is full ({MAX_TEAM_SIZE} people). Remove someone to add another.
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <label className="block flex-1 text-sm font-medium">
              Add a teammate
              <input
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
            <button type="submit" className={primaryButtonClass}>
              Add
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
