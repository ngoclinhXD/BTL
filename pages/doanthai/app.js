document.getElementById('movieReset')?.addEventListener('click', () => {
  const editor = document.getElementById('screeningEditor');
  if (editor) editor.close();
  else window.location.href = 'index.html' + window.location.search;
});

document.querySelectorAll('.status-select').forEach(select => {
  const statusClasses = ['status-active', 'status-maintenance', 'status-inactive'];

  const updateStatusColour = () => {
    select.classList.remove(...statusClasses);
    select.classList.add(`status-${select.value}`);
  };

  updateStatusColour();
  select.addEventListener('change', updateStatusColour);
});

/* Modal */
const modals = document.querySelectorAll(".modal");
const theaterNames = document.querySelectorAll(".theaterName");

theaterNames.forEach((theaterName, index) => {
  theaterName.addEventListener("click", () => {
    modals[index].style.display = "flex";
  });
});

modals.forEach(modal => {
  const closeButton = modal.querySelector(".close");

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

const query = new URLSearchParams(window.location.search);
function fillOptions(select, items) {
  items.forEach(([value, label]) => select.add(new Option(label, value)));
}
function addCell(row, text) {
  const cell = row.insertCell();
  cell.textContent = text;
  return cell;
}
function showLink(show, title) {
  const link = document.createElement('a');
  link.textContent = title;
  link.href = '../../index.html#showtimes?' + new URLSearchParams({
    date: show.date, movieId: show.movieId, theaterId: show.theaterId
  });
  link.target = '_top';
  link.onclick = event => {
    if (window.parent === window) return;
    event.preventDefault();
    window.parent.postMessage({
      type: 'NAVIGATE', page: 'showtimes',
      query: new URLSearchParams({ date: show.date, movieId: show.movieId, theaterId: show.theaterId }).toString()
    }, '*');
  };
  return link;
}

const screeningRows = document.getElementById('film');
if (screeningRows) {
  const date = document.getElementById('showDate');
  const movie = document.getElementById('movie');
  const theater = document.getElementById('cinema');
  fillOptions(movie, cinemaState.movies.map(item => [String(item.id), item.title]));
  fillOptions(theater, cinemaState.theaters.map(item => [item.id, item.name]));
  date.value = query.get('date') || '';
  movie.value = query.get('movieId') || '';
  theater.value = query.get('theaterId') || '';
  function renderScreenings() {
    screeningRows.replaceChildren();
    const shows = cinemaState.screenings.filter(show =>
      (!date.value || show.date === date.value) &&
      (!movie.value || show.movieId === movie.value) &&
      (!theater.value || show.theaterId === theater.value));
    shows.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    shows.forEach(show => {
      const film = cinemaState.movies.find(item => String(item.id) === show.movieId);
      const cinema = cinemaState.theaters.find(item => item.id === show.theaterId);
      const row = screeningRows.insertRow();
      [film?.title || 'Phim đã xóa', cinema?.name || '', 'Phòng ' + show.room,
        show.date.split('-').reverse().join('/'), show.time,
        show.price.toLocaleString('vi-VN') + ' ₫', cinema?.seats[show.room - 1] || 0]
        .forEach(value => addCell(row, value));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Xóa';
      remove.setAttribute('aria-label', 'Xóa suất chiếu ' + (film?.title || '') + ' ' + show.date + ' ' + show.time);
      remove.onclick = () => {
        if (!confirm('Xóa suất chiếu này?')) return;
        try {
          cinemaState.saveScreenings(cinemaState.screenings.filter(item => item.id !== show.id));
          renderScreenings();
        } catch { alert('Không lưu được dữ liệu. Suất chiếu chưa bị xóa.'); }
      };
      addCell(row, '').append(remove);
    });
    if (!shows.length) addCell(screeningRows.insertRow(), 'Chưa có suất chiếu phù hợp.').colSpan = 8;
  }
  [date, movie, theater].forEach(input => input.addEventListener('change', renderScreenings));
  document.getElementById('resetFilter').onclick = () => {
    date.value = movie.value = theater.value = '';
    renderScreenings();
  };
  document.getElementById('add').onclick = () => {
    screeningForm.reset();
    document.getElementById('movieSelect').value = movie.value;
    document.getElementById('theaterSelect').value = theater.value;
    document.getElementById('theaterSelect').dispatchEvent(new Event('change'));
    document.getElementById('screeningDate').value = date.value || cinemaState.today();
    document.getElementById('screeningEditor').showModal();
  };
  renderScreenings();
}

const screeningForm = document.getElementById('screeningForm');
if (screeningForm) {
  const editor = document.getElementById('screeningEditor');
  const formDate = document.getElementById('screeningDate') || document.getElementById('showDate');
  editor?.addEventListener('cancel', event => { event.preventDefault(); editor.close(); });
  const movie = document.getElementById('movieSelect');
  const theater = document.getElementById('theaterSelect');
  const room = document.getElementById('roomSelect');
  fillOptions(movie, cinemaState.movies.map(item => [String(item.id), item.title]));
  fillOptions(theater, cinemaState.theaters.map(item => [item.id, item.name]));
  movie.value = query.get('movieId') || '';
  theater.value = query.get('theaterId') || '';
  formDate.value = query.get('date') || cinemaState.today();
  function updateRooms() {
    room.replaceChildren(new Option('Chọn phòng', ''));
    const cinema = cinemaState.theaters.find(item => item.id === theater.value);
    if (cinema) fillOptions(room, cinema.seats.map((seats, index) =>
      [String(index + 1), 'Phòng ' + (index + 1) + ' (' + seats + ' ghế)']));
  }
  theater.addEventListener('change', updateRooms);
  updateRooms();
  screeningForm.onsubmit = event => {
    event.preventDefault();
    const show = {
      id: 'show-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      movieId: movie.value, theaterId: theater.value, room: Number(room.value),
      date: formDate.value,
      time: document.getElementById('showTime').value,
      price: Number(document.getElementById('ticketPrice').value)
    };
    const error = cinemaState.screeningError(show);
    if (error) { alert(error); return; }
    try { cinemaState.saveScreenings([...cinemaState.screenings, show]); }
    catch { alert('Không lưu được dữ liệu. Vui lòng thử lại.'); return; }
    if (editor) {
      editor.close();
      document.getElementById('showDate').value = show.date;
      document.getElementById('showDate').dispatchEvent(new Event('change'));
    } else window.location.href = 'index.html?' + new URLSearchParams({ date: show.date });
  };
}

if (theaterNames.length) {
  const date = document.createElement('input');
  date.type = 'date';
  date.value = query.get('date') || cinemaState.today();
  date.id = 'theaterShowDate';
  const label = document.createElement('label');
  label.htmlFor = date.id;
  label.textContent = 'Phim đang chiếu ngày: ';
  document.getElementById('searchBar').append(label, date);
  function renderTheaterMovies() {
    if (!date.value) date.value = cinemaState.today();
    modals.forEach((modal, theaterIndex) => {
      const theater = cinemaState.theaters[theaterIndex];
      modal.querySelectorAll('tbody tr').forEach((row, roomIndex) => {
        const cell = row.cells[4];
        cell.replaceChildren();
        const shows = cinemaState.screenings.filter(show =>
          show.theaterId === theater.id && show.room === roomIndex + 1 && show.date === date.value);
        shows.forEach((show, index) => {
          const movie = cinemaState.movies.find(item => String(item.id) === show.movieId);
          if (index) cell.append(document.createElement('br'));
          cell.append(showLink(show, (movie?.title || 'Phim đã xóa') + ' · ' + show.time));
        });
        if (!shows.length) cell.textContent = 'Chưa có suất chiếu';
      });
    });
  }
  date.addEventListener('change', renderTheaterMovies);
  document.getElementById('searchInput').oninput = event => {
    theaterNames.forEach(name => {
      name.closest('tr').hidden = !name.textContent.toLocaleLowerCase('vi').includes(event.target.value.trim().toLocaleLowerCase('vi'));
    });
  };
  renderTheaterMovies();
}
