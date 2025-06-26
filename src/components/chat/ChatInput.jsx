import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Send on Enter, allow Shift+Enter for new line
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      // Apply rounded-3xl, bg-white/50 (subtly transparent), shadow-custom-light-lg for consistency
      className="flex items-end p-2 bg-white/50 backdrop-blur-md rounded-3xl shadow-custom-light-lg border border-white/60" // Adjusted padding slightly
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isLoading ? "Đang suy nghĩ..." : "Nhập tin nhắn của bạn..."
        }
        rows={1}
        className="flex-grow bg-transparent outline-none resize-none overflow-hidden max-h-32 text-lg text-lexi-headline placeholder-gray-500 pr-2 py-2" // Added vertical padding
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="primary"
        size="md" // Adjusted size to md
        loading={isLoading}
        disabled={!message.trim() || isLoading}
        className="ml-2 flex-shrink-0"
      >
        <Send size={20} />
      </Button>
    </motion.form>
  );
};

export default ChatInput;
