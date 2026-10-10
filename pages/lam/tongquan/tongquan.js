const overviewDate = document.getElementById('overviewDate');
function renderOverview() {
  const now = new Date();
  const today = cinemaState.today();
  overviewDate.dateTime = now.toISOString();
  overviewDate.textContent = now.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  document.getElementById('totalMovies').textContent = cinemaState.movies.length;
  document.getElementById('showingMovies').textContent = cinemaState.movies.filter(movie =>
    cinemaState.movieStatus(movie, today) === 'showing').length;
  document.getElementById('totalBookings').textContent = cinemaState.bookings.length;
  document.getElementById('showingLink').href = '../../../index.html#showtimes?date=' + today;
}
renderOverview();
setInterval(renderOverview, 1000);
