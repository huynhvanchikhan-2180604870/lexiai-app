import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createConversation,
  getConversationById,
  getConversations,
  sendMessage,
} from "../services/chatApi";

export const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fetchAllConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getConversations();
      setConversations(response.data);
      if (response.data.length > 0) {
        setCurrentConversation(response.data[0]);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi tải các cuộc trò chuyện.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConversationById = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getConversationById(id);
        setCurrentConversation(response.data);
        setTimeout(scrollToBottom, 50);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Lỗi khi tải cuộc trò chuyện.";
        setError(errorMessage);
        toast.error(errorMessage);
        setCurrentConversation(null);
      } finally {
        setIsLoading(false);
      }
    },
    [scrollToBottom]
  );

  const startNewConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createConversation();
      setConversations((prev) => [response.data, ...prev]);
      setCurrentConversation(response.data);
      toast.success("Đã tạo cuộc trò chuyện mới với Gemini!");
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi tạo cuộc trò chuyện mới.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  const sendChatMessage = useCallback(
    async (messageContent) => {
      if (!currentConversation || isLoading) return;

      const userMessage = {
        role: "user",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), userMessage],
      }));
      scrollToBottom();
      setIsLoading(true);

      try {
        const response = await sendMessage(
          currentConversation._id,
          messageContent
        );
        const updatedConversation = response.data;
        setCurrentConversation(updatedConversation);

        if (
          updatedConversation.title === "New Chat" &&
          updatedConversation.messages &&
          updatedConversation.messages.length > 2
        ) {
          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === updatedConversation._id ? updatedConversation : conv
            )
          );
        }
        scrollToBottom();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Lỗi khi gửi tin nhắn đến AI.";
        setError(errorMessage);
        toast.error(errorMessage);
        setCurrentConversation((prev) => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              role: "model",
              content: `Xin lỗi, tôi gặp lỗi: ${errorMessage}`,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
        scrollToBottom();
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation, isLoading, scrollToBottom]
  );

  useEffect(() => {
    fetchAllConversations();
  }, [fetchAllConversations]);

  useEffect(() => {
    if (currentConversation?.messages) {
      scrollToBottom();
    }
  }, [currentConversation?.messages, scrollToBottom]);

  return {
    conversations,
    currentConversation,
    setCurrentConversation: fetchConversationById,
    isLoading,
    error,
    startNewConversation,
    sendChatMessage,
    messagesEndRef,
  };
};
