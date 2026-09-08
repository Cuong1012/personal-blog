/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - THU THẬP & TRUY XUẤT THÔNG TIN KHAI BÁO
 * ===================================================================
 * 
 * HƯỚNG DẪN CẬP NHẬT (CHỈ MẤT 30 GIÂY):
 * 1. Mở file Google Sheet của bạn > Tiện ích mở rộng (Extensions) > Apps Script.
 * 2. Copy toàn bộ code file này dán đè vào Apps Script > Bấm Lưu (Ctrl + S).
 * 3. Bấm Triển khai (Deploy) > Quản lý bản triển khai (Manage deployments).
 * 4. Bấm biểu tượng cây bút chì ✏️ > Tại dòng Phiên bản (Version) chọn "Phiên bản mới" (New version) > Bấm Triển khai (Deploy).
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

// Lấy danh sách toàn bộ hồ sơ đã nộp để hiển thị lên trang private.html (GET)
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetIfEmpty(sheet);

    var lastRow = sheet.getLastRow();
    var list = [];

    if (lastRow > 1) {
      var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[1] || row[2]) { // Nếu có họ tên hoặc mã số
          list.push({
            id: i + 1,
            time: String(row[0] || ""),
            fullName: String(row[1] || ""),
            codeId: String(row[2] || ""),
            phone: String(row[3] || ""),
            photoUrl: String(row[4] || ""),
            note: String(row[5] || "")
          });
        }
      }
    }

    // Đảo ngược để hồ sơ mới nhất nằm ở đầu danh sách
    list.reverse();

    return ContentService.createTextOutput(JSON.stringify({
      status: "online",
      total: list.length,
      data: list
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

// Tiếp nhận dữ liệu người dùng gửi từ form trên web (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

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

      try {
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (err) {}

      photoUrl = driveFile.getUrl();
    }

    var timeString = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

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
