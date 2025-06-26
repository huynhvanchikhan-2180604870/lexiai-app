import { motion } from "framer-motion";
import { Bot, User as UserIcon } from "lucide-react";

const AIAvatar = ({ role, username, size = "md", className = "" }) => {
  const isUser = role === "user";

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", // Slightly larger for clarity
    lg: "w-12 h-12 text-lg",
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  // Define background and text colors based on role
  const bgColor = isUser ? "bg-lexi-button" : "bg-lexi-headline"; // User: your main button color, AI: your dark headline color
  const textColor = "text-white"; // Both avatars will have white text/icon for contrast

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <motion.div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 overflow-hidden shadow-md ${bgColor} ${textColor} ${currentSizeClass} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      aria-label={isUser ? `User: ${username}` : "AI Assistant"}
    >
      {isUser ? (
        <UserIcon size={size === "sm" ? 16 : 20} />
      ) : (
        <Bot size={size === "sm" ? 18 : 22} />
      )}
      {/* Optionally show initials for user if no icon is preferred
      {isUser && !Icon && username && getInitials(username)}
      */}
    </motion.div>
  );
};

export default AIAvatar;
