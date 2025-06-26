import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Calendar,
  CheckCircle,
  Gift,
  Target,
  TrendingUp as TrendingUpIcon,
} from "lucide-react"; // Corrected import for TrendingUpIcon
import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ChartWrapper from "../../components/dashboard/ChartWrapper";
import StatCard from "../../components/dashboard/StatCard";
import { useApi } from "../../hooks/useApi";
import {
  getDailyCheckInStatus,
  performDailyCheckIn,
} from "../../services/checkInApi";
import { getDashboardSummary } from "../../services/dashboardApi";

// Import Recharts components
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Custom Tooltip for Recharts (Bar Chart)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-200/50 text-sm">
        <p className="font-semibold text-gray-800">{`Ngày: ${label}`}</p>
        <p className="text-lexi-button">{`Số từ: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Recharts (Pie Chart)
const PieCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-200/50 text-sm">
        <p className="font-semibold text-gray-800">{`${data.difficulty}: ${data.count} từ`}</p>
        <p className="text-gray-600">{`(${data.percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const {
    data: summaryData,
    loading: loadingSummary,
    error: summaryError,
    execute: fetchSummary,
  } = useApi(getDashboardSummary);
  const {
    data: checkInStatus,
    loading: loadingCheckInStatus,
    error: checkInStatusError,
    execute: fetchCheckInStatus,
    setData: setCheckInStatus,
  } = useApi(getDailyCheckInStatus);
  const { loading: checkingIn, execute: executeCheckIn } =
    useApi(performDailyCheckIn);

  const [dashboardStats, setDashboardStats] = useState({
    totalWords: 0,
    wordsToday: 0,
    wordsForReview: 0,
    difficultyCounts: {},
    sevenDayData: [],
    recentActivities: [],
    learningStreak: 0,
    betaRewards: 0,
    xp: 0,
    level: 1,
  });

  // Define Streak milestones and Beta rewards (Client-side mirror of Backend's)
  const STREAK_REWARDS_CLIENT = [
    { days: 10, beta: 5 },
    { days: 18, beta: 10 },
    { days: 24, beta: 15 },
    { days: 33, beta: 20 },
    // Keep in sync with backend gamificationService.js
  ];
  // Define XP thresholds for levels (Client-side mirror of Backend's)
  const LEVEL_THRESHOLDS_CLIENT = [
    0, // Level 1
    100, // Level 2
    300, // Level 3
    600, // Level 4
    1000, // Level 5
    1500, // Level 6
    2500, // Level 7
    4000, // Level 8
    6000, // Level 9
    9000, // Level 10
    // Add more levels here if needed, matching backend
  ];

  useEffect(() => {
    fetchSummary();
    fetchCheckInStatus();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSummary();
        fetchCheckInStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSummary, fetchCheckInStatus]);

  useEffect(() => {
    if (summaryData) {
      console.log("Dữ liệu Dashboard từ Backend:", summaryData); // LOG ĐỂ KIỂM TRA
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalWords: summaryData.totalWords,
        wordsToday: summaryData.wordsToday,
        wordsForReview: summaryData.wordsForReview,
        difficultyCounts: summaryData.difficultyCounts,
        sevenDayData: summaryData.sevenDayData,
        recentActivities: summaryData.recentActivities || [],
        learningStreak: summaryData.learningStreak,
        betaRewards: summaryData.betaRewards,
        xp: summaryData.xp,
        level: summaryData.level,
      }));
    }
  }, [summaryData]);

  const handleDailyCheckIn = async () => {
    try {
      const result = await executeCheckIn();
      setCheckInStatus({ checkedInToday: true });
      console.log("Kết quả điểm danh:", result); // LOG ĐỂ KIỂM TRA
      setDashboardStats((prevStats) => ({
        ...prevStats,
        betaRewards: prevStats.betaRewards + (result.betaGained || 0),
        xp: prevStats.xp + (result.xpGained || 0),
        level: result.user.level, // Make sure result.user exists and has level
        learningStreak: result.user.streak, // Make sure result.user exists and has streak
      }));
    } catch (error) {
      console.error("Lỗi khi điểm danh hàng ngày:", error);
    }
  };

  const PIE_COLORS = {
    Dễ: "#34a853",
    "Trung bình": "#fbbc04",
    Khó: "#ea4335",
    "Chưa xếp loại": "#9aa0a6",
    "N/A (AI Failed)": "#707070",
    "N/A (No Definition)": "#a0a0a0",
  };

  const renderSevenDayChart = () => {
    const dataToChart = Array.isArray(dashboardStats.sevenDayData)
      ? dashboardStats.sevenDayData
      : [];
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dataToChart}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis allowDecimals={false} stroke="#666" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Legend />
          <Bar
            dataKey="count"
            name="Số từ"
            fill="#ff6e6c"
            barSize={30}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderDifficultyPieChart = () => {
    const difficultyCounts = dashboardStats.difficultyCounts || {};
    const totalDifficulties = Object.values(difficultyCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const dataToChart = Object.entries(difficultyCounts)
      .filter(([, count]) => count > 0)
      .map(([difficulty, count]) => ({
        difficulty,
        count,
        percentage:
          totalDifficulties > 0
            ? ((count / totalDifficulties) * 100).toFixed(1)
            : "0.0",
      }));

    if (totalDifficulties === 0) {
      return (
        <p className="text-center text-gray-500 mt-4">
          Chưa có dữ liệu độ khó.
        </p>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataToChart}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="count"
            nameKey="difficulty"
            isAnimationActive={true}
            animationDuration={800}
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {dataToChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[entry.difficulty] || "#cccccc"}
              />
            ))}
          </Pie>
          <Tooltip content={<PieCustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ right: -10 }}
            formatter={(value, entry) =>
              `${value} (${entry.payload.percentage}%)`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Calculate XP needed for next level and progress bar width
  const currentLevelXpBase =
    LEVEL_THRESHOLDS_CLIENT[dashboardStats.level - 1] || 0;
  const nextLevelXpThreshold =
    LEVEL_THRESHOLDS_CLIENT[dashboardStats.level] || dashboardStats.xp + 1000; // Fallback for last level or if threshold not defined

  const xpProgressInCurrentLevel = dashboardStats.xp - currentLevelXpBase;
  const xpNeededForNextLevelSegment = nextLevelXpThreshold - currentLevelXpBase;
  const progressBarWidth =
    xpNeededForNextLevelSegment > 0
      ? (xpProgressInCurrentLevel / xpNeededForNextLevelSegment) * 100
      : 0;

  if (loadingSummary || loadingCheckInStatus) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
        <LoadingSpinner size="lg" color="text-lexi-button" />
      </div>
    );
  }

  if (summaryError || checkInStatusError) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        Lỗi khi tải dữ liệu Dashboard: {summaryError || checkInStatusError}
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 pb-20 md:pt-4 md:pb-4 min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-bold text-lexi-headline mb-8 mt-20 text-center"></h1>

      {/* Daily Check-in Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 mb-8 border border-white/60 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Gift size={32} className="text-lexi-button" />
          <div className="text-lexi-headline">
            <h2 className="text-2xl font-bold">Điểm danh hàng ngày</h2>
            <p className="text-gray-600 text-sm">Nhận 1 Beta mỗi ngày!</p>
          </div>
        </div>
        {checkInStatus?.checkedInToday ? (
          <div className="flex items-center space-x-2 text-green-600 font-semibold text-lg">
            <CheckCircle size={24} />
            <span>Đã điểm danh hôm nay!</span>
          </div>
        ) : (
          <Button
            onClick={handleDailyCheckIn}
            loading={checkingIn}
            variant="primary"
            size="md"
            className="w-full md:w-auto"
          >
            {checkingIn ? "Đang điểm danh..." : "Điểm danh ngay!"}
          </Button>
        )}
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          title="Tổng số từ"
          value={dashboardStats.totalWords}
          icon={BookOpen}
          colorClass="bg-lexi-button"
          valueColorClass="text-white"
        />
        <StatCard
          title="Từ học hôm nay"
          value={dashboardStats.wordsToday}
          icon={Calendar}
          colorClass="bg-lexi-illustration-secondary"
          valueColorClass="text-white"
        />
        <StatCard
          title="Từ cần ôn tập"
          value={dashboardStats.wordsForReview}
          icon={Target}
          colorClass="bg-lexi-illustration-highlight"
          valueColorClass="text-white"
        />
        {/* New Stat Card for Beta Rewards */}
        <StatCard
          title="Phần thưởng Beta"
          value={dashboardStats.betaRewards}
          icon={Gift}
          colorClass="bg-lexi-illustration-tertiary"
          valueColorClass="text-lexi-headline"
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartWrapper title="Số từ đã học trong 7 ngày qua">
          {renderSevenDayChart()}
        </ChartWrapper>
        <ChartWrapper title="Tỷ lệ từ vựng theo độ khó">
          {renderDifficultyPieChart()}
        </ChartWrapper>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60"
        >
          <h3 className="text-xl font-bold text-lexi-headline mb-4 flex items-center">
            <Activity
              size={24}
              className="mr-2 text-lexi-illustration-secondary"
            />{" "}
            Hoạt động gần đây của bạn
          </h3>
          <ul className="space-y-2 text-gray-700">
            {dashboardStats.recentActivities &&
            dashboardStats.recentActivities.length > 0 ? (
              dashboardStats.recentActivities.map((activity, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Activity size={16} className="mr-2 text-gray-500" />
                  {activity.desc}{" "}
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(activity.time).toLocaleString("vi-VN")}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Chưa có hoạt động gần đây.
              </p>
            )}
          </ul>
        </motion.div>

        {/* Learning Streak / Gamification Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60"
        >
          <h3 className="text-xl font-bold text-lexi-headline mb-4 flex items-center">
            <TrendingUpIcon
              size={24}
              className="mr-2 text-lexi-illustration-tertiary"
            />{" "}
            Tiến độ học tập & Streak
          </h3>
          <div className="text-gray-700 space-y-3">
            <p className="text-lg">
              Chuỗi học tập hiện tại:{" "}
              <span
                className={`font-extrabold text-2xl ${
                  dashboardStats.learningStreak > 0
                    ? "text-lexi-button"
                    : "text-gray-500"
                }`}
              >
                {dashboardStats.learningStreak}
              </span>{" "}
              ngày liên tiếp 🔥
            </p>
            <p className="text-sm text-gray-600">
              Hãy tiếp tục để đạt được những thành tựu mới!
            </p>
            {/* XP Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-lexi-illustration-highlight h-2.5 rounded-full"
                style={{ width: `${progressBarWidth}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">
              XP: {dashboardStats.xp || 0} / {nextLevelXpThreshold} (Level{" "}
              {dashboardStats.level || 1})
            </p>

            {/* Upcoming Streak Rewards */}
            <h4 className="text-sm font-semibold text-lexi-headline mt-4">
              Phần thưởng Streak sắp tới:
            </h4>
            <ul className="text-xs text-gray-700 space-y-1">
              {/* Filter STREAK_REWARDS to show only upcoming ones */}
              {STREAK_REWARDS_CLIENT.filter(
                (reward) => reward.days > dashboardStats.learningStreak
              )
                .slice(0, 3)
                .map((reward, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {reward.days} ngày: {reward.beta} Beta
                    </span>
                    <span className="text-gray-500">
                      {reward.days - dashboardStats.learningStreak} ngày nữa
                    </span>
                  </li>
                ))}
              {STREAK_REWARDS_CLIENT.filter(
                (reward) => reward.days > dashboardStats.learningStreak
              ).length === 0 && (
                <p>Bạn đã nhận tất cả phần thưởng Streak hiện có!</p>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
