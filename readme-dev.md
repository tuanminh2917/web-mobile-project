# 🎬 Cinema Booking System - Developer Documentation

Tài liệu này cung cấp hướng dẫn chi tiết về cấu trúc mã nguồn, kiến trúc hệ thống và các giải pháp kỹ thuật dành cho dự án Hệ thống Đặt vé Xem phim.

---

## 🏗️ 1. Cấu trúc Thư mục Tổng thể (Monorepo)
Dự án được tổ chức theo mô hình Monorepo giúp quản lý tập trung và đồng bộ hóa giữa các thành phần:

- **/backend**: Server xử lý logic nghiệp vụ và cung cấp API.
- **/frontend-web**: Website dành cho khách hàng và quản trị viên (Admin).
- **/mobile-app**: Ứng dụng di động dành cho người dùng.
- **/database**: Chứa các bản thiết kế SQL (ID dạng chuỗi) và script khởi tạo.

---

## ⚙️ 2. Kiến trúc Backend (Layered Architecture)
Hệ thống Backend được chia thành các lớp chức năng riêng biệt nhằm đảm bảo tính bảo trì và mở rộng:

* **`controllers/`**: Tiếp nhận và điều phối các yêu cầu (Request) từ phía Client; chịu trách nhiệm định tuyến mà không xử lý logic trực tiếp.
* **`services/`**: Tầng xử lý logic nghiệp vụ chính như tính toán giá vé, kiểm tra tình trạng ghế của 5 phòng chiếu, và xử lý bộ đệm lượt xem.
* **`models/` / `repositories/`**: Thực hiện các truy vấn dữ liệu trực tiếp với Database.
* **`middlewares/`**: Chứa các bộ lọc bảo mật và xác thực (ví dụ: phân quyền Admin/User).
* **`routes/`**: Định nghĩa các endpoint API (ví dụ: `/api/movies`, `/api/booking`).

---

## 📱 3. Tổ chức Frontend (Web & Mobile)
Cấu trúc thư mục được đồng bộ hóa giữa Web và Mobile để tối ưu hóa quy trình phát triển:

* **`src/components/`**: Chứa các UI components dùng chung như nút bấm, thẻ phim, và thanh menu.
* **`src/pages/` (hoặc `screens/`)**: Các màn hình chức năng chính bao gồm Trang chủ, Trang đặt vé, và Dashboard quản trị.
* **`src/services/`**: Quản lý các hàm gọi API sang Backend; không xử lý logic nặng tại giao diện.
* **`src/assets/`**: Quản lý tài nguyên tĩnh như hình ảnh, logo và các tệp định dạng CSS.

---

## ⚡ 4. Giải pháp Kỹ thuật Đặc thù
Dựa trên yêu cầu nghiệp vụ, các giải pháp sau được ưu tiên triển khai[cite: 1]:

### 📈 Cơ chế Thống kê Lượt xem (View Count)
Để tối ưu hiệu năng và tránh ghi vào Database liên tục:
* **Ghi đệm (Buffering)**: Cập nhật lượt xem trực tiếp vào biến toàn cục (RAM) mỗi khi API được gọi.
* **Đồng bộ (Sync)**: Sử dụng tác vụ lập lịch để cộng dồn giá trị từ RAM vào Database sau mỗi 10 phút.

### 📐 Giao diện Đáp ứng (Responsive Design)
Frontend Web hỗ trợ hiển thị linh hoạt với các ngưỡng Breakpoints quy định[cite: 1]:
* **Tablet**: Tùy chỉnh Layout tại ngưỡng **800px**[cite: 1].
* **Desktop**: Tùy chỉnh Layout tại ngưỡng **1200px**[cite: 1].

### 🍪 Quản lý Trải nghiệm Người dùng
* **Popup Quảng cáo**: Sử dụng **Cookie** hoặc **LocalStorage** để lưu trạng thái đóng của người dùng, đảm bảo không hiển thị lại trong cùng một phiên[cite: 1].

---

## 🛠️ 5. Lưu ý Triển khai API
* Dữ liệu trao đổi phải tuân thủ định dạng **JSON chuẩn hóa**.
* Đảm bảo tính bảo mật tại các trang nội dung yêu cầu quyền **Admin**[cite: 1].