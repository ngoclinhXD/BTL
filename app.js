(() => {
  const frame = document.getElementById('pageFrame');
  const content = frame.parentElement;
  const routes = {
    home: 'pages/lam/tongquan/index.html',
    movies: 'pages/movies/movies.html',
    genres: 'pages/movies/genres.html',
    showtimes: 'pages/doanthai/index.html',
    theaters: 'pages/doanthai/movieTheater.html',
    booking: 'pages/booking/booking.html',
    products: 'pages/products/products.html'
  };
  const pageTitles = { login: 'Đăng nhập', home: 'Tổng quan', movies: 'Quản lý phim', genres: 'Quản lý thể loại', showtimes: 'Quản lý suất chiếu', theaters: 'Quản lý rạp chiếu', booking: 'Quản lý đặt vé', products: 'Quản lý Sản phẩm' };
  const loginKey = 'btl.loggedIn';
  let loggedIn;
  try {
    loggedIn = window.sessionStorage.getItem(loginKey) === 'true' || window.name === loginKey;
  } catch {
    // shortcut: file:// may block storage; window.name keeps this demo flag in the tab until logout or close.
    loggedIn = window.name === loginKey;
  }
  let currentPage;

  function loadPage() {
    const [hash, query = ''] = window.location.hash.slice(1).split('?');
    const page = loggedIn ? (Object.hasOwn(routes, hash) ? hash : 'home') : 'login';
    if (hash !== page) window.location.replace(`${window.location.href.split('#')[0]}#${page}`);
    document.body.classList.toggle('login-screen', !loggedIn);
    const pageKey = page + '?' + query;
    if (pageKey !== currentPage) {
      // Recreate the browsing context so iframe navigation adds no extra Back/Forward steps.
      if (currentPage !== undefined) frame.remove();
      frame.title = pageTitles[page];
      frame.src = page === 'login' ? 'pages/lam/login/index.html' : routes[page] + (query ? '?' + query : '');
      if (currentPage !== undefined) content.append(frame);
      currentPage = pageKey;
    }
    document.querySelectorAll('.nav-item').forEach(item => {
      const active = item.dataset.page === page;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  window.addEventListener('message', event => {
    const message = event.data;
    if (event.source !== frame.contentWindow || !message || typeof message !== 'object' || Array.isArray(message)) return;
    if (!loggedIn) {
      if (message.type !== 'LOGIN') return;
      // shortcut: this is a client-side demo login, use server authentication for real accounts.
      if (message.username !== 'utcadmin' || message.password !== '12345678') {
        frame.contentWindow.postMessage({ type: 'LOGIN_ERROR' }, '*');
        return;
      }
      loggedIn = true;
      try {
        window.sessionStorage.setItem(loginKey, 'true');
      } catch {
        window.name = loginKey;
      }
      window.location.replace(`${window.location.href.split('#')[0]}#home`);
      loadPage();
      return;
    }
    if (message.type === 'NAVIGATE' && Object.hasOwn(routes, message.page)) {
      window.location.hash = message.page + (typeof message.query === 'string' ? '?' + message.query : '');
      return;
    }
    if (message.type === 'ADD_MOVIE') {
      const movie = message.movie;
      if (!movie || typeof movie !== 'object' || Array.isArray(movie) ||
          typeof movie.title !== 'string' || !movie.title.trim() ||
          (movie.id !== undefined && typeof movie.id !== 'string' &&
            !(typeof movie.id === 'number' && Number.isFinite(movie.id)))) return;
      cinemaState.saveMovies([...cinemaState.movies, movie.id === undefined ? { title: movie.title } : { id: movie.id, title: movie.title }]);
    } else if (message.type !== 'GET_MOVIES') return;

    // file:// origins may be opaque, so validate the source and use '*' to reply.
    frame.contentWindow.postMessage({ type: 'MOVIES_DATA', movies: cinemaState.movies }, '*');
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });
  document.getElementById('btnLogout').addEventListener('click', () => {
    loggedIn = false;
    try {
      window.sessionStorage.removeItem(loginKey);
    } catch {
      // The storage API may be unavailable for local files.
    }
    if (window.name === loginKey) window.name = '';
    loadPage();
  });
  window.addEventListener('hashchange', loadPage);
  loadPage();
})();
