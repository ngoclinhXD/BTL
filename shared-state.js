(() => {
  window.movieState = {
    movies: [],
    getMovies() {
      if (window.parent !== window) window.parent.postMessage({ type: 'GET_MOVIES' }, '*');
    },
    addMovie(movie) {
      if (window.parent !== window) window.parent.postMessage({ type: 'ADD_MOVIE', movie }, '*');
    }
  };

  window.addEventListener('message', event => {
    const message = event.data;
    if (window.parent === window || event.source !== window.parent || !message ||
        typeof message !== 'object' || Array.isArray(message) ||
        message.type !== 'MOVIES_DATA' || !Array.isArray(message.movies) ||
        !message.movies.every(movie => movie && typeof movie === 'object' && !Array.isArray(movie) &&
          typeof movie.title === 'string' && movie.title.trim() &&
          (movie.id === undefined || typeof movie.id === 'string' ||
            (typeof movie.id === 'number' && Number.isFinite(movie.id))))) return;
    window.movieState.movies = message.movies;
  });

  window.movieState.getMovies();
})();
