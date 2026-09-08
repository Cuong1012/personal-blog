# 🚀 DevLog - Trang Blog Cá Nhân Hiện Đại

Trang blog cá nhân tĩnh được xây dựng với HTML5, CSS3 và JavaScript thuần. Tối ưu trải nghiệm đọc, hỗ trợ Dark/Light mode, tìm kiếm bài viết thời gian thực, lọc theo danh mục và xem chi tiết bài viết dưới dạng modal tiện lợi.

Dự án tương thích 100% với **GitHub Pages** (Hosting miễn phí trọn đời).

---

## 🌟 Tính Năng Nổi Bật

- **Chế độ Sáng / Tối (Dark / Light Mode)**: Chuyển đổi nhanh và tự động lưu trạng thái vào `localStorage`.
- **Bộ lọc & Tìm kiếm tức thì**: Lọc bài theo chuyên mục (AI, Lập trình, UI/Frontend, Đời sống) và tìm theo từ khóa.
- **Trình đọc bài viết (Interactive Reader)**: Xem chi tiết bài viết với banner, định dạng code block, trích dẫn nổi bật.
- **Responsive 100%**: Hiển thị hoàn hảo trên Điện thoại, Tablet và Máy tính.
- **Khu Vực Riêng Tư & Đăng Nhập Bảo Mật**: Truy cập nhật ký mật, ý tưởng dự án và tài khoản cá nhân thông qua trang `login.html` và `private.html`.
- **Không cần cài đặt**: Chỉ cần mở trực tiếp file `index.html` trên bất kỳ trình duyệt nào là hoạt động ngay.

---

## 📁 Cấu Trúc Thư Mục

```text
personal-blog/
├── index.html              # Trang giao diện chính của Blog
├── form.html               # Trang Biểu mẫu Khai báo thông tin & Tải ảnh chân dung
├── login.html              # Trang Đăng nhập vào Khu vực riêng tư
├── private.html            # Trang Bảng điều khiển & Quản lý dữ liệu bí mật
├── google-form-script.js   # Script Google Sheets dành riêng cho Biểu mẫu khai báo
├── google-apps-script.js   # Script Google Sheets dành cho Khu vực riêng tư & Upload tệp
├── css/
│   ├── style.css           # Định dạng CSS chung, Dark Mode & Animation
│   ├── auth.css            # CSS cho trang Đăng nhập và Dashboard bảo mật
│   └── form.css            # CSS cho Biểu mẫu khai báo & Khung xem trước ảnh
├── js/
│   ├── app.js              # Dữ liệu bài viết công khai và logic blog
│   └── auth.js             # Xử lý xác thực, bảo mật phiên và lưu trữ
├── .gitignore              # Các file bỏ qua khi dùng Git
└── README.md               # Hướng dẫn chi tiết
```

---

## 🔐 Thông Tin Đăng Nhập Mặc Định

- Đường dẫn trang đăng nhập: `login.html` (hoặc bấm biểu tượng Ổ Khóa ở thanh Menu / Footer).
- **Tên đăng nhập**: `admin`
- **Mật khẩu**: `cuong1012`
*(Bạn có thể đổi mật khẩu bất kỳ lúc nào trực tiếp trong trang quản lý riêng tư).*

---

## 📝 Cách Thêm Bài Viết Mới

Mở file `js/app.js`, tìm đến mảng `BLOG_POSTS` và thêm bài viết mới theo định dạng:

```javascript
{
  id: 7, // Tăng ID lên 1
  title: "Tiêu đề bài viết của bạn",
  category: "dev", // dev | frontend | ai | life
  categoryName: "Lập trình & Tech",
  date: "07 Tháng 9, 2026",
  readTime: "5 phút đọc",
  thumbnail: "https://images.unsplash.com/...", // Link ảnh bìa
  excerpt: "Đoạn tóm tắt ngắn bài viết hiển thị ở trang chủ...",
  content: `
    <p>Nội dung chi tiết bài viết...</p>
    <h3>Tiêu đề phụ</h3>
    <p>Đoạn văn...</p>
  `
}
```

---

## 🌐 Các Bước Đưa Lên GitHub & Bật GitHub Pages

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên Repository (ví dụ: `my-blog` hoặc `personal-blog`).
3. Chọn chế độ **Public**.
4. **Không** tích chọn "Add a README file" (vì dự án đã có sẵn).
5. Bấm **Create repository**.

### Bước 2: Đẩy mã nguồn lên từ máy tính
Mở PowerShell hoặc Command Prompt tại thư mục `D:\git\personal-blog`:

```powershell
# 1. Đi đến thư mục dự án
cd D:\git\personal-blog

# 2. Đổi nhánh mặc định thành main
git branch -M main

# 3. Kết nối với repository GitHub của bạn (thay username và repo-name bằng của bạn)
git remote add origin https://github.com/<USERNAME>/<REPO-NAME>.git

# 4. Đẩy mã nguồn lên GitHub
git push -u origin main
```

### Bước 3: Kích hoạt GitHub Pages (Web online miễn phí)
1. Tại trang GitHub Repository vừa tải lên, bấm vào tab **Settings** (Cài đặt).
2. Ở thanh menu bên trái, chọn mục **Pages**.
3. Tại phần **Build and deployment > Branch**:
   - Chọn nhánh: `main`
   - Chọn thư mục: `/(root)`
   - Bấm **Save**.
4. Chờ khoảng 1-2 phút, GitHub sẽ hiển thị đường link trang web trực tuyến của bạn (dạng: `https://<USERNAME>.github.io/<REPO-NAME>/`).

---

## ☁️ Hướng Dẫn Kết Nối Google Sheets / Drive Làm Cơ Sở Dữ Liệu

1. Truy cập [sheets.new](https://sheets.new) để tạo 1 file Google Sheets mới trên Google Drive của bạn.
2. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions) > Apps Script**.
3. Mở tệp `google-apps-script.js` trong thư mục dự án, copy toàn bộ code và dán đè vào trình soạn thảo Apps Script.
4. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải > **Quản lý bản triển khai mới (New deployment)**:
   - Nhấp biểu tượng bánh răng ⚙️ > Chọn **Ứng dụng web (Web app)**.
   - **Thực thi dưới dạng**: `Tôi (Me)`.
   - **Ai có quyền truy cập**: `Bất kỳ ai (Anyone)`.
   - Bấm **Triển khai (Deploy)** và cấp quyền khi Google hỏi.
5. Sao chép đường link Web App (có đuôi `/exec`) nhận được.
6. Mở trang `private.html` trên web của bạn, bấm nút **"Cài Đặt Drive"**, dán link vào và bấm **"Kiểm Tra & Lưu"**.
   > 🎉 Từ nay, mọi ghi chú cá nhân và tệp tải lên sẽ tự động lưu trực tiếp vào Google Drive của bạn!

---

## 📁 Tính Năng Tải Tệp Trực Tiếp Lên Google Drive

1. Đăng nhập vào trang `private.html`, chuyển sang tab **"Tệp & Tài Liệu Drive"**.
2. Kéo thả file bất kỳ (ảnh, PDF, Word, Excel, ZIP) hoặc bấm để chọn tệp từ máy tính.
3. Tệp sẽ tự động được tải lên và lưu vào thư mục **`DevLog Uploads`** trên Google Drive của bạn.
4. Bạn có thể mở xem trực tiếp trên Google Drive hoặc sao chép link tệp để chia sẻ bất cứ lúc nào.

---

## 📋 Hướng Dẫn Kích Hoạt Form Khai Báo Thông Tin & Ảnh Chân Dung (`form.html`)

1. Mở [sheets.new](https://sheets.new) để tạo 1 file Google Sheets mới (Đặt tên ví dụ: `Danh Sách Khai Báo`).
2. Vào menu: **Tiện ích mở rộng (Extensions) > Apps Script**.
3. Mở tệp `google-form-script.js` trong thư mục dự án, copy toàn bộ code và dán vào Apps Script.
4. Bấm nút **Triển khai (Deploy) > Quản lý bản triển khai mới (New deployment)**:
   - Chọn loại: **Ứng dụng web (Web app)**.
   - **Thực thi dưới dạng**: `Tôi (Me)`.
   - **Ai có quyền truy cập**: `Bất kỳ ai (Anyone)` *(Để người lạ có thể gửi dữ liệu)*.
   - Nhấn **Triển khai** và cấp quyền.
5. Sao chép link Web App (có đuôi `/exec`).
6. Mở trang `form.html`, bấm nút **"⚙️ Cấu hình Google Sheet"** ở góc trên, dán link vào và bấm **"Lưu Cấu Hình"**.
   > 🎉 Giờ đây bất kỳ ai vào `form.html` điền thông tin và tải ảnh chân dung, dữ liệu sẽ tự động xuất hiện trong Google Sheet và ảnh sẽ nằm gọn trong thư mục `Anh_Chan_Dung` trên Google Drive của bạn!



