import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"; // Import social media icons
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex justify-center py-4 px-2 sm:px-4 mt-8 w-full ">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
        // Apply consistent glassmorphism styles from header, with increased padding for content
        // Changed flex-col to justify-between for mobile to spread items
        className="relative max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-[30px] px-8 py-5 shadow-custom-light-lg flex flex-col md:flex-row justify-between items-center h-auto border border-white/20 text-center md:text-left"
      >
        {/* Copyright and Description Section */}
        {/* Adjusted spacing for mobile (mb-3 md:mb-0) */}
        <div className="flex flex-col items-center md:items-start mb-3 md:mb-0 md:mr-4">
          <p className="text-gray-800 text-sm font-semibold">
            &copy; {new Date().getFullYear()} LEXIAI. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-1 max-w-xs md:max-w-none">
            Nâng tầm vốn từ vựng của bạn với sự hỗ trợ của AI Gemini.
          </p>
        </div>

        {/* Navigation Links Section */}
        {/* Adjusted space-y-2 for vertical spacing on mobile, sm:space-x-6 for horizontal on small screens and up */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-3 md:mt-0 md:mr-4">
          <Link
            to="/privacy-policy"
            className="text-gray-800 text-sm hover:text-lexi-button transition-colors duration-200 font-medium"
          >
            Chính sách bảo mật
          </Link>
          <Link
            to="/terms-of-service"
            className="text-gray-800 text-sm hover:text-lexi-button transition-colors duration-200 font-medium"
          >
            Điều khoản dịch vụ
          </Link>
          <Link
            to="/contact-us"
            className="text-gray-800 text-sm hover:text-lexi-button transition-colors duration-200 font-medium"
          >
            Liên hệ
          </Link>
        </div>

        {/* Social Media Icons Section */}
        {/* Adjusted mt-3 for spacing on mobile */}
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="https://facebook.com/your-lexiai-page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-lexi-button transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100/30"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://twitter.com/your-lexiai-page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-lexi-button transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100/30"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://instagram.com/your-lexiai-page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-lexi-button transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100/30"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://linkedin.com/company/your-lexiai-page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-lexi-button transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100/30"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
