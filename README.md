# Quản lý bán vé xem phim

Khu vực `/admin/` là ứng dụng demo quản trị rạp chiếu phim với giao diện tiếng Việt, được xây dựng bằng HTML, CSS và JavaScript thuần. Các chức năng gồm quản lý phim, thể loại, suất chiếu, phòng chiếu, sản phẩm và dữ liệu đặt vé mẫu.

Trang `/` là giao diện khách hàng tham khảo bản desktop của Trung tâm Chiếu phim Giao thông vận tải (UCC), không có popup quảng cáo. Dữ liệu nghiệp vụ nằm trong `shared-state.js` ở thư mục gốc để cả hai phía cùng sử dụng. Ứng dụng chưa có backend hoặc máy chủ cơ sở dữ liệu.

## Chạy trên máy

Không cần biên dịch hay cài thư viện để chạy ứng dụng. Tại thư mục gốc của dự án, khởi động máy chủ web cục bộ:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở [website khách hàng](http://localhost:8000/) hoặc [trang quản trị](http://localhost:8000/admin/). Tài khoản demo của quản trị:

| Thông tin     | Giá trị demo |
| ------------- | ------------ |
| Tên tài khoản | `utcadmin`   |
| Mật khẩu      | `12345678`   |

Chạy qua localhost từ thư mục gốc `BTL`. Các trang có địa chỉ riêng như `/admin/login/`, `/admin/movies/`, `/admin/showtimes/` và `/admin/booking/`; không mở trực tiếp bằng `file://`.

Thông tin đăng nhập demo được kiểm tra bằng JavaScript trên trình duyệt. Cách này chỉ phục vụ trình diễn, không bảo mật được tài khoản thực tế.

## Chức năng

| Trang      | Chức năng                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tổng quan  | Hiển thị ngày giờ hiện tại, tổng số phim, số phim đang chiếu và số lượt đặt vé.                                                                                 |
| Phim       | Hiển thị 19 phim mẫu; hỗ trợ tìm kiếm, lọc trạng thái, thêm, sửa và xóa phim.                                                                                   |
| Thể loại   | Hỗ trợ tìm kiếm, thêm, sửa và xóa thể loại.                                                                                                                     |
| Suất chiếu | Hỗ trợ thêm, sửa, xóa và lọc suất chiếu theo ngày và phim. Chọn trực tiếp Phòng 1–15. Kiểm tra ngày khởi chiếu, phòng hợp lệ và các suất chiếu trùng thời gian. |
| Sản phẩm   | Hỗ trợ tìm kiếm, lọc trạng thái, thêm, sửa và xóa đồ ăn, nước uống, combo.                                                                                      |
| Đặt vé     | Hiển thị 9 lượt đặt vé mẫu; tìm kiếm theo mã đặt vé, khách hàng hoặc phim; sắp xếp theo ngày giờ chiếu, mới nhất lên đầu.                                       |

Poster phim và ảnh sản phẩm hỗ trợ chọn tệp, kéo thả và xem trước ảnh. Các định dạng được chấp nhận là JPG, PNG và GIF, tối đa 5 MB mỗi ảnh.

Thanh điều hướng dùng liên kết tới từng trang HTML trong thư mục `/admin/`, không dùng iframe hoặc điều hướng hash. Nhấn vào ngày khởi chiếu của phim sẽ mở trang suất chiếu với phim và ngày tương ứng được chọn sẵn.

## Giao diện khách hàng

Menu chính gồm Trang chủ, Lịch chiếu, Giá vé và Giới thiệu. Đã gỡ hoàn toàn các trang Tin tức, Khuyến mãi và Liên hoan phim cùng dữ liệu và ảnh liên quan.

| Đường dẫn               | Nội dung                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                     | Banner có nút chuyển, phim đang chiếu/sắp chiếu.                                                                                                         |
| `/movies/`              | Tìm phim, chọn trạng thái; lịch chiếu hôm nay hiển thị giờ, phòng và giá vé. Suất chiếu đọc từ cùng dữ liệu admin.                                       |
| `/movies/detail/?id=15` | Thông tin phim, trailer khi có và lịch chiếu.                                                                                                            |
| `/ticket-price/`        | Ảnh bảng giá gốc, có thể mở riêng để phóng to.                                                                                                           |
| `/about/`               | Giới thiệu, dịch vụ, liên hệ và hỏi đáp.                                                                                                                 |
| `/login/`, `/register/` | Đăng ký, đăng nhập và đăng xuất khách hàng bằng tài khoản demo lưu trên trình duyệt. Trang đăng nhập có nút “Bạn thuộc UCC?” dẫn tới đăng nhập quản trị. |

Website đã có đăng ký/đăng nhập, chọn ghế và tạo vé với thanh toán mô phỏng; không thu tiền thật. Không gọi API nghiệp vụ UCC. Danh mục phim giữ cùng dữ liệu với admin; lịch chiếu có sẵn suất mẫu và dùng chung với admin. `cinemaState.site` trong `shared-state.js` chứa banner, điều hướng, bảng giá và thông tin rạp phục vụ giao diện user. Các dữ liệu nội dung này chưa có màn hình chỉnh sửa trong admin.

Nguồn tài nguyên và ngày tham khảo được ghi tại [assets/ucc/sources.md](assets/ucc/sources.md). Ảnh và font được lưu cục bộ. Giao diện ưu tiên desktop và thích ứng ở màn hình nhỏ.

## Dữ liệu demo và cách lưu trữ

- Phim, thể loại, suất chiếu, vé, sản phẩm và rạp/phòng được đọc và lưu qua `cinemaState` trong `shared-state.js`. Các trang không tự chứa dữ liệu mẫu hoặc thao tác trực tiếp với kho dữ liệu.
- Dữ liệu sử dụng `localStorage`, được giữ khi tải lại trang và dùng chung giữa các tab trên cùng nguồn (cùng giao thức, hostname và cổng). Trang đã mở sẽ đọc dữ liệu mới khi tải lại hoặc chuyển trang; chưa tự cập nhật giao diện theo thay đổi ở tab khác. Dữ liệu cũ trong `sessionStorage` được chuyển sang nếu kho mới chưa có dữ liệu tương ứng.
- Trạng thái mở/thu gọn sidebar quản trị được lưu dùng chung giữa các trang và đồng bộ giữa các tab trình duyệt.
- Đăng nhập demo vẫn dùng `sessionStorage` riêng từng tab và không phải cơ chế phân quyền an toàn trên máy chủ.
- Mỗi ngày khi mở trang, hệ thống bổ sung hai suất demo **10:00** và **19:30** cho các phim trong danh sách gán phòng còn đang chiếu. Giá vé lần lượt 75.000đ và 90.000đ. Mỗi ngày chỉ bổ sung một lần, giữ lịch sử, bỏ qua phim/phòng không tồn tại và giờ trùng suất admin; suất đã sửa hoặc xóa trong ngày được giữ nguyên. Ngày mới có lịch mẫu riêng, không phụ thuộc mốc 19/10/2026.
- Đã bỏ màn hình Rạp chiếu. Danh sách phòng được đánh số 1–15 từ dữ liệu cũ, giữ mã liên kết để không làm mất suất chiếu đã lưu. Vé chỉ hiển thị phòng, giữ nguyên dữ liệu lịch sử.
- Chín vé mẫu cũ được giữ nguyên. Vé tạo mới có mã suất, nhãn ghế và mã khách hàng, lưu chung `btl-bookings` để hiển thị trong admin. Nhấn mã vé trong admin hiện chỉ mở thông báo.
- Ảnh được chọn được đọc dưới dạng data URL, không tải lên máy chủ. Poster có dung lượng lớn có thể làm đầy bộ nhớ lưu trữ của trình duyệt.
- Trạng thái phim được tính theo ngày khởi chiếu: sắp chiếu trước ngày khởi chiếu, đang chiếu trong 21 ngày đầu, sau đó ngừng chiếu. Phim có mốc xác nhận đang chiếu (`showingThrough`) tiếp tục hiển thị đang chiếu đến hết mốc đó, sau đó áp dụng lại quy tắc 21 ngày. Đây là dữ liệu demo được cập nhật thủ công, không tự đồng bộ lịch rạp.
- Điểm đánh giá được lưu cố định, chưa tự cập nhật từ IMDb. Nguồn poster và điểm đánh giá được ghi trong [tệp nguồn ảnh](admin/movies/images/sources.md).

Google Fonts, Bootstrap Icons và một số ảnh sản phẩm mẫu được tải từ website bên ngoài. Poster phim và ảnh nền đăng nhập được lưu sẵn trong dự án.

## Cấu trúc dự án

```text
BTL/
├── index.html              # Trang chủ khách hàng
├── public.js               # Hiển thị và tương tác các trang user
├── public.css              # Giao diện user
├── movies/                 # Lịch chiếu và chi tiết phim
├── ticket-price/
├── about/
├── login/
├── register/
├── assets/ucc/             # Logo, font, ảnh tham khảo UCC và nguồn tài nguyên
├── shared-state.js         # Toàn bộ dữ liệu nghiệp vụ dùng chung và cách lưu/đọc
├── admin/
│   ├── index.html          # Đi tới trang tổng quan
│   ├── app.js              # Thanh điều hướng, kiểm tra đăng nhập, đăng xuất
│   ├── styles.css          # Giao diện quản trị dùng chung
│   ├── control.css
│   ├── form-dialog.js
│   ├── form-dialog.css
│   ├── login/
│   ├── home/
│   ├── movies/             # Phim và poster
│   ├── genres/
│   ├── showtimes/
│   ├── booking/
│   └── products/
└── tests/
```

Chỉnh sửa `shared-state.js` để thay đổi dữ liệu mặc định. API `cinemaState` cung cấp các thuộc tính `movies`, `genres`, `screenings`, `bookings`, `products`, `rooms` và các hàm lưu tương ứng (`saveMovies`, `saveGenres`, ...). Phía khách hàng có thể nạp cùng file này; không sao chép dữ liệu sang file riêng.

Các bài kiểm thử kiểm tra dữ liệu dùng chung, tính hợp lệ của suất chiếu, thứ tự đặt vé, hộp thoại, chọn ảnh, kéo thả và kiểm tra định dạng/dung lượng ảnh. Kiểm thử trình duyệt cần máy chủ localhost chạy trước. Mặc định kiểm thử dùng `http://127.0.0.1:8000/`; đặt `BASE_URL` để đổi địa chỉ.

Để dùng Chrome đã cài trên máy thay cho Chromium của Playwright, đặt biến môi trường `CHROME_PATH` thành đường dẫn tới tệp thực thi Chrome khi chạy bài kiểm thử trình duyệt.

Chạy các kiểm tra:

```sh
node tests/shared-state.test.js
node tests/upcoming-movies.test.js
node tests/catalog-refresh.test.js
node tests/demo-screenings.test.js
node tests/booking-sort.test.js
node tests/routes.test.js
node tests/sidebar-state.test.js
node tests/public-routes.test.js
node tests/public-ui.test.js
node tests/form-dialog.test.js
node tests/image-upload.test.js
```

Các bài `public-ui`, `form-dialog` và `image-upload` cần Playwright có sẵn và máy chủ localhost đang chạy. Dữ liệu trong `localStorage` chỉ dùng chung trên cùng trình duyệt và nguồn localhost, chưa chia sẻ giữa các máy hoặc người dùng.

Ngày 19/10/2026 bổ sung 4 phim sắp chiếu từ UCC: Clayface, Klara và Mặt Trời, Huyết Thống, Án Mạng Karaoke. Bản dữ liệu cũ được nhập bổ sung một lần, giữ phim đã chỉnh sửa; sau đó xóa phim ở admin sẽ không bị tự thêm lại. Ngày chiếu và thời lượng là thông tin UCC công bố tại thời điểm lấy dữ liệu, có thể thay đổi.

Ngày 19/10/2026 thay 6 phim cũ/tái chiếu bằng Án Mạng Xém Hoàn Hảo, Cá Voi Nuốt Chửng, Trái Tim Quái Thú, Lên Hương, Út Lan 2 và Bát Tiên! Truy Tìm Lưu Ly Đăng. Kho đã lưu được làm mới một lần: bỏ phim có ngày trước 2026 và các tựa tái chiếu cũ, xóa suất chiếu liên quan, giữ lịch sử vé và các phim còn lại. Xóa phim mới sau lần cập nhật sẽ không bị thêm lại. Các phim được xác nhận còn chiếu dùng mốc lịch rạp ngày 19–21/10/2026.

## Đăng ký và đăng nhập khách hàng

- `/register/`: nhập họ và tên trong một ô, số điện thoại, email, mật khẩu từ 8–128 ký tự, xác nhận mật khẩu và điều khoản sử dụng. Đăng ký thành công tự đăng nhập và về trang chủ.
- `/login/`: dùng email đã đăng ký (không phân biệt hoa thường) và mật khẩu. Header hiển thị tên và nút Đăng xuất, đồng bộ trạng thái giữa các tab.
- Tài khoản lưu trong `localStorage` tại `btl-customers`; mật khẩu dùng PBKDF2 SHA-256, 600.000 vòng với salt riêng, không lưu mật khẩu nguyên văn. Phiên khách lưu riêng tại `btl-customer-session`, không cấp quyền quản trị.
- Đây là xác thực demo trên trình duyệt, người dùng có thể sửa bộ nhớ để thay đổi phiên. Chỉ dùng thông tin thử nghiệm. Tài khoản không đồng bộ sang thiết bị hoặc trình duyệt khác; cần backend và phiên máy chủ để triển khai thật. Chạy bằng localhost hoặc HTTPS để dùng Web Crypto.
- Kiểm thử logic: `node tests/public-auth.test.js`.

Logic tài khoản và kiểm tra định dạng email nằm trong `shared-state.js`. Form đăng nhập/đăng ký báo lỗi email ngay dưới ô nhập, mật khẩu mặc định ẩn và có nút hiện/ẩn riêng cho từng ô. Kiểm tra email chỉ xác nhận định dạng, không xác minh hộp thư tồn tại.

## Nền phim và cuộn trang

Trang chi tiết dùng banner ngang của phim làm nền phủ tối; phim không có banner dùng poster. Các trang khách hàng dùng Lenis 1.3.27 (MIT), lưu cục bộ trong `assets/vendor/lenis/`, nguồn https://github.com/darkroomengineering/lenis. Cấu hình tại `public-scroll.js`; giữ cuộn cảm ứng mặc định, hỗ trợ liên kết trong trang và tắt hiệu ứng khi bật giảm chuyển động. Không áp dụng vào admin.

## Đặt vé demo

- Nhấn giờ chiếu ở Lịch chiếu hoặc Chi tiết phim để vào `/booking/?screening=...`. Khách chưa đăng nhập vẫn chọn ghế và xem bước thanh toán; chỉ khi xác nhận thanh toán mới chuyển sang đăng nhập. Đăng nhập hoặc đăng ký xong quay lại đúng bước, giữ ghế, phương thức và thời gian còn lại; không tự thanh toán.
- Tất cả 15 phòng có **124 ghế**: A–H mỗi hàng 14 ghế, I có 12 ghế. Dữ liệu phòng cũ được cập nhật một lần, giữ mã phòng và suất chiếu. Hàng D–H, số 3–12 là VIP; hàng I là ghế đôi chọn theo cặp.
- Giá thường bằng giá suất chiếu; VIP cộng 10.000đ mỗi ghế; đôi cộng 15.000đ mỗi ghế. Phí bằng 0, không có khuyến mãi, voucher hoặc giảm giá. Giá được tính lại tại `cinemaState.booking`, không lấy tổng tiền từ giao diện.
- Thời gian chọn ghế là 10 phút, giữ lựa chọn trong `sessionStorage` khi tải lại và đi đăng nhập. Đồng hồ không đồng nghĩa giữ chỗ: ghế được kiểm tra lại khi xác nhận. Ghế đã đặt tô xám, dấu × và khóa nút; trạng thái cập nhật giữa các tab.
- Chỉ có VNPay, MoMo và thẻ quốc tế. Đây là lựa chọn phương thức **mô phỏng**, không gọi cổng, không thu tiền và không nhập dữ liệu thẻ. Biên nhận nói rõ vé demo.
- Dữ liệu vé giữ `seatLabels`, `screeningId`, `customerId`, `requestId` và `paymentMode: demo`; kiểm tra đăng nhập, hạn chọn ghế, giá và ghế trùng trước khi lưu. Web Locks tuần tự hóa thao tác đặt giữa các tab có hỗ trợ; mã yêu cầu tránh tạo vé lặp khi gửi lại.
- Các tab và admin dùng cùng nguồn localhost. Chưa có khóa ghế hoặc đồng bộ giữa máy khác nhau; cần máy chủ trước khi bán vé thật. Vé mẫu cũ không có nhãn ghế nên không dùng để khóa sơ đồ ghế mới.
- Kiểm thử: `node tests/customer-booking.test.js`; kiểm thử giao diện bổ sung trong `tests/customer-booking-ui.test.js` (cần Playwright).

Nguồn ảnh `assets/booking/`: `screen.webp`, `vnpay.webp`, `momo.webp` do người dùng cung cấp từ Downloads ngày 20/10/2026.

Bảng Danh sách vé ở admin tự cập nhật khi tab khác lưu `btl-bookings`, giữ nguyên từ khóa tìm kiếm. Bấm xác nhận thanh toán demo khi đã đăng nhập sẽ lưu vé và hiện ngay ở tab admin cùng nguồn localhost.

## Ghế đặt sẵn và mã vé

Chỉ dùng chín khách mẫu gốc, không tạo thêm “Khách demo” cho từng suất. Chín vé gốc được gán vào một số suất trong ngày, ưu tiên phim cũ của khách nếu còn suất; các phim đã hết suất dùng suất mẫu còn trống. Giữ nguyên tên và số ghế của mỗi khách, tính lại tổng theo suất được gán. Ghế được đọc từ cùng `btl-bookings` với admin; các suất còn lại có thể trống hoàn toàn. Qua ngày chỉ chuyển các vé mẫu gốc còn tồn tại, không nhân bản và không khôi phục vé đã xóa. Các vé “Khách demo” sinh quá nhiều ở bản trước được dọn theo cờ `demoSeatSeed`; vé có tài khoản khách đặt được giữ nguyên.

Tất cả mã vé theo mẫu `UCC_DD_XXXXXXXXXX`: ngày tạo mã gồm hai chữ số, chuỗi ngẫu nhiên 10 ký tự A–Z và 0–9. Mã cũ được chuyển đổi một lần với ngày cập nhật; các thông tin vé khác giữ nguyên. `previousCodes` giữ liên kết biên nhận cũ đang mở. Vé mới và vé mẫu dùng cùng bộ tạo mã, kiểm tra tránh trùng kho hiện có.

Kiểm thử bổ sung: `node tests/demo-booked-seats.test.js`.

## Vé của tôi

Tab `/my-tickets/` hiện trong menu khi khách đăng nhập. Vé lọc theo `customerId` của tài khoản hiện tại, xếp mới nhất trước; không ghép theo tên hay đưa chín vé demo gốc vào tài khoản. Trang hiển thị mã vé, phim, ngày giờ, phòng, ghế, tổng tiền, trạng thái và phương thức thanh toán, có hướng dẫn khi chưa có vé. Đăng xuất ẩn vé và menu; thay đổi từ tab khác tự cập nhật. Nút ở biên nhận đặt thành công dẫn tới trang này. Kiểm thử: `node tests/my-tickets.test.js`.
