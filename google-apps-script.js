/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - BACKEND CƠ SỞ DỮ LIỆU & TẢI TỆP GOOGLE DRIVE
 * ===================================================================
 * 
 * HƯỚNG DẪN CẬP NHẬT TRÊN GOOGLE SHEETS (CHỈ MẤT 1 PHÚT):
 * 
 * Bước 1: Mở file Google Sheet bạn đã tạo trên Google Drive.
 * Bước 2: Bấm menu: Tiện ích mở rộng (Extensions) > Apps Script.
 * Bước 3: Xóa hết code cũ, copy TOÀN BỘ file này dán vào.
 * Bước 4: Nhấn biểu tượng Lưu (Ctrl + S).
 * Bước 5: Bấm nút "Triển khai" (Deploy) ở góc trên bên phải:
 *         - Chọn "Quản lý bản triển khai" (Manage deployments).
 *         - Bấm vào biểu tượng cây bút chì ✏️ để chỉnh sửa bản triển khai hiện tại.
 *         - Tại phần "Phiên bản" (Version): Chọn "Phiên bản mới" (New version).
 *         - Bấm nút "Triển khai" (Deploy) để hoàn tất cập nhật!
 * ===================================================================
 */

// Hàm kiểm tra và cấp quyền một lần duy nhất cho toàn bộ dịch vụ (Drive, Docs, Sheets, UrlFetch)
function authorizeAllServices() {
  getOrCreateUploadFolder();
  var token = ScriptApp.getOAuthToken();
  Logger.log("Quyền truy cập đã sẵn sàng! Token: " + (token ? "OK" : "Chưa có"));
}

// Lấy hoặc tạo thư mục "DevLog Uploads" trên Google Drive
function getOrCreateUploadFolder() {
  var folderName = "DevLog Uploads";
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

// Khởi tạo sheet ghi chú nếu trống
function setupNotesSheetIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "Tiêu đề", "Phân loại mã", "Tên phân loại", "Ngày tạo", "Nội dung", "Thời gian cập nhật"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#eef2ff");
    sheet.setFrozenRows(1);
  }
}

// Khởi tạo sheet tệp tải lên nếu trống
function setupFilesSheetIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["File ID", "Tên tệp", "Loại MIME", "Dung lượng (Bytes)", "Dung lượng đọc", "Link xem Drive", "Ngày tải lên"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#ecfdf5");
    sheet.setFrozenRows(1);
  }
}

// Khởi tạo sheet Mật Khẩu nếu trống
function setupPasswordsSheetIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "Chủ tài khoản", "Dịch vụ", "Mã danh mục", "Tên danh mục", "Tên đăng nhập", "Mật khẩu", "Mã PIN", "Chu kỳ đổi (tháng)", "Ngày đổi gần nhất", "Lịch sử đổi (JSON)", "Ghi chú", "Thời gian cập nhật"]);
    sheet.getRange("A1:M1").setFontWeight("bold").setBackground("#fef3c7");
    sheet.setFrozenRows(1);
    sheet.getRange("A:M").setNumberFormat("@");
  }
}

// Định dạng dung lượng tệp đọc dễ hiểu
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  var k = 1024;
  var sizes = ["Bytes", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Xử lý lấy dữ liệu (GET)
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var type = (e && e.parameter && e.parameter.type) ? e.parameter.type : "all";
    
    var result = { status: "success" };

    // 1. Lấy danh sách ghi chú (mặc định)
    if (type === "all" || type === "notes") {
      var notesSheet = ss.getSheetByName("Notes") || ss.getActiveSheet();
      setupNotesSheetIfEmpty(notesSheet);
      
      var lastRow = notesSheet.getLastRow();
      var notes = [];
      if (lastRow > 1) {
        var data = notesSheet.getRange(2, 1, lastRow - 1, 6).getValues();
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
      notes.reverse();
      result.data = notes;
    }

    // 2. Lấy danh sách tệp tải lên
    if (type === "all" || type === "files") {
      var filesSheet = ss.getSheetByName("Files");
      var files = [];
      if (filesSheet) {
        setupFilesSheetIfEmpty(filesSheet);
        var lastFileRow = filesSheet.getLastRow();
        if (lastFileRow > 1) {
          var fileData = filesSheet.getRange(2, 1, lastFileRow - 1, 7).getValues();
          for (var j = 0; j < fileData.length; j++) {
            var f = fileData[j];
            if (f[0]) {
              files.push({
                id: String(f[0]),
                name: String(f[1]),
                mimeType: String(f[2]),
                size: Number(f[3]),
                sizeFormatted: String(f[4]),
                url: String(f[5]),
                date: String(f[6])
              });
            }
          }
        }
      }
      files.reverse();
      result.files = files;
    }

    // 3. Lấy danh sách Mật khẩu
    if (type === "all" || type === "passwords") {
      var pwdSheet = ss.getSheetByName("Passwords");
      var passwords = [];
      if (pwdSheet) {
        setupPasswordsSheetIfEmpty(pwdSheet);
        var lastPwdRow = pwdSheet.getLastRow();
        if (lastPwdRow > 1) {
          var pwdData = pwdSheet.getRange(2, 1, lastPwdRow - 1, 13).getDisplayValues();
          for (var p = 0; p < pwdData.length; p++) {
            var pr = pwdData[p];
            if (pr[0]) {
              var histArr = [];
              try {
                if (pr[10]) histArr = JSON.parse(pr[10]);
              } catch (eH) {}
              var u = String(pr[5] || "").trim();
              if (/^[35789]\d{8}$/.test(u)) {
                u = "0" + u;
              }
              passwords.push({
                id: String(pr[0]),
                owner: String(pr[1] || ""),
                service: String(pr[2] || ""),
                category: String(pr[3] || "other"),
                categoryName: String(pr[4] || "Khác"),
                username: u,
                password: String(pr[6] || ""),
                pin: String(pr[7] || "").trim(),
                rotationMonths: pr[8] !== "" ? Number(pr[8]) : 6,
                lastChanged: String(pr[9] || ""),
                history: histArr,
                note: String(pr[11] || ""),
                updatedAt: String(pr[12] || "")
              });
            }
          }
        }
      }
      result.passwords = passwords;

      // Danh mục mật khẩu
      var catSheet = ss.getSheetByName("PasswordCategories");
      if (catSheet && catSheet.getLastRow() > 1) {
        var catData = catSheet.getRange(2, 1, catSheet.getLastRow() - 1, 3).getValues();
        var catList = [];
        for (var c = 0; c < catData.length; c++) {
          if (catData[c][0]) {
            catList.push({
              id: String(catData[c][0]),
              name: String(catData[c][1]),
              icon: String(catData[c][2] || "fa-solid fa-folder")
            });
          }
        }
        result.passwordCategories = catList;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Xử lý gửi dữ liệu & tải tệp (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // 30s timeout cho tác vụ upload file
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;

    // ==========================================
    // TÁC VỤ 1: TẢI TỆP LÊN GOOGLE DRIVE
    // ==========================================
    if (action === "upload_file") {
      var filename = postData.filename || "file_khong_ten";
      var mimeType = postData.mimeType || "application/octet-stream";
      var base64Data = postData.fileData;
      
      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, mimeType, filename);
      
      // Lưu vào thư mục "DevLog Uploads" trên Drive
      var folder = getOrCreateUploadFolder();
      var driveFile = folder.createFile(blob);
      
      // Cấp quyền xem để mở được link
      try {
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (err) {}

      var fileObj = {
        id: driveFile.getId(),
        name: driveFile.getName(),
        mimeType: driveFile.getMimeType(),
        size: driveFile.getSize(),
        sizeFormatted: formatBytes(driveFile.getSize()),
        url: driveFile.getUrl(),
        date: Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm")
      };

      // Ghi thông tin file vào sheet "Files"
      var filesSheet = ss.getSheetByName("Files");
      if (!filesSheet) {
        filesSheet = ss.insertSheet("Files");
      }
      setupFilesSheetIfEmpty(filesSheet);
      filesSheet.appendRow([
        fileObj.id,
        fileObj.name,
        fileObj.mimeType,
        fileObj.size,
        fileObj.sizeFormatted,
        fileObj.url,
        fileObj.date
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Tải tệp lên Google Drive thành công!",
        file: fileObj
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ==========================================
    // TÁC VỤ 2: XÓA TỆP KHỎI GOOGLE DRIVE
    // ==========================================
    if (action === "delete_file") {
      var fileId = String(postData.id);
      try {
        var fileToTrash = DriveApp.getFileById(fileId);
        fileToTrash.setTrashed(true);
      } catch (err) {}

      var fSheet = ss.getSheetByName("Files");
      if (fSheet && fSheet.getLastRow() > 1) {
        var fileIds = fSheet.getRange(2, 1, fSheet.getLastRow() - 1, 1).getValues();
        for (var m = 0; m < fileIds.length; m++) {
          if (String(fileIds[m][0]) === fileId) {
            fSheet.deleteRow(m + 2);
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đã xóa tệp khỏi Google Drive"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ==========================================
    // TÁC VỤ 2.5: GOOGLE DRIVE OCR (NHẬN DIỆN CHỮ AI CHUẨN 100% CỦA GOOGLE)
    // ==========================================
    if (action === "ocr_google") {
      var base64Data = postData.fileData;
      var mimeType = postData.mimeType || "image/png";
      var lang = postData.lang || "vi";
      if (lang === "vie+eng" || lang === "vie") lang = "vi";
      if (lang === "eng") lang = "en";

      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, mimeType, "ocr_temp_" + new Date().getTime());

      var docId = null;

      // Cách 1: Sử dụng Google Drive Advanced Service nếu có
      if (typeof Drive !== "undefined" && Drive.Files && Drive.Files.insert) {
        try {
          var newFile = Drive.Files.insert(
            { title: "OCR_Temp_" + new Date().getTime() },
            blob,
            { convert: true, ocr: true, ocrLanguage: lang }
          );
          docId = newFile.id;
        } catch (e1) {}
      }

      // Cách 2: Sử dụng Google Drive Multipart REST API (hoạt động mặc định không cần bật Services)
      if (!docId) {
        var uploadUrl = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&convert=true&ocr=true&ocrLanguage=" + encodeURIComponent(lang);
        var boundary = "-------GoogleDriveOcr" + new Date().getTime();
        var delimiter = "\r\n--" + boundary + "\r\n";
        var close_delim = "\r\n--" + boundary + "--";

        var metadata = {
          title: "OCR_Temp_" + new Date().getTime()
        };

        var multipartPayload =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + mimeType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n\r\n' +
          base64Data +
          close_delim;

        var ocrResponse = UrlFetchApp.fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
            "Content-Type": "multipart/related; boundary=" + boundary
          },
          payload: multipartPayload,
          muteHttpExceptions: true
        });

        var ocrResultJson = JSON.parse(ocrResponse.getContentText());
        if (ocrResultJson && ocrResultJson.id) {
          docId = ocrResultJson.id;
        } else {
          var err = (ocrResultJson && ocrResultJson.error && ocrResultJson.error.message) ? ocrResultJson.error.message : ocrResponse.getContentText();
          return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            message: "Lỗi Google OCR: " + err
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Đọc toàn bộ nội dung văn bản từ Google Doc vừa được OCR
      if (docId) {
        var doc = DocumentApp.openById(docId);
        var extractedText = doc.getBody().getText().trim();

        // Xóa tài liệu tạm (cho vào thùng rác)
        try {
          DriveApp.getFileById(docId).setTrashed(true);
        } catch (delErr) {}

        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "Trích xuất chữ Google Drive OCR thành công!",
          text: extractedText
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // ==========================================
    // TÁC VỤ 3: GHI CHÚ (THÊM / XÓA / ĐỒNG BỘ)
    // ==========================================
    var sheet = ss.getSheetByName("Notes") || ss.getActiveSheet();
    setupNotesSheetIfEmpty(sheet);
    
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
    
    if (action === "sync_all") {
      var allNotes = postData.notes || [];
      sheet.clearContents();
      setupNotesSheetIfEmpty(sheet);
      
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

    // ==========================================
    // TÁC VỤ 4: ĐỒNG BỘ MẬT KHẨU (LƯU VÀO SHEET "Passwords")
    // ==========================================
    if (action === "sync_passwords") {
      var allPasswords = postData.passwords || [];
      var pwdSheet = ss.getSheetByName("Passwords");
      if (!pwdSheet) {
        pwdSheet = ss.insertSheet("Passwords");
      }
      pwdSheet.clearContents();
      setupPasswordsSheetIfEmpty(pwdSheet);

      if (allPasswords.length > 0) {
        var pwdRows = [];
        for (var k = 0; k < allPasswords.length; k++) {
          var item = allPasswords[k];
          var u = String(item.username || "").trim();
          if (/^[35789]\d{8}$/.test(u)) {
            u = "0" + u;
          }
          var pinVal = item.pin !== undefined && item.pin !== null ? String(item.pin).trim() : "";
          pwdRows.push([
            item.id,
            item.owner || "",
            item.service || "",
            item.category || "other",
            item.categoryName || "",
            u,
            item.password || "",
            pinVal,
            item.rotationMonths !== undefined ? item.rotationMonths : 6,
            item.lastChanged || "",
            JSON.stringify(item.history || []),
            item.note || "",
            new Date().toISOString()
          ]);
        }
        var targetRange = pwdSheet.getRange(2, 1, pwdRows.length, 13);
        targetRange.setNumberFormat("@");
        targetRange.setValues(pwdRows);
      }

      // Đồng bộ danh mục mật khẩu nếu có
      if (postData.categories && postData.categories.length > 0) {
        var catSheet = ss.getSheetByName("PasswordCategories");
        if (!catSheet) {
          catSheet = ss.insertSheet("PasswordCategories");
        }
        catSheet.clearContents();
        catSheet.appendRow(["ID", "Tên danh mục", "Icon"]);
        catSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#e0e7ff");
        catSheet.setFrozenRows(1);
        var catRows = [];
        for (var cc = 0; cc < postData.categories.length; cc++) {
          var catItem = postData.categories[cc];
          catRows.push([catItem.id, catItem.name, catItem.icon || "fa-solid fa-folder"]);
        }
        catSheet.getRange(2, 1, catRows.length, 3).setValues(catRows);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đã đồng bộ " + allPasswords.length + " tài khoản lên Google Sheets!"
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
