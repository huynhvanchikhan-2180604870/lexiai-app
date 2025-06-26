import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, PlusCircle, Trash2 } from "lucide-react";
import Button from "../common/Button";

const ConversationList = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isLoading,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-4 border border-white/60 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-lexi-headline">
          Cuộc trò chuyện
        </h3>
        <Button
          onClick={onNewConversation}
          size="sm"
          variant="primary"
          loading={isLoading}
        >
          <PlusCircle size={20} className="mr-2" /> Mới
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        <ul className="space-y-2">
          {conversations.length === 0 && !isLoading ? (
            <p className="text-gray-500 text-sm text-center">
              Chưa có cuộc trò chuyện nào.
            </p>
          ) : (
            <AnimatePresence>
              {conversations.map((conv) => (
                <motion.li
                  key={conv._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors duration-200
                              ${
                                conv._id === currentConversationId
                                  ? "bg-lexi-button text-white shadow-md"
                                  : "bg-gray-100/50 hover:bg-gray-200/50 text-lexi-headline"
                              }`}
                  onClick={() => onSelectConversation(conv._id)}
                >
                  <div className="flex items-center min-w-0 pr-2">
                    <MessageCircle
                      size={18}
                      className={`mr-2 ${
                        conv._id === currentConversationId
                          ? "text-white"
                          : "text-lexi-illustration-secondary"
                      }`}
                    />
                    <span className="font-medium text-sm truncate">
                      {conv.title}
                    </span>
                  </div>
                  {/* Ensure onDeleteConversation is called with the correct ID */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv._id);
                    }} // Corrected: Passed conv._id to onDeleteConversation
                    className={`${
                      conv._id === currentConversationId
                        ? "!text-white hover:!bg-white/20"
                        : "!text-red-500 hover:!bg-red-100/50"
                    }`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ConversationList;
