// Due-date logic for M8 due-tint. Kept in its own file with no React in it,
// so scripts/check-due-state.mjs can run it in Node.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// How far ahead a task counts as "Due soon".
const DUE_SOON = 3 * DAY;

// When a task stops being on time, in local time.
// dueDate is either 'YYYY-MM-DDTHH:mm' (due at that time) or 'YYYY-MM-DD' with
// no time (due at the end of that day, so midnight at the start of the next day).
export function dueDeadline(dueDate) {
  if (dueDate.includes('T')) return new Date(dueDate);
  const deadline = new Date(`${dueDate}T00:00`);
  deadline.setDate(deadline.getDate() + 1);
  return deadline;
}

/**
 * How urgent a task is at the time `now`.
 *   neutral: done (even if it was overdue), or no due date
 *   alarm:   past due
 *   warning: due soon, less than 3 days left
 *   calm:    3 days or more left
 * @returns {'calm'|'warning'|'alarm'|'neutral'}
 */
export function getDueState(task, now) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return 'neutral';
  const timeLeft = dueDeadline(task.dueDate) - now;
  if (timeLeft <= 0) return 'alarm';
  if (timeLeft < DUE_SOON) return 'warning';
  return 'calm';
}

// e.g. '45 min', '3h', '1 day', '4 days'. Always rounds down.
function formatTimeSpan(ms) {
  if (ms < HOUR) return `${Math.max(1, Math.floor(ms / MINUTE))} min`;
  if (ms < DAY) return `${Math.floor(ms / HOUR)}h`;
  const days = Math.floor(ms / DAY);
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

// The text for a task's chip, e.g. 'Due in 3h' or 'Done'.
// Null when the task is not done and has no due date, so it gets no chip.
export function dueLabel(task, now) {
  if (task.status === 'done') return 'Done';
  if (!task.dueDate) return null;
  const timeLeft = dueDeadline(task.dueDate) - now;
  return timeLeft <= 0
    ? `Overdue by ${formatTimeSpan(-timeLeft)}`
    : `Due in ${formatTimeSpan(timeLeft)}`;
}
