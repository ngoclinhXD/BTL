const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const values = new Map();
const context = {
  window: {},
  performance: { getEntriesByType: () => [{ type: 'navigate' }] },
  sessionStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  }
};
vm.createContext(context);
const source = fs.readFileSync(require('node:path').join(__dirname, '../shared-state.js'), 'utf8');
vm.runInContext(source, context);
const state = context.window.cinemaState;
assert.equal(state.movies.length, 13);
assert.equal(state.bookings.length, 9);
// Vietnam theatrical releases; showtimes remain demo data.
const releaseDates = new Map([
  ['Spider-Man: No Way Home', '2021-12-17'],
  ['Khóa chặt cửa nào Suzume', '2026-10-02'], // Vietnam rerelease.
  ['Chiikawa: Bí mật đảo người cá', '2026-08-28'],
  ['Kung Fu Panda 4', '2024-03-08'],
  ['Pháo hoa lúc bình minh', '2026-09-25'],
  ['Những mảnh ghép cảm xúc 2', '2024-06-14'],
  ['Kẻ trộm mặt trăng 4', '2024-07-05'],
  ['Marnie yêu dấu', '2026-09-18']
]);
for (const booking of state.bookings) {
  const [day, month, year] = booking.showtime.split(' · ')[0].split('/');
  const date = `${year}-${month}-${day}`;
  const release = releaseDates.get(booking.movie);
  const film = state.movies.find(movie => movie.title === booking.movie);
  assert.ok(film, `Booking movie missing from catalog: ${booking.movie}`);
  assert.equal(film.date, release);
  assert.ok(film.duration > 0 && film.genres.length > 0);
  assert.ok(fs.existsSync(require('node:path').join(__dirname, '../pages/movies', film.poster)));
  assert.ok(release, `Missing release date: ${booking.movie}`);
  assert.ok(date >= release, `${booking.movie}: booking precedes release`);
  assert.ok((Date.parse(date) - Date.parse(release)) / 86400000 <= 21,
    `${booking.movie}: demo booking outside release period`);
}
const movie = { id: 'test', title: 'Test', duration: 120, date: '2026-10-01', endDate: '2026-11-01', status: 'showing' };
state.saveMovies([movie]);
const show = { id: 'show-test', movieId: 'test', theaterId: '1', room: 1, date: '2026-10-11', time: '23:00', price: 75000 };
assert.equal(state.movieStatus(movie, '2026-10-11'), 'showing');
assert.equal(state.screeningError(show), '');
state.saveScreenings([show]);
assert.equal(state.movieStatus(movie, '2026-09-30'), 'soon');
assert.equal(state.movieStatus(movie, '2026-10-01'), 'showing');
assert.equal(state.movieStatus(movie, '2026-10-22'), 'showing');
assert.equal(state.movieStatus(movie, '2026-10-23'), 'ended');
assert.equal(state.movieStatus({ ...movie, date: '2026-09-25' }, '2026-10-16'), 'showing');
assert.equal(state.movieStatus({ ...movie, date: '2026-09-25' }, '2026-10-17'), 'ended');
assert.equal(state.movieStatus(movie, '2026-10-11'), 'showing');
assert.equal(state.movieStatus(movie, '2026-10-12'), 'showing');
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
const resetKeys = ['btl-movies', 'btl-screenings', 'btl-bookings', 'btl-genres'];
resetKeys.forEach(key => values.set(key, '[]'));
values.set('login', 'true');
vm.runInContext(source, context);
resetKeys.forEach(key => assert.equal(values.get(key), '[]'));
context.window.top = context.window;
vm.runInContext(source, context);
resetKeys.forEach(key => assert.equal(values.get(key), '[]'));
context.performance.getEntriesByType = () => [{ type: 'reload' }];
context.window.top = {};
vm.runInContext(source, context);
resetKeys.forEach(key => assert.equal(values.get(key), '[]'));
context.window.top = context.window;
vm.runInContext(source, context);
resetKeys.forEach(key => assert.equal(values.has(key), false));
assert.equal(values.get('login'), 'true');
assert.equal(context.window.cinemaState.movies.length, 13);
assert.equal(context.window.cinemaState.bookings.length, 9);
assert.equal(context.window.cinemaState.screenings.length, 0);
console.log('Shared-state checks passed, including top-level reset and iframe persistence.');
