import { motion } from "framer-motion";
import {
  Award,
  Gift,
  Lock,
  Mail,
  Target,
  TrendingUp,
  User,
} from "lucide-react"; // Import TrendingUp and other icons
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/dashboard/StatCard"; // Re-use StatCard for profile summary
import { useApi } from "../../hooks/useApi";
import { getUserProfile, updateUserProfile } from "../../services/userApi";

const ProfilePage = () => {
  const {
    data: userProfile,
    loading: loadingProfile,
    error: profileError,
    execute: fetchUserProfile,
    setData: setUserProfile,
  } = useApi(getUserProfile);
  const { loading: updatingProfile, execute: executeUpdateProfile } =
    useApi(updateUserProfile);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [updatePasswordError, setUpdatePasswordError] = useState("");

  // Define XP thresholds for levels (Client-side mirror of Backend's gamificationService)
  const LEVEL_THRESHOLDS_CLIENT = [
    0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 9000,
    // Keep in sync with backend gamificationService.js
  ];

  // Define Streak milestones and Beta rewards (Client-side mirror of Backend's)
  const STREAK_REWARDS_CLIENT = [
    { days: 10, beta: 5 },
    { days: 18, beta: 10 },
    { days: 24, beta: 15 },
    { days: 33, beta: 20 },
    // Keep in sync with backend gamificationService.js
  ];

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile including gamification stats
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setEmail(userProfile.email || "");
      // Ensure userProfile fields are correctly mapped to dashboardStats in DashboardPage as well
      // The userProfile from getUserProfile should contain xp, level, streak, betaRewards
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatePasswordError("");

    const updateData = {};
    if (username !== userProfile.username) updateData.username = username;
    // Email is usually not updatable or needs special verification
    // if (email !== userProfile.email) updateData.email = email;

    if (newPassword) {
      if (newPassword.length < 6) {
        setUpdatePasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setUpdatePasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
      }
      if (!currentPassword) {
        setUpdatePasswordError(
          "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu."
        );
        return;
      }
      updateData.password = newPassword;
      updateData.currentPassword = currentPassword; // Assuming backend expects current password for password change
    }

    if (Object.keys(updateData).length === 0) {
      toast("Không có thay đổi nào để lưu.", { icon: "ℹ️" });
      return;
    }

    try {
      const updatedUserResponse = await executeUpdateProfile(updateData);
      setUserProfile((prev) => ({ ...prev, ...updatedUserResponse }));
      toast.success("Cập nhật hồ sơ thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Calculate XP progress for the bar
  const currentLevelXpBase =
    LEVEL_THRESHOLDS_CLIENT[userProfile?.level - 1] || 0;
  const nextLevelXpThreshold =
    LEVEL_THRESHOLDS_CLIENT[userProfile?.level] || userProfile?.xp + 1000;
  const xpProgressInCurrentLevel = (userProfile?.xp || 0) - currentLevelXpBase;
  const xpNeededForNextLevelSegment = nextLevelXpThreshold - currentLevelXpBase;
  const progressBarWidth =
    xpNeededForNextLevelSegment > 0
      ? (xpProgressInCurrentLevel / xpNeededForNextLevelSegment) * 100
      : 0;

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
        <LoadingSpinner size="lg" color="text-lexi-button" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        Lỗi khi tải hồ sơ: {profileError}
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 pb-20 md:pt-4 md:pb-4 min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-bold text-lexi-headline mb-8 mt-20 text-center"></h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {/* User Info & Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60"
        >
          <h2 className="text-2xl font-bold text-lexi-headline mb-4">
            Thông tin cá nhân
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <InputField
              label="Tên người dùng"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={User}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              disabled={true}
            />

            <h3 className="text-xl font-bold text-lexi-headline mb-4 mt-6">
              Đổi mật khẩu
            </h3>
            <InputField
              label="Mật khẩu hiện tại"
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              icon={Lock}
            />
            <InputField
              label="Mật khẩu mới"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              icon={Lock}
            />
            <InputField
              label="Xác nhận mật khẩu mới"
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              icon={Lock}
            />
            {updatePasswordError && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {updatePasswordError}
              </p>
            )}

            <Button
              type="submit"
              loading={updatingProfile}
              variant="primary"
              className="w-full mt-6"
            >
              {updatingProfile ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </form>
        </motion.div>

        {/* Gamification Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60"
        >
          <h2 className="text-2xl font-bold text-lexi-headline mb-4">
            Thống kê học tập
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Cấp độ"
              value={userProfile?.level || 1}
              icon={Award}
              colorClass="bg-lexi-illustration-secondary"
              valueColorClass="text-white"
            />
            <StatCard
              title="XP hiện tại"
              value={userProfile?.xp || 0}
              icon={TrendingUp}
              colorClass="bg-lexi-button"
              valueColorClass="text-white"
            />{" "}
            {/* Corrected icon reference */}
            <StatCard
              title="Chuỗi học tập"
              value={userProfile?.streak || 0}
              icon={Target}
              colorClass={`text-white ${
                userProfile?.streak > 0 ? "bg-green-500" : "bg-gray-500"
              }`}
              valueColorClass="text-white"
            />
            <StatCard
              title="Beta của tôi"
              value={userProfile?.betaRewards || 0}
              icon={Gift}
              colorClass="bg-lexi-illustration-tertiary"
              valueColorClass="text-lexi-headline"
            />
          </div>

          {/* XP Progress Bar */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-lexi-headline mb-3 flex items-center">
              <TrendingUp
                size={20}
                className="mr-2 text-lexi-illustration-secondary"
              />{" "}
              Tiến độ lên cấp
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-lexi-illustration-highlight h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressBarWidth}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">
              XP: {userProfile?.xp || 0} /{" "}
              {nextLevelXpThreshold || userProfile?.xp + 1000} (Level{" "}
              {userProfile?.level || 1})
            </p>
          </div>

          {/* Upcoming Streak Rewards */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-lexi-headline mb-3 flex items-center">
              <Gift size={20} className="mr-2 text-lexi-button" /> Phần thưởng
              Streak sắp tới
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              {STREAK_REWARDS_CLIENT.filter(
                (reward) => reward.days > (userProfile?.streak || 0)
              )
                .slice(0, 3)
                .map((reward, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg"
                  >
                    <span>
                      {reward.days} ngày:{" "}
                      <span className="font-semibold">{reward.beta} Beta</span>
                    </span>
                    <span className="text-gray-500">
                      {reward.days - (userProfile?.streak || 0)} ngày nữa
                    </span>
                  </li>
                ))}
              {STREAK_REWARDS_CLIENT.filter(
                (reward) => reward.days > (userProfile?.streak || 0)
              ).length === 0 && (
                <p className="text-gray-500 text-sm p-2 bg-gray-50/50 rounded-lg">
                  Bạn đã nhận tất cả phần thưởng Streak hiện có!
                </p>
              )}
            </ul>
          </div>

          {/* Placeholder for Learning Goals / Interests */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-lexi-headline mb-3 flex items-center">
              <Target
                size={20}
                className="mr-2 text-lexi-illustration-highlight"
              />{" "}
              Mục tiêu & Sở thích
            </h3>
            <p className="text-gray-700 text-sm">
              (Tính năng này sẽ cho phép bạn thiết lập mục tiêu học tập và sở
              thích để cá nhân hóa gợi ý từ AI.)
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Thiết lập mục tiêu
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
