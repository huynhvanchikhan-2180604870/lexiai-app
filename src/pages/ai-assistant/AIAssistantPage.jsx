import { motion } from "framer-motion";
import { List, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react"; // Ensure useState is imported
import ChatWindow from "../../components/chat/ChatWindow";
import ConversationList from "../../components/chat/ConversationList";
import Button from "../../components/common/Button";
import { useChat } from "../../hooks/useChat";

const AIAssistantPage = () => {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    isLoading,
    error,
    startNewConversation,
    sendChatMessage,
    deleteChatConversation,
  } = useChat();

  const messagesEndRef = useRef(null);
  const [showConversationList, setShowConversationList] = useState(true); // Declare showConversationList state

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (currentConversation?.messages) {
      scrollToBottom();
    }
  }, [currentConversation?.messages, scrollToBottom]);

  const handleSelectConversation = useCallback(
    (convId) => {
      setCurrentConversation(convId);
      if (window.innerWidth < 1024) {
        setShowConversationList(false);
      }
    },
    [setCurrentConversation]
  );

  const handleNewConversation = useCallback(async () => {
    await startNewConversation();
    if (window.innerWidth < 1024) {
      setShowConversationList(false);
    }
  }, [startNewConversation]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200 min-h-[calc(100vh-250px)]">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 mt-20 pb-20 md:pt-4 md:pb-4 min-h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6">
      <h1 className="text-4xl font-bold text-lexi-headline mb-8 text-center lg:hidden">
        Trợ lý AI Gemini
      </h1>

      {/* Toggle Buttons for Mobile */}
      <div className="lg:hidden flex justify-center space-x-4 mb-4">
        <Button
          variant={showConversationList ? "primary" : "secondary"}
          onClick={() => setShowConversationList(true)}
          className="flex-1"
        >
          <List size={20} className="mr-2" /> Lịch sử Chat
        </Button>
        <Button
          variant={!showConversationList ? "primary" : "secondary"}
          onClick={() => setShowConversationList(false)}
          className="flex-1"
          disabled={!currentConversation && !isLoading}
        >
          <MessageSquare size={20} className="mr-2" /> Chat
        </Button>
      </div>

      {/* Conversation List Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`w-full lg:w-1/3 flex-shrink-0 h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] 
                    ${showConversationList ? "block" : "hidden"} lg:block`}
      >
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversation?._id}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteChatConversation}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-full lg:w-2/3 flex-grow h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] 
                    ${showConversationList ? "hidden" : "block"} lg:block`}
      >
        <ChatWindow
          currentConversation={currentConversation}
          onSendMessage={sendChatMessage}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
      </motion.div>
    </div>
  );
};

export default AIAssistantPage;
