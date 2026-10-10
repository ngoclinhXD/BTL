(() => {
  const frame = document.getElementById('pageFrame');
  const content = frame.parentElement;
  const routes = {
    booking: 'pages/booking/booking.html',
    products: 'pages/products/products.html'
  };
  const appState = { movies: [] };
  let currentPage;

  function loadPage() {
    const hash = window.location.hash.slice(1);
    const page = Object.hasOwn(routes, hash) ? hash : 'booking';
    if (page !== currentPage) {
      // Recreate the browsing context so iframe navigation adds no extra Back/Forward steps.
      if (currentPage !== undefined) frame.remove();
      frame.title = page === 'booking' ? 'Quản lý đặt vé' : 'Quản lý Sản phẩm';
      frame.src = routes[page];
      if (currentPage !== undefined) content.append(frame);
      currentPage = page;
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
    if (message.type === 'ADD_MOVIE') {
      const movie = message.movie;
      if (!movie || typeof movie !== 'object' || Array.isArray(movie) ||
          typeof movie.title !== 'string' || !movie.title.trim() ||
          (movie.id !== undefined && typeof movie.id !== 'string' &&
            !(typeof movie.id === 'number' && Number.isFinite(movie.id)))) return;
      appState.movies.push(movie.id === undefined ? { title: movie.title } : { id: movie.id, title: movie.title });
    } else if (message.type !== 'GET_MOVIES') return;

    // file:// origins may be opaque, so validate the source and use '*' to reply.
    frame.contentWindow.postMessage({ type: 'MOVIES_DATA', movies: appState.movies }, '*');
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });
  window.addEventListener('hashchange', loadPage);
  if (!window.location.hash) window.location.replace(`${window.location.href.split('#')[0]}#booking`);
  loadPage();
})();
