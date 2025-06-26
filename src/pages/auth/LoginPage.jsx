import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react"; // Icons
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    const success = await login(email, password);
    if (!success) {
      // Error message is handled by toast in AuthContext
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-lexi-background"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-lexi-headline mb-6">
          Đăng nhập LEXIAI
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nhap_email@example.com"
            icon={Mail}
          />
          <InputField
            label="Mật khẩu"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            icon={Lock}
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full mt-4"
            loading={loading}
            variant="primary"
          >
            Đăng nhập
          </Button>
        </form>
        <p className="mt-6 text-center text-lexi-subheadline text-sm">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-lexi-button font-semibold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
        <p className="mt-2 text-center text-lexi-subheadline text-sm">
          <Link to="/forgot-password" className="text-gray-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
