import axiosClient from "./axiosClient";

// Lấy thông tin hồ sơ người dùng hiện tại
export const getUserProfile = () => {
  return axiosClient.get("/users/profile");
};

// Cập nhật thông tin hồ sơ người dùng
export const updateUserProfile = (updateData) => {
  return axiosClient.put("/users/profile", updateData);
};
