/**
 * Hàm kiểm tra email hợp lệ đơn giản.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  // Added export
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Hàm tạo một chuỗi ngẫu nhiên.
 * @param {number} length - Độ dài của chuỗi.
 * @returns {string} Chuỗi ngẫu nhiên.
 */
export const generateRandomString = (length) => {
  // Added export
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Định dạng thời gian thành "thời gian trước" (ví dụ: 1 giờ trước, 2 ngày trước).
 * @param {Date | string} dateString - Chuỗi ngày hoặc đối tượng Date.
 * @returns {string} Thời gian đã định dạng.
 */
export const formatTimeAgo = (dateString) => {
  // Added export
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 5) return "Vừa thêm";
  if (seconds < 60) return `${seconds} giây trước`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  // For longer periods, return a formatted date
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

// module.exports = { // Removed module.exports, using ES6 exports
//     isValidEmail,
//     generateRandomString,
//     formatTimeAgo,
// };
