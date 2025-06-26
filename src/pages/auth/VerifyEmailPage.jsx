import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react"; // Icons
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, loading: authLoading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [message, setMessage] = useState("Đang xác thực email của bạn...");
  const hasVerificationAttempted = useRef(false); // Ref to track if verification has been attempted

  useEffect(() => {
    const performVerification = async () => {
      // Only attempt verification if token exists, auth context is not loading, and we haven't attempted yet
      if (token && !authLoading && !hasVerificationAttempted.current) {
        hasVerificationAttempted.current = true; // Mark as attempted to prevent re-runs

        try {
          const success = await verifyEmail(token);
          if (success) {
            setVerificationStatus("success");
            setMessage(
              "Email của bạn đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ."
            );
          } else {
            setVerificationStatus("error");
            // Message from toast in AuthContext will be shown, but we set local state for display here
            setMessage(
              "Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn."
            );
          }
        } catch (error) {
          console.error("Error during email verification API call:", error);
          setVerificationStatus("error");
          setMessage(
            "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại."
          );
        }
      } else if (!token && !hasVerificationAttempted.current) {
        // Handle case where token is missing from URL on initial load and no attempt has been made
        hasVerificationAttempted.current = true; // Mark as attempted for this flow
        setVerificationStatus("error");
        setMessage("Không tìm thấy token xác thực. Liên kết không hợp lệ.");
      }
    };

    performVerification();
  }, [token, verifyEmail, authLoading]); // Dependencies: token, verifyEmail (stable function ref), authLoading state

  const renderContent = () => {
    if (verificationStatus === "pending" || authLoading) {
      return (
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" color="text-lexi-button" />
          <p className="mt-4 text-lexi-subheadline text-lg">{message}</p>
        </div>
      );
    } else if (verificationStatus === "success") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-lexi-headline mb-2">
            Xác thực thành công!
          </h3>
          <p className="text-lexi-subheadline mb-6">{message}</p>
          <Link to="/login">
            <Button variant="primary">Đi đến trang Đăng nhập</Button>
          </Link>
        </motion.div>
      );
    } else {
      // status === 'error'
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center"
        >
          <XCircle size={64} className="text-red-500 mb-4" />
          <h3 className="text-2xl font-bold text-lexi-headline mb-2">
            Xác thực thất bại!
          </h3>
          <p className="text-lexi-subheadline mb-6">{message}</p>
          <Link to="/register">
            <Button variant="secondary">Thử đăng ký lại</Button>
          </Link>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-lexi-background p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
