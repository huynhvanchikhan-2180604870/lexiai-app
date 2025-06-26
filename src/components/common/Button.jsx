import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  // Base classes for all buttons - using rounded-3xl for iOS-like button corners
  const baseClasses = `font-semibold rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center justify-center`;

  // Variant specific classes using the custom color palette
  const variantClasses = {
    primary:
      "bg-lexi-button text-white hover:brightness-110 focus:ring-lexi-button",
    secondary:
      "bg-gray-200 text-lexi-subheadline hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    // Outline variant with header's glass-like text color
    outline:
      "border border-gray-800 text-gray-800 hover:bg-gray-100/30 focus:ring-gray-800",
    ghost: "text-gray-800 hover:bg-gray-100/30 focus:ring-gray-300",
  };

  // Size specific classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Classes for disabled state
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled || loading ? disabledClasses : ""} ${className}`}
      whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }} // Subtle lift on hover
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {loading ? (
        <LoadingSpinner
          size={size === "sm" ? "sm" : "md"}
          color={variant === "primary" ? "text-white" : "text-gray-800"}
        />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
