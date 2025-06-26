import { useEffect, useState } from "react"; // Ensure useEffect is imported
import Button from "../common/Button";
import InputField from "../common/InputField";

const SentenceConstructionExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [userAnswer, setUserAnswer] = useState("");

  // Reset answer when exercise changes
  useEffect(() => {
    // Using useEffect for React.useEffect
    setUserAnswer("");
  }, [exercise]);

  const handleSubmit = () => {
    onSubmitAnswer(userAnswer);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction ||
          `Viết một câu tiếng Anh sử dụng từ "${
            exercise.vocabulary?.word || "từ vựng"
          }" và định nghĩa của nó:`}
      </h2>

      {exercise.instruction &&
        exercise.instruction.includes("định nghĩa của nó") &&
        exercise.vocabulary?.englishDefinition && (
          <p className="text-gray-600 text-base italic mb-4 text-center">
            Định nghĩa: "{exercise.vocabulary.englishDefinition}"
          </p>
        )}

      <div className="w-full max-w-2xl mb-6">
        <InputField
          name="sentence"
          placeholder="Viết câu của bạn ở đây..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          isTextArea={true}
          rows="4"
          disabled={showResult || isLoading}
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
          Gửi câu trả lời
        </Button>
      )}
    </div>
  );
};

export default SentenceConstructionExercise;
