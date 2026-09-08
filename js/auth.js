/**
 * DEVLOG - AUTHENTICATION & PRIVATE PORTAL LOGIC
 * Client-side secure portal with LocalStorage persistence + Google Drive / Sheets Cloud Sync & File Uploads.
 */

const AUTH_CONFIG = {
  DEFAULT_USER: "admin",
  DEFAULT_PASS: "cuong1012",
  SESSION_KEY: "devlog_auth_session",
  REMEMBER_KEY: "devlog_auth_remember",
  CUSTOM_USER_KEY: "devlog_custom_user",
  CUSTOM_PASS_KEY: "devlog_custom_pass",
  NOTES_KEY: "devlog_private_notes",
  FILES_KEY: "devlog_uploaded_files",
  GDRIVE_API_KEY: "devlog_gdrive_api_url",
  DEFAULT_GDRIVE_API_URL: "https://script.google.com/macros/s/AKfycbwsBhW4jfLviC7HilMl_0l3SL_VsVa_pGGfvLUhprt-33l_xaPf7uLbdI3IKbfT3Dk/exec"
};

// ==========================================
// 1. CREDENTIALS & SESSION MANAGEMENT
// ==========================================
function getStoredCredentials() {
  const user = localStorage.getItem(AUTH_CONFIG.CUSTOM_USER_KEY) || AUTH_CONFIG.DEFAULT_USER;
  const pass = localStorage.getItem(AUTH_CONFIG.CUSTOM_PASS_KEY) || AUTH_CONFIG.DEFAULT_PASS;
  return { user, pass };
}

function isAuthenticated() {
  const isSession = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) === "true";
  const isRemembered = localStorage.getItem(AUTH_CONFIG.REMEMBER_KEY) === "true";
  return isSession || isRemembered;
}

function login(username, password, rememberMe) {
  const creds = getStoredCredentials();
  if (username.trim() === creds.user && password === creds.pass) {
    if (rememberMe) {
      localStorage.setItem(AUTH_CONFIG.REMEMBER_KEY, "true");
    } else {
      sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, "true");
    }
    return { success: true };
  }
  return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
}

function logout() {
  sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
  window.location.href = "login.html";
}

function updatePassword(newPassword) {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: "Mật khẩu mới phải có ít nhất 4 ký tự!" };
  }
  localStorage.setItem(AUTH_CONFIG.CUSTOM_PASS_KEY, newPassword);
  return { success: true };
}

// ==========================================
// 2. NOTES DATA & LOCAL STORAGE
// ==========================================
const DEFAULT_NOTES = [
  {
    id: 1,
    title: "Nhật ký: Ngày đầu tiên đưa blog lên GitHub Pages",
    category: "diary",
    categoryName: "Nhật ký",
    date: "07/09/2026",
    content: "Hôm nay mình đã xây dựng hoàn chỉnh trang Blog cá nhân hiện đại và đưa lên GitHub thành công. Giao diện Dark/Light mode hoạt động rất mượt mà. Sẽ tiếp tục cập nhật thêm các bài viết về công nghệ và AI!"
  },
  {
    id: 2,
    title: "Kế hoạch & Ý tưởng dự án cá nhân quý tới",
    category: "idea",
    categoryName: "Ý tưởng mật",
    date: "07/09/2026",
    content: "- Xây dựng một mini tool tra cứu thông tin tự động bằng AI.\n- Học thêm về Docker và Cloud Deployment.\n- Viết 2 bài chia sẻ kinh nghiệm trên blog cá nhân mỗi tháng."
  },
  {
    id: 3,
    title: "Ghi chú cấu hình & Khóa API dự phòng",
    category: "account",
    categoryName: "Tài khoản",
    date: "07/09/2026",
    content: "Server Backup IP: 192.168.1.100\nCấu hình GitHub Token có hạn sử dụng đến cuối năm.\n(Lưu ý: Luôn đổi mật khẩu định kỳ để đảm bảo an toàn tối đa)."
  }
];

function getPrivateNotes() {
  const data = localStorage.getItem(AUTH_CONFIG.NOTES_KEY);
  if (!data) {
    localStorage.setItem(AUTH_CONFIG.NOTES_KEY, JSON.stringify(DEFAULT_NOTES));
    return DEFAULT_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_NOTES;
  }
}

function savePrivateNotes(notes) {
  localStorage.setItem(AUTH_CONFIG.NOTES_KEY, JSON.stringify(notes));
}

// ==========================================
// 3. UPLOADED FILES DATA (LOCAL CACHE)
// ==========================================
function getUploadedFiles() {
  const data = localStorage.getItem(AUTH_CONFIG.FILES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveUploadedFiles(files) {
  localStorage.setItem(AUTH_CONFIG.FILES_KEY, JSON.stringify(files));
}

// ==========================================
// 4. GOOGLE DRIVE / SHEETS CLOUD API
// ==========================================
function getCloudApiUrl() {
  const saved = localStorage.getItem(AUTH_CONFIG.GDRIVE_API_KEY);
  if (!saved || saved.indexOf("AKfycbwsBhW4jfLviC7HilMl_0l3SL_VsVa_pGGfvLUhprt-33l_xaPf7uLbdI3IKbfT3Dk") === -1) {
    localStorage.setItem(AUTH_CONFIG.GDRIVE_API_KEY, AUTH_CONFIG.DEFAULT_GDRIVE_API_URL);
    return AUTH_CONFIG.DEFAULT_GDRIVE_API_URL;
  }
  return saved;
}

function setCloudApiUrl(url) {
  if (url) {
    localStorage.setItem(AUTH_CONFIG.GDRIVE_API_KEY, url.trim());
  } else {
    localStorage.removeItem(AUTH_CONFIG.GDRIVE_API_KEY);
  }
}

function isCloudConnected() {
  const url = getCloudApiUrl();
  return Boolean(url && url.startsWith("http"));
}

/**
 * Fetch all notes and files from Google Apps Script
 */
async function fetchAllFromCloud() {
  const url = getCloudApiUrl();
  if (!url) return { success: false, message: "Chưa cấu hình URL Google Apps Script" };

  try {
    const response = await fetch(url + (url.includes("?") ? "&" : "?") + "type=all");
    const result = await response.json();
    if (result.status === "success") {
      if (Array.isArray(result.data)) {
        savePrivateNotes(result.data);
      }
      if (Array.isArray(result.files)) {
        saveUploadedFiles(result.files);
      }
      return { success: true, notes: result.data || [], files: result.files || [] };
    }
    return { success: false, message: result.message || "Lỗi đọc dữ liệu từ Google Drive" };
  } catch (error) {
    return { success: false, message: "Không thể kết nối đến Google Sheets: " + error.message };
  }
}

/**
 * Fetch notes from Google Sheets
 */
async function fetchNotesFromCloud() {
  const res = await fetchAllFromCloud();
  if (res.success) {
    return { success: true, notes: res.notes };
  }
  return res;
}

/**
 * Add a single note to Google Sheet
 */
async function addNoteToCloud(note) {
  const url = getCloudApiUrl();
  if (!url) return { success: false, offline: true };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "add", note: note })
    });
    return { success: true };
  } catch (err) {
    console.warn("Lỗi gửi dữ liệu lên Cloud, đã lưu cục bộ:", err);
    return { success: false, error: err };
  }
}

/**
 * Delete a single note on Google Sheet by ID
 */
async function deleteNoteFromCloud(noteId) {
  const url = getCloudApiUrl();
  if (!url) return { success: false, offline: true };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "delete", id: noteId })
    });
    return { success: true };
  } catch (err) {
    console.warn("Lỗi gửi lệnh xóa lên Cloud:", err);
    return { success: false, error: err };
  }
}

/**
 * Upload a file directly to Google Drive via Apps Script
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

async function uploadFileToDrive(file) {
  const url = getCloudApiUrl();
  if (!url) {
    return { success: false, message: "Vui lòng kết nối Google Drive trước khi tải tệp!" };
  }

  // Maximum file size warning (Google Apps Script limit ~25MB payload)
  if (file.size > 25 * 1024 * 1024) {
    return { success: false, message: "Kích thước tệp vượt quá 25MB. Vui lòng chọn tệp nhỏ hơn." };
  }

  try {
    const base64Data = await fileToBase64(file);
    const payload = {
      action: "upload_file",
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      fileData: base64Data
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.status === "success" && result.file) {
      // Add to local cache
      const currentFiles = getUploadedFiles();
      currentFiles.unshift(result.file);
      saveUploadedFiles(currentFiles);
      return { success: true, file: result.file };
    }
    return { success: false, message: result.message || "Lỗi khi lưu tệp vào Google Drive" };
  } catch (err) {
    return { success: false, message: "Lỗi kết nối khi tải tệp: " + err.message };
  }
}

/**
 * Delete a file from Google Drive
 */
async function deleteFileFromDrive(fileId) {
  const url = getCloudApiUrl();
  if (!url) return { success: false };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "delete_file", id: fileId })
    });
    // Remove from local cache
    let currentFiles = getUploadedFiles();
    currentFiles = currentFiles.filter(f => f.id !== fileId);
    saveUploadedFiles(currentFiles);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Perform Google Drive OCR directly via Apps Script
 */
async function ocrImageWithGoogleDrive(fileOrBlob, lang = "vi") {
  const url = getCloudApiUrl();
  if (!url) {
    return { success: false, message: "Chưa kết nối URL Google Apps Script!" };
  }

  try {
    const base64Data = await fileToBase64(fileOrBlob);
    const payload = {
      action: "ocr_google",
      fileData: base64Data,
      mimeType: fileOrBlob.type || "image/png",
      lang: lang
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.status === "success") {
      return { success: true, text: result.text, message: result.message };
    }
    return { success: false, message: result.message || "Lỗi khi nhận diện qua Google Drive OCR" };
  } catch (err) {
    return { success: false, message: "Lỗi kết nối tới Google Drive OCR: " + err.message };
  }
}

// Export for application use
window.DevLogAuth = {
  isAuthenticated,
  login,
  logout,
  updatePassword,
  getPrivateNotes,
  savePrivateNotes,
  getUploadedFiles,
  saveUploadedFiles,
  getStoredCredentials,
  // Google Drive Cloud Methods
  getCloudApiUrl,
  setCloudApiUrl,
  isCloudConnected,
  fetchAllFromCloud,
  fetchNotesFromCloud,
  addNoteToCloud,
  deleteNoteFromCloud,
  uploadFileToDrive,
  deleteFileFromDrive,
  ocrImageWithGoogleDrive
};
