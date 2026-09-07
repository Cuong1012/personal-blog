# 🚀 DevLog - Trang Blog Cá Nhân Hiện Đại

Trang blog cá nhân tĩnh được xây dựng với HTML5, CSS3 và JavaScript thuần. Tối ưu trải nghiệm đọc, hỗ trợ Dark/Light mode, tìm kiếm bài viết thời gian thực, lọc theo danh mục và xem chi tiết bài viết dưới dạng modal tiện lợi.

Dự án tương thích 100% với **GitHub Pages** (Hosting miễn phí trọn đời).

---

## 🌟 Tính Năng Nổi Bật

- **Chế độ Sáng / Tối (Dark / Light Mode)**: Chuyển đổi nhanh và tự động lưu trạng thái vào `localStorage`.
- **Bộ lọc & Tìm kiếm tức thì**: Lọc bài theo chuyên mục (AI, Lập trình, UI/Frontend, Đời sống) và tìm theo từ khóa.
- **Trình đọc bài viết (Interactive Reader)**: Xem chi tiết bài viết với banner, định dạng code block, trích dẫn nổi bật.
- **Responsive 100%**: Hiển thị hoàn hảo trên Điện thoại, Tablet và Máy tính.
- **Không cần cài đặt**: Chỉ cần mở trực tiếp file `index.html` trên bất kỳ trình duyệt nào là hoạt động ngay.

---

## 📁 Cấu Trúc Thư Mục

```text
personal-blog/
├── index.html        # Trang giao diện chính
├── css/
│   └── style.css     # Định dạng CSS, biến màu sắc, Dark Mode & Animation
├── js/
│   └── app.js        # Dữ liệu bài viết và logic tương tác
├── .gitignore        # Các file bỏ qua khi dùng Git
└── README.md         # Hướng dẫn chi tiết
```

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
