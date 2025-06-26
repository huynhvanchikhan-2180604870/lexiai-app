import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../common/LoadingSpinner";
import WordCard from "./WordCard";

const VocabCardGrid = ({
  vocabList,
  onEdit,
  onDelete,
  onPlayAudio,
  onShowDetails,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="lg" color="text-lexi-button" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        Lỗi khi tải từ vựng: {error}
      </div>
    );
  }

  if (!vocabList || vocabList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg border border-white/60">
        <p className="text-xl font-semibold mb-4 text-lexi-subheadline">
          Bạn chưa có từ vựng nào.
        </p>
        <p className="text-gray-600">
          Hãy thêm từ đầu tiên của bạn để bắt đầu hành trình học tập cùng
          LEXIAI!
        </p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {vocabList.map((word) => (
          <motion.div
            key={word._id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onShowDetails(word)} // Click the entire card to show details
            className="cursor-pointer" // Indicate it's clickable
          >
            <WordCard
              wordData={word}
              onEdit={(e) => {
                e.stopPropagation();
                onEdit(word);
              }} // Stop propagation so card click doesn't trigger
              onDelete={(e) => {
                e.stopPropagation();
                onDelete(word._id);
              }} // Stop propagation
              onPlayAudio={onPlayAudio} // Keep play audio separate
              isDetailedView={false} // Ensure it's concise view in the grid
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default VocabCardGrid;
