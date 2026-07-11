# BÁO CÁO ĐỒ ÁN — Cinema Booking System

---

## 1. CÁC CHỨC NĂNG

### Nhóm 1: Public (Không cần đăng nhập)

| STT | Chức năng | Web | Mobile | Mô tả |
|:--:|-----------|:---:|:------:|-------|
| 1 | Trang chủ | `/` | `(tabs)/main-page` | Carousel banner, danh sách phim đang chiếu & sắp chiếu |
| 2 | Danh sách phim | `/movies` | `(tabs)/main-page` | Lọc phim theo trạng thái (Đang chiếu / Sắp chiếu) |
| 3 | Chi tiết phim | `/movies/:id` | `movie/[id]` | Poster, thông tin, lịch chiếu theo ngày, đánh giá + bình luận |
| 4 | Lịch chiếu | `/showtime` | `(tabs)/schedule` | Suất chiếu 5 ngày tới, lọc theo phim |
| 5 | Giới thiệu | `/about` | — | Thông tin rạp, quy trình đặt vé, thống kê |
| 6 | Liên hệ | `/contact` | `(tabs)/contact` | Form gửi liên hệ + thông tin rạp |
| 7 | Đăng nhập | `/login` | `(tabs)/account` | Xác thực tài khoản |
| 8 | Đăng ký | `/register` | `(tabs)/account` | Tạo tài khoản mới |

### Nhóm 2: User (Đã đăng nhập)

| STT | Chức năng | Web | Mobile | Mô tả |
|:--:|-----------|:---:|:------:|-------|
| 1 | Chọn ghế | `/book/:id` | `book/[id]` | Sơ đồ phòng tương tác, chọn ghế (tối đa 8) |
| 2 | Thanh toán | `/checkout/:id` | `checkout/[id]` | Tổng kết đơn hàng, QR thanh toán, countdown 10 phút |
| 3 | Vé của tôi | `/my-tickets` | `(tabs)/account` | Lịch sử đặt vé, trạng thái vé, xem chi tiết |
| 4 | Bình luận phim | `POST /movies/:id/comment` | `movie/[id]` | Đánh giá sao + nhận xét |

### Nhóm 3: Admin

| STT | Chức năng | Route | Mô tả |
|:--:|-----------|-------|-------|
| 1 | Dashboard | `/admin/dashboard` | Thống kê: lượt xem, phim đang chiếu, đơn/doanh thu hôm nay, tổng doanh thu |
| 2 | Quản lý phim | `/admin/movies` | CRUD phim: thêm, sửa, xóa, tìm kiếm |
| 3 | Quản lý suất chiếu | `/admin/screenings` | Thêm suất chiếu, kiểm tra trùng lịch |
| 4 | Quản lý đặt vé | `/admin/bookings` | Xem tất cả đơn đặt vé |
| 5 | Quản lý người dùng | `/admin/users` | Xem danh sách người dùng |
| 6 | Quản lý bình luận | `/admin/comments` | Duyệt/ẩn/xóa bình luận |
| 7 | Quản lý quảng cáo | `/admin/advertisements` | CRUD quảng cáo + bật/tắt |
| 8 | Quản lý liên hệ | `/admin/contact` | Xem/xóa tin nhắn liên hệ |

---

## 2. MỨC ĐỘ HOÀN THIỆN

### Web Frontend (EJS + CSS + JS)

| Thành phần | Mức độ | Ghi chú |
|-----------|:------:|---------|
| Giao diện công khai (13 trang) | 95% | Đầy đủ các trang, responsive, dark theme |
| Giao diện Admin (8 trang) | 90% | Dashboard stats, CRUD phim/quảng cáo, duyệt comment |
| Carousel / Banner | 100% | Auto-slide 4s, hover dừng, dots, prev/next |
| Sơ đồ chọn ghế | 95% | 3 loại ghế (Regular/VIP/Couple), tương tác click, max 8 ghế |
| Thanh toán | 85% | Có QR placeholder, countdown, nhưng chưa tích hợp cổng thanh toán thật |
| Responsive | 90% | Breakpoints 800px / 1200px, hamburger menu mobile |

### Backend (Express + MySQL)

| Thành phần | Mức độ | Ghi chú |
|-----------|:------:|---------|
| Xác thực (Login/Register) | 100% | Session-based, bcrypt, phân quyền Admin/Client |
| API phim & suất chiếu | 100% | CRUD, lọc, phân trang giới hạn |
| API đặt vé | 95% | Chọn ghế, tạo booking+ticket, kiểm tra ghế trùng |
| API Admin | 90% | Thiếu update/delete screening |
| Middleware | 100% | Session, view counter, static files, error handler |
| Cơ sở dữ liệu | 100% | 11 tables, seed data, indexes |

### Mobile App (React Native / Expo)

| Thành phần | Mức độ | Ghi chú |
|-----------|:------:|---------|
| Các màn hình chính | 85% | Main, Schedule, Contact, Account, Movie Detail, Seat Booking, Checkout |
| Tương tác chọn ghế | 90% | SeatMap component, tương tự web |
| Xác thực | 80% | AsyncStorage, login/register form |
| Admin | 0% | Mobile không có admin |
| Gọi API | 75% | Dùng mock data fallback khi backend offline |

### Tổng quan

| Hạng mục | Mức độ |
|----------|:------:|
| **Web** (Customer + Admin) | **~92%** |
| **Mobile App** (Customer) | **~80%** |
| **Backend API** | **~95%** |
| **Database** | **~100%** |
| **Tổng thể dự án** | **~90%** |

---

## 3. PHÂN CÔNG NHIỆM VỤ



---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG

### Yêu cầu hệ thống

- **Node.js** >= 18
- **MySQL** 8.0+
- **npm** >= 9

### Cài đặt và chạy Web

```bash
# 1. Clone hoặc giải nén project
cd web-mobile-project

# 2. Cài dependencies
npm install

# 3. Tạo database
# Mở MySQL console hoặc MySQL Workbench, chạy:
#   source backend/database/init.sql
# Hoặc dùng npm script:
npm run db:init

# 4. Chạy server (production)
npm start

# 5. Hoặc chạy dev mode (tự động reload)
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

### Tài khoản mẫu

| Vai trò | Tài khoản | Mật khẩu |
|---------|-----------|:--------:|
| **Admin** | `admin01` | `admin123` |
| **Client** | `client01` | `client123` |

### Cấu hình database

File: `backend/database/db.js`

```js
host: 'localhost'
user: 'root'
password: ''
database: 'cinema_management'
```

Thay đổi nếu MySQL của bạn có user/password khác.

### Cài đặt và chạy Mobile App (React Native / Expo)

```bash
# 1. Vào thư mục mobile-app
cd mobile-app

# 2. Cài dependencies
npm install

# 3. Chạy app 
npx start
```

Quét QR code bằng app Expo Go trên điện thoại, hoặc bấm `w` để mở bản web, hoặc bấm `a` để Expo CLI sẽ tự động phát hiện máy ảo Android đang chạy của bạn.

or npm run android để khởi động ứng dụng cho Android luôn.

### Hướng dẫn sử dụng cơ bản

1. **Khách**: Vào trang chủ → xem phim đang chiếu → chọn phim → xem lịch chiếu → đăng nhập/đăng ký khi đặt vé
2. **User**: Đăng nhập → chọn suất chiếu → chọn ghế → thanh toán (mô phỏng) → xem vé trong "Vé của tôi"
3. **Admin**: Đăng nhập với `admin01` → vào `/admin/dashboard` → quản lý phim, suất chiếu, bình luận, quảng cáo

### Cấu trúc thư mục chính

```
web-mobile-project/
├── backend/               # Server Express.js
│   ├── server.js          # Entry point
│   ├── routes/            # Route handlers
│   │   ├── auth.js        # Login/Register/Logout
│   │   ├── movies.js      # Movies/Showtime/Comments
│   │   ├── bookings.js    # Seat selection/Checkout
│   │   ├── admin.js       # Admin CRUD
│   │   └── contact.js     # Contact form
│   └── database/
│       ├── db.js          # MySQL connection pool
│       └── init.sql       # Schema + seed data
├── frontend-web/          # Web frontend
│   └── src/
│       ├── pages/         # EJS views (13 customer + 8 admin)
│       ├── components/    # Header, Footer, Popup
│       ├── assets/        # CSS files + images
│       └── js/            # Client JS (carousel, seat-map, main)
├── mobile-app/            # React Native / Expo app
│   └── src/
│       ├── app/           # Expo Router screens
│       ├── components/    # Reusable components
│       └── services/      # API calls
└── database/              # Backup SQL scripts
```
