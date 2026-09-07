/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - BACKEND CƠ SỞ DỮ LIỆU GOOGLE SHEETS / DRIVE
 * ===================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT 4 BƯỚC ĐƠN GIẢN (CHỈ MẤT 2 PHÚT):
 * 
 * Bước 1: Mở trình duyệt, truy cập: https://sheets.new để tạo một file Google Sheet mới.
 * Bước 2: Đặt tên cho file Sheet (ví dụ: "DevLog Private Database").
 * Bước 3: Trên thanh menu của Google Sheet, bấm: Tiện ích mở rộng (Extensions) > Apps Script.
 * Bước 4: Xóa hết mã nguồn cũ trong cửa sổ soạn thảo, sao chép TOÀN BỘ đoạn code bên dưới dán vào.
 * Bước 5: Bấm vào nút "Triển khai" (Deploy) ở góc trên bên phải > chọn "Quản lý bản triển khai mới" (New deployment).
 *         - Nhấp vào biểu tượng bánh răng ⚙️ > chọn "Ứng dụng web" (Web app).
 *         - Phần "Thực thi dưới dạng" (Execute as): Chọn "Tôi" (Me).
 *         - Phần "Ai có quyền truy cập" (Who has access): Chọn "Bất kỳ ai" (Anyone).
 *         - Nhấn nút "Triển khai" (Deploy) và cấp quyền truy cập tài khoản khi Google yêu cầu.
 * Bước 6: Sao chép đường link "URL của ứng dụng web" (có đuôi /exec) và dán vào trang quản trị private.html trên web của bạn!
 * ===================================================================
 */

// Hàm khởi tạo tiêu đề cột nếu sheet còn trống
function setupSheetIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "Tiêu đề", "Phân loại mã", "Tên phân loại", "Ngày tạo", "Nội dung", "Thời gian cập nhật"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#eef2ff");
    sheet.setFrozenRows(1);
  }
}

// Xử lý lấy toàn bộ dữ liệu (GET)
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetIfEmpty(sheet);
    
    var lastRow = sheet.getLastRow();
    var notes = [];
    
    if (lastRow > 1) {
      var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[0]) {
          notes.push({
            id: Number(row[0]),
            title: String(row[1] || ""),
            category: String(row[2] || "diary"),
            categoryName: String(row[3] || "Nhật ký"),
            date: String(row[4] || ""),
            content: String(row[5] || "")
          });
        }
      }
    }
    
    // Đảo ngược để bài mới nhất hiển thị lên đầu
    notes.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: notes.length,
      data: notes
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

// Xử lý thêm, xóa và đồng bộ dữ liệu (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetIfEmpty(sheet);
    
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    
    // Hành động: Thêm ghi chú mới
    if (action === "add") {
      var note = postData.note;
      sheet.appendRow([
        note.id,
        note.title,
        note.category,
        note.categoryName,
        note.date,
        note.content,
        new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đã thêm ghi chú thành công lên Google Sheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Hành động: Xóa ghi chú theo ID
    if (action === "delete") {
      var noteId = Number(postData.id);
      var lastRow = sheet.getLastRow();
      var found = false;
      
      if (lastRow > 1) {
        var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (Number(ids[i][0]) === noteId) {
            sheet.deleteRow(i + 2);
            found = true;
            break;
          }
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: found ? "success" : "not_found",
        message: found ? "Đã xóa ghi chú khỏi Google Sheet" : "Không tìm thấy ghi chú cần xóa"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Hành động: Đồng bộ hàng loạt toàn bộ danh sách (Sync All)
    if (action === "sync_all") {
      var allNotes = postData.notes || [];
      sheet.clearContents();
      setupSheetIfEmpty(sheet);
      
      if (allNotes.length > 0) {
        var rows = [];
        for (var k = 0; k < allNotes.length; k++) {
          var n = allNotes[k];
          rows.push([
            n.id,
            n.title,
            n.category,
            n.categoryName,
            n.date,
            n.content,
            new Date().toISOString()
          ]);
        }
        sheet.getRange(2, 1, rows.length, 7).setValues(rows);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đã đồng bộ toàn bộ ghi chú lên Google Sheet thành công!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "invalid_action",
      message: "Hành động không hợp lệ"
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
