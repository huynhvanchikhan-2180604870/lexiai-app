import { motion } from "framer-motion";
import { Link as LinkIcon, Speaker, Video } from "lucide-react";
import React, { useState } from "react";
import AudioPlayer from "../common/AudioPlayer";
import Button from "../common/Button";

const FlashcardExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flipped state when exercise changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [exercise]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRateMemory = (quality) => {
    if (!showResult) {
      // Only allow rating if not already submitted
      onSubmitAnswer(quality.toString());
    }
  };

  const renderDifficulty = (difficulty) => {
    let colorClass = "bg-gray-200 text-gray-800";
    if (difficulty === "Dễ") colorClass = "bg-green-100 text-green-700";
    else if (difficulty === "Trung bình")
      colorClass = "bg-yellow-100 text-yellow-700";
    else if (difficulty === "Khó") colorClass = "bg-red-100 text-red-700";
    else if (
      difficulty === "N/A (AI Failed)" ||
      difficulty === "N/A (No Definition)"
    )
      colorClass = "bg-red-100 text-red-700";
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {difficulty}
      </span>
    );
  };

  // Assume exercise.vocabulary holds the full word data
  const wordData = exercise.vocabulary;

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction || "Nhấn vào thẻ để xem nghĩa và tự đánh giá:"}{" "}
        {/* Display the instruction here */}
      </h2>
      <motion.div
        className="relative w-full max-w-md h-80 bg-white/90 backdrop-blur-lg rounded-3xl shadow-custom-light-lg border border-white/60 cursor-pointer overflow-hidden"
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 120,
          damping: 14,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of the card */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center backface-hidden p-6"
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-5xl font-extrabold text-lexi-headline mb-1">
            {wordData?.word || "N/A"}
          </h3>{" "}
          {/* Changed to h3, added optional chaining */}
          {wordData?.translation &&
            wordData.translation !== "N/A (AI Failed)" &&
            wordData.translation !== "N/A (No Definition)" && (
              <p className="text-xl font-bold text-lexi-button mb-2">
                {wordData.translation}
              </p>
            )}
          {wordData?.phonetic && wordData.phonetic !== "N/A" && (
            <p className="text-lg text-gray-600 italic mt-2">
              {wordData.phonetic}
            </p>
          )}
          <div className="mt-4">{renderDifficulty(wordData?.difficulty)}</div>
          {/* Audio button on front of card (click to play, not flip) */}
          {wordData?.audioUrl && wordData.audioUrl !== "N/A" && (
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              {" "}
              {/* Prevent flip on audio button click */}
              <AudioPlayer src={wordData.audioUrl} />
            </div>
          )}
        </motion.div>

        {/* Back of the card */}
        <motion.div
          className="absolute inset-0 backface-hidden p-6 overflow-y-auto custom-scrollbar"
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: isFlipped ? 0 : 180, opacity: isFlipped ? 1 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
        >
          <h3 className="text-3xl font-bold text-lexi-headline mb-2">
            {wordData?.word || "N/A"}
          </h3>{" "}
          {/* Changed to h3 */}
          {wordData?.translation &&
            wordData.translation !== "N/A (AI Failed)" && (
              <p className="text-xl font-bold text-lexi-button mb-3">
                {wordData.translation}
              </p>
            )}
          <p className="text-gray-700 mb-2">
            <strong>Định nghĩa (EN):</strong>{" "}
            {wordData?.englishDefinition || "N/A"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Định nghĩa (VN):</strong>{" "}
            {wordData?.vietnameseDefinition || "N/A"}
          </p>
          {wordData?.example && wordData.example !== "N/A" && (
            <p className="text-gray-600 italic mb-2">
              <strong>Ví dụ:</strong> {wordData.example}
            </p>
          )}
          <div className="flex flex-wrap space-x-2 space-y-2 mt-4 pt-4 border-t border-gray-200/50">
            {wordData?.audioUrl && wordData.audioUrl !== "N/A" && (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Speaker size={20} className="text-lexi-button" />
                <AudioPlayer src={wordData.audioUrl} />
                <span className="text-sm text-gray-600">Nghe</span>
              </div>
            )}
            {wordData?.mouthArticulationVideoUrl &&
              wordData.mouthArticulationVideoUrl !== "N/A" && (
                <a
                  href={wordData.mouthArticulationVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lexi-button hover:underline text-sm font-medium"
                >
                  <Video size={20} className="mr-1" /> Khẩu hình
                </a>
              )}
            {wordData?.cambridgeLink && (
              <a
                href={wordData.cambridgeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline text-sm font-medium"
              >
                <LinkIcon size={20} className="mr-1" /> Cambridge
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Rating Buttons for SRS (only visible when flipped and not yet submitted) */}
      {isFlipped && !showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 w-full max-w-md"
        >
          <Button
            variant="danger"
            size="md"
            onClick={() => handleRateMemory(0)}
            disabled={isLoading}
            className="flex-1"
          >
            Không nhớ (0)
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleRateMemory(3)}
            disabled={isLoading}
            className="flex-1"
          >
            Nhớ vừa phải (3)
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleRateMemory(5)}
            disabled={isLoading}
            className="flex-1"
          >
            Nhớ rõ (5)
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardExercise;
