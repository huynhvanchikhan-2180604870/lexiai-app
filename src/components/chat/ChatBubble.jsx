import { motion } from "framer-motion";
import AIAvatar from "./AIAvatar"; // Import the new AIAvatar component

const ChatBubble = ({ role, content, timestamp, username }) => {
  const isUser = role === "user";
  // Refined bubble classes for a more modern look
  const bubbleClasses = isUser
    ? "bg-lexi-button text-white self-end rounded-t-xl rounded-bl-xl rounded-br-lg" // User message: Rounded top, bottom-left, slightly less rounded bottom-right for a subtle "tail" effect
    : "bg-gray-100 text-lexi-headline self-start rounded-t-xl rounded-br-xl rounded-bl-lg"; // AI message: similar rounding, light gray background

  const avatarOrderClass = isUser ? "ml-2 order-2" : "mr-2 order-1";
  const contentOrderClass = isUser ? "order-1" : "order-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-end max-w-[80%] my-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <AIAvatar
        role={role}
        username={username}
        className={avatarOrderClass}
        size="md"
      />
      <div
        className={`p-3 rounded-xl shadow-md break-words text-base max-w-full 
                        ${bubbleClasses} ${contentOrderClass} `} // Stronger shadow for better pop-out
      >
        {content.split("\n").map(
          (
            line,
            index // Render newlines correctly
          ) => (
            <p key={index}>{line}</p>
          )
        )}
        <div className="text-right text-xs mt-1 text-white/70">
          {" "}
          {/* Slightly transparent for user, or use a specific gray for AI */}
          {new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
