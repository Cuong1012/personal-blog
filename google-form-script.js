/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - THU THẬP THÔNG TIN & ẢNH CHÂN DUNG TỰ ĐỘNG
 * ===================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT 3 BƯỚC CỰC KỲ ĐƠN GIẢN (CHỈ MẤT 1 PHÚT):
 * 
 * Bước 1: Mở trình duyệt, vào link: https://sheets.new để tạo một file Google Sheet mới.
 * Bước 2: Đặt tên cho Google Sheet (ví dụ: "Danh Sách Khai Báo Thông Tin").
 *         - Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) > Apps Script.
 *         - Xóa hết code mặc định, copy TOÀN BỘ file này dán vào.
 * Bước 3: Bấm nút "Triển khai" (Deploy) ở góc trên bên phải:
 *         - Chọn "Quản lý bản triển khai mới" (New deployment).
 *         - Bấm biểu tượng bánh răng ⚙️ > Chọn "Ứng dụng web" (Web app).
 *         - Thực thi dưới dạng (Execute as): Chọn "Tôi" (Me).
 *         - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone).
 *         - Bấm "Triển khai" (Deploy) và cấp quyền khi Google hỏi.
 * Bước 4: Copy đường link "URL của ứng dụng web" (có đuôi /exec) và dán vào trang web form.html!
 * ===================================================================
 */

// Tự động tìm hoặc tạo thư mục "Anh_Chan_Dung" trên Google Drive
function getOrCreatePhotoFolder() {
  var folderName = "Anh_Chan_Dung";
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

// Khởi tạo hàng tiêu đề cột trong Google Sheet nếu trang còn trống
function setupSheetIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Thời gian gửi",
      "Họ và tên",
      "Mã số",
      "Số điện thoại",
      "Link ảnh chân dung (Google Drive)",
      "Ghi chú bổ sung"
    ]);
    // Trang trí tiêu đề đẹp mắt
    var headerRange = sheet.getRange("A1:F1");
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2563eb");
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 130);
    sheet.setColumnWidth(5, 300);
    sheet.setColumnWidth(6, 200);
  }
}

// Kiểm tra trạng thái hoạt động (GET)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Hệ thống tiếp nhận thông tin và ảnh chân dung đang hoạt động bình thường!"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Tiếp nhận dữ liệu người dùng gửi từ form trên web (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // Khóa 30 giây tránh trùng lặp ghi dữ liệu

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetIfEmpty(sheet);

    var data = JSON.parse(e.postData.contents);
    var fullName = String(data.fullName || "").trim();
    var codeId = String(data.codeId || "").trim();
    var phone = String(data.phone || "").trim();
    var note = String(data.note || "").trim();
    
    var photoUrl = "Không có ảnh";

    // Xử lý lưu ảnh chân dung vào Google Drive
    if (data.photoData) {
      var photoName = (codeId ? codeId + "_" : "") + (fullName ? fullName.replace(/\s+/g, "_") + "_" : "") + new Date().getTime() + ".jpg";
      if (data.photoName && data.photoName.indexOf(".") !== -1) {
        var ext = data.photoName.split('.').pop();
        photoName = (codeId ? codeId + "_" : "") + (fullName ? fullName.replace(/\s+/g, "_") + "_" : "") + new Date().getTime() + "." + ext;
      }
      
      var mimeType = data.photoType || "image/jpeg";
      var decodedBytes = Utilities.base64Decode(data.photoData);
      var blob = Utilities.newBlob(decodedBytes, mimeType, photoName);

      var folder = getOrCreatePhotoFolder();
      var driveFile = folder.createFile(blob);

      // Cho phép ai có link cũng xem được ảnh chân dung
      try {
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (err) {}

      photoUrl = driveFile.getUrl();
    }

    // Thời gian nộp theo múi giờ Việt Nam
    var timeString = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    // Thêm dòng mới vào Google Sheet
    sheet.appendRow([
      timeString,
      fullName,
      codeId,
      phone,
      photoUrl,
      note
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã ghi nhận thông tin thành công!",
      data: {
        time: timeString,
        fullName: fullName,
        codeId: codeId,
        photoUrl: photoUrl
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
