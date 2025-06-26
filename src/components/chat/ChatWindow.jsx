import { motion } from "framer-motion";
import { MessageCircleOff } from "lucide-react";
import { useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatWindow = ({
  currentConversation,
  onSendMessage,
  isLoading,
  messagesEndRef,
}) => {
  useEffect(() => {
    if (messagesEndRef.current && currentConversation?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation?.messages, messagesEndRef]);

  if (!currentConversation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg border border-white/60 p-6 text-center text-gray-600"
      >
        <MessageCircleOff size={64} className="mb-4 text-gray-400" />
        <h2 className="text-xl font-bold text-lexi-headline mb-2">
          Chọn một cuộc trò chuyện hoặc bắt đầu mới
        </h2>
        <p className="text-lexi-subheadline">
          Chọn một cuộc trò chuyện từ danh sách hoặc nhấn nút "Mới" để trò
          chuyện cùng trợ lý Gemini.
        </p>
      </motion.div>
    );
  }

  const messagesToRender = Array.isArray(currentConversation.messages)
    ? currentConversation.messages
    : [];

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg border border-white/60 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-gray-200/50 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-lexi-headline truncate">
          {currentConversation.title}
        </h2>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messagesToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Bắt đầu cuộc trò chuyện với Gemini của bạn!</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="mt-4 p-3 bg-gray-100 rounded-full shadow-sm text-sm"
            >
              "Chào bạn! Tôi là trợ lý Gemini của LEXIAI. Có gì tôi có thể giúp
              bạn hôm nay?"
            </motion.div>
          </div>
        ) : (
          messagesToRender.map((message, index) => (
            <ChatBubble
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              // Assuming you want to pass username to ChatBubble if available
              // username={message.role === 'user' ? user.username : 'Gemini'}
            />
          ))
        )}
        <div ref={messagesEndRef} /> {/* Attach the ref here */}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200/50">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
