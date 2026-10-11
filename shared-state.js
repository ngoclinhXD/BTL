(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (window === window.top && navigation?.type === 'reload') {
    ['btl-movies', 'btl-screenings', 'btl-bookings', 'btl-genres'].forEach(key => sessionStorage.removeItem(key));
  }

  const defaultMovies = [
    {
      id: 1,
      poster: "images/Muado.jpg",
      title: "Mưa đỏ",
      subtitle: "Red Rain",
      genres: ["Chính kịch", "Hành động", "Phiêu lưu", "Tình cảm"],
      duration: 150,
      date: "2025-11-20",
      status: "ended",
      rating: 8.0,
      color: "#9e2b27"
    },
    {
      id: 2,
      poster: "images/Dune.jpeg",
      title: "Dune",
      subtitle: "Dune",
      genres: ["Chính kịch", "Khoa học viễn tưởng", "Phiêu lưu"],
      duration: 155,
      date: "2025-11-17",
      status: "ended",
      rating: 8.5,
      color: "#a77b51"
    },
    {
      id: 3,
      poster: "images/traibuonnguoi.jpg",
      title: "Trại Buôn Người",
      subtitle: "The Journey of Heroes",
      genres: ["Hành động", "Sinh Tồn"],
      duration: 135,
      date: "2026-09-25",
      status: "showing",
      rating: 9.5,
      color: "#554074"
    },
    {
      id: 4,
      poster: "images/Avengers_ Endgame Encore.jpg",
      title: "Biệt Đội Siêu Anh Hùng: Hồi Kết - Phiên bản đặc biệt",
      subtitle: "Avengers: Endgame - Special Edition",
      genres: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
      duration: 183,
      date: "2026-09-25",
      status: "showing",
      rating: 8.5,
      color: "#256372"
    },
    {
      id: 5,
      poster: "images/Shaunthesheep.jpg",
      title: "Shaun The Sheep",
      subtitle: "Quái lạ ghé nhà",
      genres: ["Hoạt hình", "Hài", "Phiêu lưu"],
      duration: 81,
      date: "2026-10-16",
      status: "soon",
      rating: 0.0,
      color: "#363636"
    }
  ];
  const defaultBookings = [
  { code: 'BKMIC7CT451HBDN', customer: 'Đoàn Danh Thái', movie: 'Spider-Man: No Way Home', location: 'CGV Vincom · Phòng 1', showtime: '24/11/2025 · 09:30', seats: 3, total: 165000, ticket: 'Đã sử dụng', payment: 'Đã thanh toán' },
  { code: 'BKMIC7A2RO7IXAM', customer: 'Phạm Ngọc Linh', movie: 'Spider-Man: No Way Home', location: 'CGV Vincom · Phòng 1', showtime: '24/11/2025 · 09:30', seats: 2, total: 110000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' },
  { code: 'BKMIC8LP201QAHE', customer: 'Phạm Nguyễn Minh Chi', movie: 'Chiikawa: Bí ẩn đảo người cá', location: 'CGV Vincom · Phòng 3', showtime: '25/11/2025 · 19:45', seats: 2, total: 180000, ticket: 'Chờ xác nhận', payment: 'Chờ thanh toán' },
  { code: 'BKMIC9DN302KFP4', customer: 'Nguyễn Đức Nam', movie: 'Kung Fu Panda 4', location: 'CGV Vincom · Phòng 2', showtime: '26/11/2025 · 10:00', seats: 2, total: 110000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' },
  { code: 'BKMIC9MH403KTM4', customer: 'Trần Minh Hoàng', movie: 'Pháo hoa lúc bình minh', location: 'CGV Vincom · Phòng 3', showtime: '26/11/2025 · 14:30', seats: 3, total: 165000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' },
  { code: 'BKMICAQA504CX02', customer: 'Hạ Quỳnh Như', movie: 'Những mảnh ghép cảm xúc 2', location: 'CGV Vincom · Phòng 1', showtime: '27/11/2025 · 15:00', seats: 2, total: 140000, ticket: 'Chờ xác nhận', payment: 'Chờ thanh toán' },
  { code: 'BKMICATN605KFP4', customer: 'Nguyễn Thảo Nhi', movie: 'Kung Fu Panda 4', location: 'CGV Vincom · Phòng 2', showtime: '27/11/2025 · 17:15', seats: 4, total: 280000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' },
  { code: 'BKMICBHN706KTM4', customer: 'Lê Yến Mai', movie: 'Kẻ trộm mặt trăng 4', location: 'CGV Vincom · Phòng 3', showtime: '28/11/2025 · 09:45', seats: 2, total: 110000, ticket: 'Chờ xác nhận', payment: 'Chờ thanh toán' },
  { code: 'BKMICBML807CX02', customer: 'Vũ Thị Minh Anh', movie: 'Marnie yêu dấu', location: 'CGV Vincom · Phòng 1', showtime: '28/11/2025 · 18:30', seats: 3, total: 270000, ticket: 'Đã xác nhận', payment: 'Đã thanh toán' }
];
  const theaters = [
    { id: '1', name: 'Galaxy Cinema Hanoi Centre', prefix: 'GL', seats: [100, 150, 200, 250, 300] },
    { id: '2', name: 'Lotte Cinema Tây Hồ', prefix: 'LT', seats: [100, 150, 200, 250, 300] },
    { id: '3', name: 'CGV Vincom Trần Duy Hưng', prefix: 'CGV', seats: [100, 150, 200, 250, 300] }
  ];
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  function read(key, fallback) {
    const saved = sessionStorage.getItem(key);
    const value = saved === null ? fallback : JSON.parse(saved);
    if (!Array.isArray(value)) throw new Error('Dữ liệu lưu không hợp lệ: ' + key);
    return value;
  }
  function movieStatus(movie, date = today()) {
    if (movie.date > date) return 'soon';
    const daysSinceRelease = (Date.parse(date) - Date.parse(movie.date)) / 86400000;
    return daysSinceRelease <= 21 ? 'showing' : 'ended';
  }
  window.cinemaState = {
    theaters, today, movieStatus,
    get movies() { return read('btl-movies', defaultMovies); },
    get screenings() { return read('btl-screenings', []); },
    get bookings() { return read('btl-bookings', defaultBookings); },
    saveMovies(value) { sessionStorage.setItem('btl-movies', JSON.stringify(value)); },
    saveScreenings(value) { sessionStorage.setItem('btl-screenings', JSON.stringify(value)); }
  };
  window.cinemaState.screeningError = (show, movies = window.cinemaState.movies) => {
    const movie = movies.find(item => String(item.id) === show.movieId);
    const theater = theaters.find(item => item.id === show.theaterId);
    if (!movie || !theater || !Number.isInteger(show.room) || !theater.seats[show.room - 1] ||
        !Number.isFinite(show.price) || show.price < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(show.date) ||
        Number.isNaN(Date.parse(show.date)) ||
        new Date(show.date).toISOString().slice(0, 10) !== show.date ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(show.time)) return 'Vui lòng nhập đầy đủ dữ liệu hợp lệ.';
    if (show.date < movie.date || (movie.endDate && show.date > movie.endDate)) {
      return 'Ngày chiếu phải nằm trong thời gian khởi chiếu và kết thúc của phim.';
    }
    const minutes = time => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
    const start = Date.parse(show.date + 'T00:00:00') + minutes(show.time) * 60000;
    const end = start + movie.duration * 60000;
    const overlaps = window.cinemaState.screenings.some(other => {
      if (other.id === show.id || other.theaterId !== show.theaterId || other.room !== show.room) return false;
      const otherMovie = movies.find(item => String(item.id) === other.movieId);
      const otherStart = Date.parse(other.date + 'T00:00:00') + minutes(other.time) * 60000;
      return start < otherStart + (otherMovie?.duration || 0) * 60000 && end > otherStart;
    });
    return overlaps ? 'Phòng đã có suất chiếu trùng thời gian.' : '';
  };
  window.movieState = {
    get movies() { return window.cinemaState.movies; },
    getMovies() { return this.movies; },
    addMovie(movie) {
      if (!movie || typeof movie.title !== 'string' || !movie.title.trim()) return;
      window.cinemaState.saveMovies([...this.movies, movie]);
    }
  };
})();
