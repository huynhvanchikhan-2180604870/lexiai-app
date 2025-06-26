import React, { useState } from "react";
import Button from "../common/Button";
import InputField from "../common/InputField";

const FillInBlankExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [userAnswer, setUserAnswer] = useState("");

  // Reset answer when exercise changes
  React.useEffect(() => {
    setUserAnswer("");
  }, [exercise]);

  const handleSubmit = () => {
    onSubmitAnswer(userAnswer);
  };

  const isCorrect = showResult && submissionResult?.exercise?.result?.isCorrect;
  const correctAnswer = showResult ? exercise.correctAnswer : "";

  // Function to highlight correct/incorrect word in the example
  const highlightAnswer = (question, correct, user, isCorrectOverall) => {
    const parts = question.split("____");
    return (
      <p className="text-xl font-medium text-gray-800 leading-relaxed">
        {parts[0]}
        {showResult ? (
          <span
            className={`px-2 py-0.5 rounded-md font-semibold mx-1
                           ${
                             isCorrectOverall
                               ? "bg-green-100 text-green-700"
                               : "bg-red-100 text-red-700"
                           }`}
          >
            {isCorrectOverall ? correct : user || "____"}
          </span>
        ) : (
          <span className="text-lexi-button font-bold text-2xl mx-1">____</span>
        )}
        {parts[1]}
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction || "Điền từ thích hợp vào chỗ trống:"}
      </h2>

      <div className="w-full max-w-xl mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 shadow-sm text-center">
        {highlightAnswer(
          exercise.question,
          correctAnswer,
          userAnswer,
          isCorrect
        )}
      </div>

      <div className="w-full max-w-md mb-6">
        <InputField
          name="fillInBlankAnswer"
          placeholder="Nhập từ của bạn..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={showResult || isLoading}
          className={`${
            showResult
              ? isCorrect
                ? "border-green-500"
                : "border-red-500"
              : ""
          }`}
        />
      </div>

      {!showResult && (
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!userAnswer.trim() || isLoading}
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

export default FillInBlankExercise;
