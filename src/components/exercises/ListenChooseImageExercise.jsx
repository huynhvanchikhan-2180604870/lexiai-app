import { motion } from "framer-motion";
import React, { useState } from "react";
import AudioPlayer from "../common/AudioPlayer";
import Button from "../common/Button";

const ListenChooseImageExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [selectedImageConcept, setSelectedImageConcept] = useState("");

  // Reset selected option when exercise changes
  React.useEffect(() => {
    setSelectedImageConcept("");
  }, [exercise]);

  const handleSubmit = () => {
    onSubmitAnswer(selectedImageConcept);
  };

  const isCorrect = showResult && submissionResult?.exercise?.result?.isCorrect;
  const correctAnswerConcept = showResult ? exercise.correctAnswer : "";

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction || "Nghe từ và chọn hình ảnh đúng:"}
      </h2>

      {/* Audio Play Button */}
      {exercise.question && ( // exercise.question is the audioUrl here
        <div className="mb-6">
          <AudioPlayer src={exercise.question} className="mb-2" />
          <p className="text-gray-600 text-sm">Nhấn để nghe phát âm</p>
        </div>
      )}

      {/* Image Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-6">
        {Array.isArray(exercise.options) &&
          exercise.options.map((option, index) => (
            <motion.div
              key={index}
              onClick={() =>
                !showResult && setSelectedImageConcept(option.concept)
              }
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ease-in-out cursor-pointer
                        ${
                          selectedImageConcept === option.concept
                            ? "bg-lexi-button border-lexi-button shadow-md"
                            : "bg-gray-100/50 border-gray-200/50 hover:bg-gray-200/50"
                        }
                        ${
                          showResult &&
                          (option.concept === correctAnswerConcept
                            ? "!bg-green-100 !border-green-500"
                            : selectedImageConcept === option.concept
                            ? "!bg-red-100 !text-red-700 !border-red-500"
                            : "")
                        }
                        ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
                        `}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              disabled={showResult || isLoading}
            >
              <img
                src={option.imageUrl}
                alt={option.concept}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <p
                className={`text-sm text-center font-medium ${
                  selectedImageConcept === option.concept
                    ? "text-white"
                    : "text-lexi-headline"
                }`}
              >
                {option.concept}
              </p>
            </motion.div>
          ))}
      </div>

      {!showResult && (
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!selectedImageConcept || isLoading}
          variant="primary"
          size="lg"
          className="w-full max-w-md"
        >
          Kiểm tra
        </Button>
      )}
    </div>
  );
};

export default ListenChooseImageExercise;
