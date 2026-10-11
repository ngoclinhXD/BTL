const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const bookings = [
  ['old', '17/12/2021 · 09:30'],
  ['early', '25/09/2026 · 09:00'],
  ['other-month', '28/08/2026 · 19:45'],
  ['late', '25/09/2026 · 14:30'],
  ['other-year', '31/12/2024 · 20:00']
].map(([code, showtime]) => ({ code, showtime, customer: 'Test', movie: 'Test', location: 'Test', seats: 1, total: 10000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' }));
const elements = Object.fromEntries(['bookingSearch', 'bookingRows', 'bookingEmpty'].map(id => [id, {
  addEventListener(type, listener) { this[type] = listener; },
  removeEventListener() {}
}]));
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../pages/booking/booking.js'), 'utf8'), {
  cinemaState: { bookings },
  document: { getElementById: id => elements[id] },
  Intl
});
function renderedCodes() {
  return [...elements.bookingRows.innerHTML.matchAll(/data-booking-code="([^"]+)"/g)].map(match => match[1]);
}
assert.deepEqual(renderedCodes(), ['late', 'early', 'other-month', 'other-year', 'old']);
assert.deepEqual(bookings.map(item => item.code), ['old', 'early', 'other-month', 'late', 'other-year']);
elements.bookingSearch.input({ target: { value: 'Test' } });
assert.deepEqual(renderedCodes(), ['late', 'early', 'other-month', 'other-year', 'old']);
elements.bookingSearch.input({ target: { value: 'missing' } });
assert.deepEqual(renderedCodes(), []);
assert.equal(elements.bookingEmpty.hidden, false);
console.log('Booking sort checks passed: dates, times, search and unchanged source data.');
