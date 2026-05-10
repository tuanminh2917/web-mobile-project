
---

## 1. ASSETS (CSS)

### `style.css` (MỚI)
File theme chính của toàn bộ frontend:
- **CSS variables**: `--primary` (đỏ), `--secondary` (xanh đậm), `--accent` (vàng), `--bg-dark`, `--bg-card`... để dễ maintain theme dark
- **Reset CSS**: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- **Button system**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-sm`, `.btn-lg` - dùng xuyên suốt các page
- **Section title**: `.section-title` có gạch chân màu đỏ bên dưới
- **Custom scrollbar**: dark theme scrollbar

### `common.css` (ĐÃ SỬA)
Style cho **header** và **footer**:
- **Header**: sticky, `display: flex`, căn giữa logo + nav + account buttons
- **Nav menu**: các link `a` chuyển màu khi hover/active
- **Footer**: căn giữa, link list, copyright
- Tất cả đều dùng CSS variables từ `style.css`

### `responsive.css` (ĐÃ SỬA)
Breakpoint system:
- **Tablet (≥800px)**: `.grid-layout` chia 2 cột, nav ngang
- **Desktop (≥1200px)**: `.grid-layout` chia 4 cột
- **Mobile (<800px)**: nav toggle (hamburger menu) hiện, nav menu ẩn

### `main-page.css` (ĐÃ SỬA)
- **Carousel**: 100% width, max 1100px, mũi tên prev/next, dots phía dưới, ảnh cover cao 420px
- **Movie list**: grid layout, các card phim có border, hover lên cao + glow đỏ
- **Movie item**: ảnh 260px, title + genre + duration, `border-radius: 10px`

### `login.css` (ĐÃ SỬA)
- Container 380px, dark card, centered
- Input fields dark background, focus border đỏ
- Checkbox "ghi nhớ", nút đỏ, link "Đăng ký ngay"
- Alert error styling

### `register.css` (ĐÃ SỬA)
- Container 420px, 2-column form row (`flex-1` / `flex-2`)
- Các field: Full Name + DOB, Email + Phone, Username, Password, Confirm Password
- Giống login CSS pattern

### `movie-detail.css` (MỚI)
- **Layout**: flex 2 cột (poster 300px + info flex-1), xuống hàng trên mobile
- **Movie meta tags**: genre, censorship, duration, rating dạng badge
- **Date tabs**: horizontal scroll, tab active đỏ, hiển thị thứ + ngày
- **Showtime grid**: các nút giờ chiếu dạng card, có giờ + giá, hover glow
- **Comment section**: star rating radio + textarea + comment list

### `showtime.css` (MỚI)
- **Movie filter**: select dropdown
- **Date tabs**: giống movie-detail
- **Screening cards**: flex (thumbnail 80x110 + info + time/price), mỗi card là một suất chiếu, hover border đỏ, có nút "Chọn ghế"

### `seat-selection.css` (MỚI)
- **Screen indicator**: gradient đỏ mô phỏng màn hình chiếu
- **Seat grid**: mỗi ghế là 38x38px `div`, 3 loại (Regular: border xám, VIP: border vàng, Couple: rộng 82px hồng)
- **Trạng thái ghế**: `.selected` (xanh), `.occupied` (đỏ mờ, `cursor: not-allowed`)
- **Legend**: giải thích các loại ghế, responsive
- **Seat summary**: hiển thị danh sách ghế đã chọn + tổng tiền

### `checkout.css` (MỚI)
- **Grid 2 cột**: thông tin đặt vé + QR payment
- **Info rows**: key-value với giá vàng
- **QR placeholder**: 220x220, viền dashed, chứa ảnh QR
- **Payment button**: full width, primary

### `my-tickets.css` (MỚI)
- **Ticket cards**: flex (poster + info + status), border hover đỏ
- **Status badges**: 3 màu (paid=xanh, pending=cam, canceled=đỏ)
- Responsive: xếp dọc trên mobile

### `contact.css` (MỚI)
- **Grid 2 cột**: form + thông tin
- **Form inputs**: dark field, focus đỏ
- **Info items**: icon circle + text (địa chỉ, phone, email, giờ làm việc)

### `admin.css` (MỚI)
- **Layout**: `flex` sidebar 240px + content flex-1
- **Sidebar**: nav items, icon + text, active border đỏ
- **Stats grid**: `auto-fit` cards (min 220px)
- **Admin table**: full width, thead uppercase, striped hover rows
- **Badges**: 3 màu (active=xanh, soon=cam, inactive=đỏ)
- **Toolbar**: search + add button
- **Responsive**: sidebar thu về 60px, ẩn text

---

## 2. JAVASCRIPT

### `carousel.js`
```js
// Auto-slide 4s, dừng khi hover
// Nút prev/next, dots click
// goToSlide() với infinite loop
```

### `seat-map.js` - Class `SeatMap`
```js
class SeatMap(containerSelector, options)
// - constructor: nhận rows, seatsPerRow, occupiedSeats, seatTypes, giá
// - render(): vẽ màn hình + grid ghế + legend + summary
// - getSeatType(): logic phân loại ghế (hàng cuối=đôi, giữa=VIP, còn lại=thường)
// - bindEvents(): click chọn/bỏ chọn, max 8 ghế
// - renderSummary(): cập nhật danh sách + tổng tiền
// - getSelectedSeats(): trả về mảng ghế đã chọn
// - getTotal(): tổng tiền
```

### `main.js`
```js
// - Date tabs: toggle active
// - Showtime buttons: toggle selected
// - Nav toggle: hamburger menu mobile
// - Ad popup: localStorage check, hiện sau 2s, dismiss
// - View counter: animation đếm số
```

---

## 3. COMPONENTS (EJS)

### `header.ejs`
- **Logo**: `<span>C</span>inema`
- **Nav**: Trang chủ, Phim, Lịch chiếu, Liên hệ, Giới thiệu - active page highlight
- **Account section**: nếu `user` tồn tại -> hiển thị tên + "Vé của tôi" + "Admin" (nếu role Admin) + "Đăng xuất" | ngược lại -> "Đăng nhập" + "Đăng ký"
- **Hamburger**: button `.nav-toggle` cho mobile

### `footer.ejs`
- 5 links: Trang chủ, Phim, Lịch chiếu, Liên hệ, Giới thiệu
- Copyright 2026

---

## 4. PAGES (EJS - Customer)

### `main-page.ejs`
- **Carousel**: render từ `banners` array (hoặc fallback 3 slides mẫu)
- **Now Showing**: grid movie cards từ `nowShowing`, mỗi card link đến `/movies/:id`
- **Coming Soon**: tương tự từ `comingSoon`
- Include carousel.js + main.js

### `login.ejs`
- Form POST `/login`: username + password + remember checkbox
- Hiển thị `error` nếu có
- Footer link: Chưa có tài khoản? Đăng ký

### `register.ejs`
- Form POST `/register`: fullname, dob, email, phone, username, password, confirm_password
- 2-column layout cho các field
- Footer link: Đã có tài khoản? Đăng nhập

### `movie-detail.ejs`
- Poster + info (title, censorship, genre, duration, languages, rating, director, actor, release date)
- **Date tabs**: dynamic từ `dates` array
- **Showtimes**: grouped by room, mỗi phòng có grid giờ chiếu, link đến `/book/:screeningID`
- **Comments**: form đánh giá (sao 1-5 + text) nếu đã login, list comments từ `comments`
- Fallback data mẫu khi không có dữ liệu

### `showtime.ejs`
- **Movie filter**: select dropdown lọc theo MovieID
- **Date tabs**: chọn ngày
- **Screening list**: cards mỗi suất chiếu (poster, title, room, time, price), nút "Chọn ghế"

### `seat-selection.ejs`
- Sử dụng `SeatMap` class để render sơ đồ ghế
- Dữ liệu từ backend: `occupiedSeats`, `seatTypes`, `rows`, `seatsPerRow`, giá
- Form submit: serialize selected seats thành JSON + total, POST `/book/:id/confirm`
- Nút thanh toán disabled khi chưa chọn ghế

### `checkout.ejs`
- **Info section**: phim, phòng, suất, ghế, từng loại ghế + giá, tổng cộng
- **QR section**: placeholder QR, nội dung CK "BOOKING{ID}", nút "Xác nhận đã thanh toán"
- Timer note: "Vé sẽ được giữ trong 10 phút"

### `my-tickets.ejs`
- Loop `bookings`: mỗi card = poster + thông tin + status badge
- 3 trạng thái: Paid (xanh) + nút "Xem vé", Pending (cam) + nút "Thanh toán", Canceled (đỏ)
- Nếu không có vé: empty state với nút "Xem phim ngay"

### `contact.ejs`
- **Form**: POST `/contact` (senderName, senderEmail, subject, message)
- **Info**: 4 mục (địa chỉ 87 Láng Hạ, phone, email, giờ làm việc 08-23)

### `about.ejs`
- **Giới thiệu**: Cinema Booking System
- **Hệ thống phòng**: 5 phòng (2 lớn, 3 nhỏ), stats bar (lượt xem animation, số phòng)
- **Quy trình**: 4 bước (Chọn phim -> Suất -> Ghế -> Thanh toán)
- **Liên hệ**: địa chỉ, phone, email

---

## 5. PAGES (EJS - Admin)

### `dashboard.ejs`
- **Sidebar**: Dashboard, Quản lý phim, Suất chiếu, Đặt vé, Người dùng, Về trang chủ
- **Stats grid**: 6 cards (lượt xem, phim đang chiếu, đơn hôm nay, doanh thu hôm nay, người dùng, tổng doanh thu)
- **Recent bookings table**: BookingID, khách hàng, phim, ghế, tiền, status badge

### `movies.ejs`
- **Toolbar**: search + "Thêm phim" button
- **Table**: ID, poster thumbnail, title, genre, duration, status badge, actions (sửa/xóa)
- **Add Movie Modal**: form 2-column (title, genre, duration, release date, status select, description textarea)
- Search filter bằng JS

### `screenings.ejs`
- **Table**: ScreeningID, phim, phòng, start/end time, base price, actions
- **Add Screening Modal**: chọn phim (select từ movies data), chọn phòng (1-5), datetime-local, giá

### `bookings.ejs`
- **Table**: mã đơn, khách hàng, phim, suất, ghế, tổng tiền, status badge, actions (chi tiết/xác nhận)
- Search filter

### `users.ejs`
- **Table**: UserID, FullName, Email, Phone, Username, Role badge (Admin/Khách hàng), actions (sửa/xóa)
- Search filter