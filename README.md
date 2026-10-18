# Quản lý rạp chiếu phim

Ứng dụng demo quản trị rạp chiếu phim với giao diện tiếng Việt, được xây dựng bằng HTML, CSS và JavaScript thuần. Các chức năng gồm quản lý phim, thể loại, suất chiếu, danh sách rạp, sản phẩm và dữ liệu đặt vé mẫu.

Ứng dụng chạy hoàn toàn trên trình duyệt, chưa có backend hoặc máy chủ cơ sở dữ liệu.

## Chạy trên máy

Không cần biên dịch hay cài thư viện để chạy ứng dụng. Tại thư mục gốc của dự án, mở index.html và đăng nhập:

| Thông tin | Giá trị demo |
| --- | --- |
| Tên tài khoản | `utcadmin` |
| Mật khẩu | `12345678` |

Dùng `index.html` tại thư mục gốc để mở ứng dụng. Nếu mở trực tiếp trang đăng nhập, ứng dụng sẽ chuyển về trang này. Có thể mở các tệp HTML trực tiếp, nhưng chạy qua máy chủ cục bộ giúp tránh các hạn chế của trình duyệt về lưu trữ và trang nhúng.

Thông tin đăng nhập demo được kiểm tra bằng JavaScript trên trình duyệt. Cách này chỉ phục vụ trình diễn, không bảo mật được tài khoản thực tế.

## Chức năng

| Trang | Chức năng |
| --- | --- |
| Tổng quan | Hiển thị ngày giờ hiện tại, tổng số phim, số phim đang chiếu và số lượt đặt vé. |
| Phim | Hiển thị 13 phim mẫu; hỗ trợ tìm kiếm, lọc trạng thái, thêm, sửa và xóa phim. |
| Thể loại | Hỗ trợ tìm kiếm, thêm, sửa và xóa thể loại. |
| Suất chiếu | Hỗ trợ thêm, sửa, xóa và lọc suất chiếu theo ngày, phim và rạp. Kiểm tra ngày khởi chiếu, phòng hợp lệ và các suất chiếu trùng thời gian. |
| Rạp chiếu | Hiển thị thông tin liên hệ của rạp, hỗ trợ tìm kiếm và thay đổi trạng thái. |
| Sản phẩm | Hỗ trợ tìm kiếm, lọc trạng thái, thêm, sửa và xóa đồ ăn, nước uống, combo. |
| Đặt vé | Hiển thị 9 lượt đặt vé mẫu; tìm kiếm theo mã đặt vé, khách hàng hoặc phim; sắp xếp theo ngày giờ chiếu, mới nhất lên đầu. |

Poster phim và ảnh sản phẩm hỗ trợ chọn tệp, kéo thả và xem trước ảnh. Các định dạng được chấp nhận là JPG, PNG và GIF, tối đa 5 MB mỗi ảnh.

Thanh điều hướng sử dụng các đường dẫn dạng hash như `#movies`, `#showtimes` và `#booking`. Mỗi trang được tải trong một iframe. Nhấn vào ngày khởi chiếu của phim sẽ mở trang suất chiếu với phim và ngày tương ứng được chọn sẵn.

## Dữ liệu demo và cách lưu trữ

- Phim, thể loại và suất chiếu sử dụng `sessionStorage` để chia sẻ thay đổi giữa các trang trong cùng một tab.
- Tải lại ứng dụng từ trang gốc sẽ đưa dữ liệu phim, suất chiếu, đặt vé và thể loại về mặc định. Trạng thái đăng nhập được giữ đến khi đăng xuất hoặc phiên trình duyệt kết thúc.
- Sản phẩm được lưu trong bộ nhớ. Rời trang Sản phẩm rồi mở lại sẽ làm mất các thay đổi.
- Thay đổi trạng thái rạp chỉ có hiệu lực tạm thời trên giao diện.
- Các lượt đặt vé là dữ liệu mẫu riêng, chưa liên kết với lịch suất chiếu có thể chỉnh sửa. Nhấn vào mã đặt vé hiện chỉ mở thông báo, chưa có trang chi tiết.
- Ảnh được chọn được đọc dưới dạng data URL, không tải lên máy chủ. Poster có dung lượng lớn có thể làm đầy bộ nhớ lưu trữ của trình duyệt.
- Trạng thái phim được tính theo ngày khởi chiếu: sắp chiếu trước ngày khởi chiếu, đang chiếu trong 21 ngày đầu, sau đó ngừng chiếu. Đây là quy tắc demo, không phải lịch chiếu thực tế của rạp.
- Điểm đánh giá được lưu cố định, chưa tự cập nhật từ IMDb. Nguồn poster và điểm đánh giá được ghi trong [tệp nguồn ảnh](pages/movies/images/sources.md).

Google Fonts, Bootstrap Icons và một số ảnh sản phẩm mẫu được tải từ website bên ngoài. Poster phim và ảnh nền đăng nhập được lưu sẵn trong dự án.

## Cấu trúc dự án

```text
BTL/
├── index.html              # Khung ứng dụng và thanh điều hướng
├── app.js                  # Điều hướng, đăng nhập demo, trao đổi với iframe
├── shared-state.js         # Dữ liệu mẫu, lưu trữ, kiểm tra suất chiếu
├── styles.css              # Bố cục ứng dụng
├── control.css             # Kiểu hiển thị các điều khiển dùng chung
├── form-dialog.js          # Xử lý hộp thoại dùng chung
├── form-dialog.css         # Kiểu hiển thị hộp thoại dùng chung
├── pages/
│   ├── lam/
│   │   ├── login/          # Trang đăng nhập và ảnh nền
│   │   └── tongquan/       # Trang tổng quan
│   ├── movies/             # Phim, thể loại và poster
│   ├── doanthai/           # Suất chiếu và rạp chiếu
│   ├── booking/            # Danh sách đặt vé mẫu
│   └── products/           # Sản phẩm
└── tests/                  # Kiểm thử bằng Node.js và Playwright
```

Chỉnh sửa `shared-state.js` để thay đổi dữ liệu phim và đặt vé mặc định. Dữ liệu sản phẩm ban đầu nằm trong `pages/products/products.js`.

Các bài kiểm thử kiểm tra dữ liệu dùng chung, tính hợp lệ của suất chiếu, thứ tự đặt vé, hộp thoại, chọn ảnh, kéo thả và kiểm tra định dạng/dung lượng ảnh. Kiểm thử trình duyệt mở các tệp HTML cục bộ nên không cần khởi động máy chủ web.

Để dùng Chrome đã cài trên máy thay cho Chromium của Playwright, đặt biến môi trường `CHROME_PATH` thành đường dẫn tới tệp thực thi Chrome khi chạy bài kiểm thử trình duyệt.

