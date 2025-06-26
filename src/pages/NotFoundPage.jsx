import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center p-4 bg-lexi-background"
    >
      <h1 className="text-9xl font-extrabold text-lexi-headline">404</h1>
      <p className="text-2xl md:text-3xl font-bold text-lexi-subheadline mt-4 mb-2">
        Trang không tìm thấy
      </p>
      <p className="text-lg text-gray-600 mb-8">
        Có vẻ như bạn đã đi lạc đường.
      </p>
      <Link to="/">
        <motion.button
          className="bg-lexi-button text-lexi-button-text px-8 py-4 rounded-lg font-semibold text-lg shadow-md hover:bg-opacity-90 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Quay về trang chủ
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;
