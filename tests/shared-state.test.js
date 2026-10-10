const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const values = new Map();
const context = {
  window: {},
  sessionStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  }
};
vm.createContext(context);
const source = fs.readFileSync(require('node:path').join(__dirname, '../shared-state.js'), 'utf8');
vm.runInContext(source, context);
const state = context.window.cinemaState;
assert.equal(state.movies.length, 5);
assert.equal(state.bookings.length, 9);
const movie = { id: 'test', title: 'Test', duration: 120, date: '2026-10-01', endDate: '2026-11-01', status: 'showing' };
state.saveMovies([movie]);
const show = { id: 'show-test', movieId: 'test', theaterId: '1', room: 1, date: '2026-10-11', time: '23:00', price: 75000 };
assert.equal(state.movieStatus(movie, '2026-10-11'), 'ended');
assert.equal(state.screeningError(show), '');
state.saveScreenings([show]);
assert.equal(state.movieStatus(movie, '2026-10-10'), 'soon');
assert.equal(state.movieStatus(movie, '2026-10-11'), 'showing');
assert.equal(state.movieStatus(movie, '2026-10-12'), 'ended');
assert.equal(state.screeningError(show), '');
assert.ok(state.screeningError({ ...show, id: 'second', time: '23:30' }));
assert.ok(state.screeningError({ ...show, id: 'second', date: '2026-10-12', time: '00:30' }));
assert.equal(state.screeningError({ ...show, date: '2026-10-12', time: '01:00' }), '');
assert.equal(state.screeningError({ ...show, room: 2 }), '');
assert.ok(state.screeningError({ ...show, date: '2026-09-30' }));
assert.ok(state.screeningError({ ...show, date: '2026-11-02' }));
assert.ok(state.screeningError({ ...show, date: '2026-02-30' }));
assert.ok(state.screeningError({ ...show, time: '24:00' }));
assert.ok(state.screeningError({ ...show, price: -1 }));
assert.ok(state.screeningError({ ...show, movieId: 'missing' }));
assert.ok(state.screeningError({ ...show, room: 6 }));
assert.ok(state.screeningError(show, [{ ...movie, date: '2026-10-12' }]));
state.saveScreenings([show, { ...show, id: 'next', date: '2026-10-12', time: '01:00' }]);
assert.ok(state.screeningError(show, [{ ...movie, duration: 180 }]));
state.saveScreenings([show]);
vm.runInContext(source, context);
assert.equal(context.window.cinemaState.movies[0].title, 'Test');
assert.equal(context.window.cinemaState.screenings[0].id, 'show-test');
console.log('Shared-state checks passed: status by date, overlap across midnight, validation, and persistence.');
