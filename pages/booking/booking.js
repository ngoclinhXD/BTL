(() => {
const bookings = [
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

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const statusClass = value => value.startsWith('Đã') ? 'status-success' : value.startsWith('Chờ') ? 'status-warning' : 'status-muted';

function init() {
  const search = document.getElementById('bookingSearch');
  const rows = document.getElementById('bookingRows');
  const empty = document.getElementById('bookingEmpty');
  const addBtn = document.getElementById('bookingAddBtn');

  function render(query = '') {
    const keyword = query.trim().toLocaleLowerCase('vi');
    const result = bookings.filter(item => [item.code, item.customer, item.movie].some(value => value.toLocaleLowerCase('vi').includes(keyword)));

    rows.innerHTML = result.map(item => `
      <tr>
        <td><a class="booking-code" href="#booking" data-booking-code="${item.code}">${item.code}</a></td>
        <td><span class="customer-name">${item.customer}</span></td>
        <td><span class="movie-title">${item.movie}</span></td>
        <td>${item.location}</td>
        <td class="showtime">${item.showtime}</td>
        <td>${item.seats} ghế</td>
        <td class="money">${money.format(item.total)}</td>
        <td><span class="status ${statusClass(item.ticket)}">${item.ticket}</span></td>
        <td><span class="status ${statusClass(item.payment)}">${item.payment}</span></td>
      </tr>`).join('');

    empty.hidden = result.length > 0;
  }

  const onSearch = event => render(event.target.value);
  const onCodeClick = event => {
    const link = event.target.closest('[data-booking-code]');
    if (!link) return;
    event.preventDefault();
    alert(`Chi tiết đặt vé ${link.dataset.bookingCode}`);
  };
  const onAddClick = () => alert('Tạo đặt vé mới');

  search.addEventListener('input', onSearch);
  rows.addEventListener('click', onCodeClick);
  addBtn.addEventListener('click', onAddClick);
  render();

  return () => {
    search.removeEventListener('input', onSearch);
    rows.removeEventListener('click', onCodeClick);
    addBtn.removeEventListener('click', onAddClick);
  };
}

init();
})();
