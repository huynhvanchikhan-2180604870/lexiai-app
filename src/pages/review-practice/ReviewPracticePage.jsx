import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react"; // Import useRef
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ExerciseManager from "../../components/exercises/ExerciseManager";
import { useApi } from "../../hooks/useApi";
import {
  generateExercises,
  submitExerciseAnswer,
} from "../../services/exerciseApi";

const ReviewPracticePage = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);

  const {
    data: generatedExercises,
    loading: generatingExercises,
    error: generateError,
    execute: executeGenerateExercises,
  } = useApi(generateExercises);
  const {
    loading: submittingAnswer,
    error: submitError,
    execute: executeSubmitAnswer,
  } = useApi(submitExerciseAnswer);

  const currentExercise = exercises[currentExerciseIndex];

  const hasFetchedExercises = useRef(false); // Ref to track if exercises have been fetched

  // Fetch exercises on component mount, only once
  useEffect(() => {
    if (!hasFetchedExercises.current) {
      // Only run if not fetched before
      console.log(
        "ReviewPracticePage: Fetching exercises on mount (first time)..."
      );
      executeGenerateExercises(5); // Generate 5 exercises initially
      hasFetchedExercises.current = true; // Mark as fetched
    }
  }, [executeGenerateExercises]);

  // Update exercises state when new exercises are generated
  useEffect(() => {
    if (generatedExercises !== null) {
      if (generatedExercises.length > 0) {
        console.log(
          "ReviewPracticePage: Bài tập đã tạo thành công:",
          generatedExercises
        );
        // Add a user-friendly instruction to each exercise based on its type
        const exercisesWithInstructions = generatedExercises.map((ex) => {
          let instruction = "";
          // Ensure ex.vocabulary is an object before accessing its properties
          const word = ex.vocabulary?.word || "từ vựng";
          const phonetic = ex.vocabulary?.phonetic || "N/A";
          const englishDefinition = ex.vocabulary?.englishDefinition || "N/A";

          switch (ex.exerciseType) {
            case "flashcard":
              instruction = "Nhấn vào thẻ để xem nghĩa và tự đánh giá:";
              break;
            case "multiple_choice":
              instruction = `Chọn nghĩa tiếng Việt đúng của từ "${word}":`;
              break;
            case "fill_in_blank":
              instruction = `Điền từ thích hợp vào chỗ trống:`;
              break;
            case "sentence_construction":
              instruction = `Viết một câu tiếng Anh sử dụng từ "${word}" (định nghĩa: ${englishDefinition}):`;
              break;
            case "pronunciation_practice":
              instruction = `Hãy phát âm từ "${word}" theo phiên âm: ${phonetic}`;
              break;
            case "matching":
              instruction = "Ghép từ vựng với nghĩa tiếng Việt tương ứng:";
              break;
            case "listen_choose_image":
              instruction = `Nghe từ "${word}" và chọn hình ảnh đúng:`;
              break;
            default:
              instruction = "Hoàn thành bài tập:";
              break;
          }
          console.log(
            `ReviewPracticePage: Exercise ${ex._id} (${ex.exerciseType}) for "${word}" - Instruction: "${instruction}"`
          );
          return { ...ex, instruction };
        });
        setExercises(exercisesWithInstructions);
        setCurrentExerciseIndex(0);
        setShowResult(false);
        setLastSubmissionResult(null);
      } else if (
        generatedExercises.length === 0 &&
        !generatingExercises &&
        !generateError
      ) {
        console.log(
          "ReviewPracticePage: Không có bài tập nào được tạo (mảng rỗng)."
        );
        setExercises([]);
        toast(
          "Không có bài tập nào được tạo. Hãy thêm từ vựng mới hoặc ôn tập các từ cũ.",
          { icon: "ℹ️", duration: 5000 }
        );
      }
    }
  }, [generatedExercises, generatingExercises, generateError]);

  const handleGenerateMoreExercises = useCallback(() => {
    setExercises([]);
    setCurrentExerciseIndex(0);
    setShowResult(false);
    setLastSubmissionResult(null);
    console.log("ReviewPracticePage: Generating more exercises...");
    executeGenerateExercises(5);
  }, [executeGenerateExercises]);

  const handleSubmitAnswer = useCallback(
    async (userAnswer) => {
      if (!currentExercise || submittingAnswer) return;

      try {
        const result = await executeSubmitAnswer(
          currentExercise._id,
          userAnswer
        );
        setLastSubmissionResult(result);
        setShowResult(true);

        toast.success(
          result.exercise.result.feedback || "Bài tập đã được chấm điểm!"
        );
      } catch (error) {
        console.error("ReviewPracticePage: Lỗi khi chấm điểm bài tập:", error);
        setShowResult(true);
        setLastSubmissionResult({
          exercise: {
            ...currentExercise,
            result: {
              isCorrect: false,
              feedback: error.message || "Lỗi khi chấm điểm.",
              score: 0,
            },
          },
          updatedUser: null,
          xpEarned: 0,
          newLevel: null,
          betaRewardEarned: null,
        });
      }
    },
    [currentExercise, submittingAnswer, executeSubmitAnswer]
  );

  const handleNextExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setShowResult(false);
      setLastSubmissionResult(null);
    } else {
      toast.success(
        "Bạn đã hoàn thành tất cả bài tập trong phiên này! Đang tạo bài tập mới...",
        { icon: "👏", duration: 5000 }
      );
      handleGenerateMoreExercises();
    }
  }, [currentExerciseIndex, exercises.length, handleGenerateMoreExercises]);

  if (generatingExercises) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
        <LoadingSpinner size="lg" color="text-lexi-button" />
      </div>
    );
  }

  if (generateError) {
    console.error(
      "ReviewPracticePage: Lỗi tạo bài tập (Frontend):",
      generateError
    );
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200 min-h-[calc(100vh-250px)]">
        Lỗi khi tạo bài tập: {generateError}
        <Button
          onClick={handleGenerateMoreExercises}
          variant="primary"
          className="mt-4"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  // Display message if no exercises are generated AND not currently loading
  if (exercises.length === 0 && !generatingExercises) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 text-center text-gray-500 bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg border border-white/60 min-h-[calc(100vh-250px)] flex flex-col justify-center items-center"
      >
        <p className="text-xl font-semibold mb-4 text-lexi-subheadline">
          Chưa có bài tập nào sẵn sàng.
        </p>
        <p className="text-gray-600 mb-6">
          Hãy đảm bảo bạn đã thêm từ vựng vào danh sách của mình hoặc các từ đã
          đủ điều kiện ôn tập.
        </p>
        <Button onClick={handleGenerateMoreExercises} variant="primary">
          Tạo bài tập
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="p-4 pt-20 pb-20 md:pt-4 md:pb-4 min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-bold text-lexi-headline mb-8 text-center">
        Luyện tập từ vựng
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60 max-w-2xl mx-auto"
      >
        <div className="text-center text-gray-600 mb-4">
          Bài tập {currentExerciseIndex + 1} / {exercises.length}
        </div>

        {/* Exercise Type Renderer */}
        {currentExercise ? (
          <ExerciseManager
            exercise={currentExercise}
            onSubmitAnswer={handleSubmitAnswer}
            showResult={showResult}
            submissionResult={lastSubmissionResult}
            isLoading={submittingAnswer}
          />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            {/* Display loading spinner if no current exercise but exercises array is empty while generating */}
            {generatingExercises ? (
              <LoadingSpinner size="lg" color="text-lexi-button" />
            ) : (
              "Đang chuẩn bị bài tập đầu tiên..."
            )}
          </div>
        )}

        {/* Navigation and Feedback Buttons */}
        {showResult && lastSubmissionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-4 border-t border-gray-200/50 flex flex-col items-center space-y-4"
          >
            {/* AI Feedback */}
            <p
              className={`text-lg font-semibold text-center ${
                lastSubmissionResult.exercise.result.isCorrect
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {lastSubmissionResult.exercise.result.feedback}
            </p>
            {/* Score Display (if applicable) */}
            {lastSubmissionResult.exercise.result.score !== null && (
              <p className="text-xl font-bold text-lexi-headline">
                Điểm:{" "}
                <span className="text-lexi-button">
                  {lastSubmissionResult.exercise.result.score}
                </span>{" "}
                / 100
              </p>
            )}
            {/* XP/Beta Reward Notification */}
            {lastSubmissionResult.xpEarned > 0 && (
              <p className="text-base text-gray-700">
                Bạn nhận được{" "}
                <span className="font-bold text-blue-600">
                  {lastSubmissionResult.xpEarned} XP
                </span>
                !
                {lastSubmissionResult.newLevel >
                  lastSubmissionResult.user?.level - 1 &&
                  lastSubmissionResult.user?.level && (
                    <span className="font-bold text-green-600 ml-2">
                      Bạn đã lên Level {lastSubmissionResult.newLevel}! 🎉
                    </span>
                  )}
              </p>
            )}
            {lastSubmissionResult.betaRewardEarned > 0 && (
              <p className="text-base text-gray-700">
                Bạn nhận được{" "}
                <span className="font-bold text-lexi-illustration-tertiary">
                  {lastSubmissionResult.betaRewardEarned} Beta
                </span>
                !
              </p>
            )}

            <Button
              onClick={handleNextExercise}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Bài tập tiếp theo
              <Play size={20} className="ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewPracticePage;
