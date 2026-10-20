// Quick check for getDueState (M8). Run with: npm run check:due
// Most examples use a task due on 20 Oct 2026 with no time, so the deadline is
// midnight at the start of 21 Oct (local time). `now` moves around each boundary.

import { getDueState, dueLabel, dueGroup } from '../src/dueState.js';

const due = (status = 'todo', dueDate = '2026-10-20') => ({ status, dueDate });
const at = (day, hour = 0, minute = 0, second = 0) => new Date(2026, 9, day, hour, minute, second);

const cases = [
  ['5 days before deadline', due(), at(16), 'calm'],
  ['exactly 3 days before', due(), at(18), 'calm'],
  ['1 second under 3 days', due(), at(18, 0, 0, 1), 'warning'],
  ['2 days before', due(), at(19), 'warning'],
  ['3h before', due(), at(20, 21), 'warning'],
  ['1 minute before', due(), at(20, 23, 59), 'warning'],
  ['exactly at deadline', due(), at(21), 'alarm'],
  ['10h after', due(), at(21, 10), 'alarm'],
  ['1 day after', due(), at(22), 'alarm'],
  ['with time 14:30, 1 minute before', due('todo', '2026-10-20T14:30'), at(20, 14, 29), 'warning'],
  ['with time 14:30, exactly at it', due('todo', '2026-10-20T14:30'), at(20, 14, 30), 'alarm'],
  ['with time 14:30, 3 days before', due('todo', '2026-10-20T14:30'), at(17, 14, 30), 'calm'],
  ['done, 3 days overdue', due('done'), at(23), 'neutral'],
  ['done, no due date', due('done', null), at(20), 'neutral'],
  ['no due date', due('todo', null), at(20), 'neutral'],
];

let failures = 0;
const rows = cases.map(([name, task, now, expected]) => {
  const actual = getDueState(task, now);
  if (actual !== expected) failures += 1;
  return {
    case: name,
    now: now.toLocaleString('en-GB'),
    expected,
    actual,
    chip: dueLabel(task, now) ?? '(no chip)',
    result: actual === expected ? 'pass' : 'FAIL',
  };
});

console.table(rows);

// dueGroup (M12 filters and stats). `now` is 14:00 on 20 Oct 2026 unless the case says otherwise.
const noon = at(20, 14);
const groupCases = [
  ['done, overdue date', due('done', '2026-10-18'), noon, 'done'],
  ['no due date', due('todo', null), noon, 'none'],
  ['yesterday', due('todo', '2026-10-19'), noon, 'overdue'],
  ['today 09:00, already passed', due('todo', '2026-10-20T09:00'), noon, 'overdue'],
  ['today 18:00', due('todo', '2026-10-20T18:00'), noon, 'today'],
  ['today, no time', due('todo', '2026-10-20'), noon, 'today'],
  ['tomorrow', due('todo', '2026-10-21'), noon, 'week'],
  ['day 7 (26 Oct), no time', due('todo', '2026-10-26'), noon, 'week'],
  ['day 8 (27 Oct) 00:30', due('todo', '2026-10-27T00:30'), noon, 'later'],
  ['in 3 weeks', due('todo', '2026-11-10'), noon, 'later'],
];
const groupRows = groupCases.map(([name, task, now, expected]) => {
  const actual = dueGroup(task, now);
  if (actual !== expected) failures += 1;
  return { case: name, expected, actual, result: actual === expected ? 'pass' : 'FAIL' };
});
console.table(groupRows);

const total = cases.length + groupCases.length;
console.log(failures === 0 ? `All ${total} checks passed.` : `${failures} check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
