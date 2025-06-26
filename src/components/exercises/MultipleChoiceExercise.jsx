import { motion } from "framer-motion";
import React, { useState } from "react";
import Button from "../common/Button";

const MultipleChoiceExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  // Reset selected option when exercise changes
  React.useEffect(() => {
    setSelectedOption("");
  }, [exercise]);

  const handleSubmit = () => {
    onSubmitAnswer(selectedOption);
  };

  const isCorrect = showResult && submissionResult?.exercise?.result?.isCorrect;
  const correctAnswer = showResult ? exercise.correctAnswer : "";

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction ||
          `Chọn nghĩa tiếng Việt đúng của từ "${
            exercise.vocabulary?.word || "từ vựng"
          }"`}
      </h2>

      <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-6">
        {Array.isArray(exercise.options) &&
          exercise.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showResult && setSelectedOption(option)}
              className={`w-full py-3 px-4 rounded-xl text-lg font-medium border-2 transition-all duration-200 ease-in-out
                        ${
                          selectedOption === option
                            ? "bg-lexi-button text-white border-lexi-button shadow-md"
                            : "bg-gray-100 text-lexi-subheadline border-gray-200 hover:bg-gray-200/50"
                        }
                        ${
                          showResult &&
                          (option === correctAnswer
                            ? "!bg-green-100 !text-green-700 !border-green-500"
                            : selectedOption === option
                            ? "!bg-red-100 !text-red-700 !border-red-500"
                            : "")
                        }
                        ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
                        `}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              disabled={showResult || isLoading}
            >
              {option}
            </motion.button>
          ))}
      </div>

      {!showResult && (
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!selectedOption || isLoading}
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

export default MultipleChoiceExercise;
