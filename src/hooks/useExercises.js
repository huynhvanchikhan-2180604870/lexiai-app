import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  generateExercises,
  submitExerciseAnswer,
} from "../services/exerciseApi";

export const useExercises = (limit = 5) => {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showResult, setShowResult] = useState(false); // Controls showing feedback after submission
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null); // Stores full result object from backend

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentExercise = exercises[currentExerciseIndex];

  // Function to generate exercises
  const fetchExercises = useCallback(async (numExercises) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateExercises(numExercises);
      if (response.data && response.data.length > 0) {
        setExercises(response.data);
        setCurrentExerciseIndex(0);
        setShowResult(false);
        setLastSubmissionResult(null);
        toast.success(`Đã tạo ${response.data.length} bài tập mới!`);
      } else {
        setExercises([]);
        toast(
          "Không có bài tập nào được tạo. Hãy thêm từ vựng mới hoặc ôn tập các từ cũ.",
          { icon: "ℹ️" }
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi khi tạo bài tập.";
      setError(errorMessage);
      toast.error(errorMessage);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to submit an answer
  const submitAnswer = useCallback(
    async (userAnswer) => {
      if (!currentExercise || isLoading) return;

      setIsLoading(true);
      setError(null);
      try {
        const result = await submitExerciseAnswer(
          currentExercise._id,
          userAnswer
        );
        setLastSubmissionResult(result);
        setShowResult(true);
        toast.success(
          result.exercise.result.feedback || "Bài tập đã được chấm điểm!"
        );
        // Optionally update global user state (e.g., via AuthContext) here if user data is part of the result
        // e.g., if useAuth context exposed a `updateUser` function:
        // useAuth().updateUser(result.updatedUser);
        return result; // Return result for parent component if needed
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Lỗi khi chấm điểm bài tập.";
        setError(errorMessage);
        toast.error(errorMessage);
        // Set a generic error result to show feedback even on submission failure
        setLastSubmissionResult({
          exercise: {
            ...currentExercise,
            result: { isCorrect: false, feedback: errorMessage, score: 0 },
          },
          updatedUser: null,
          xpEarned: 0,
          newLevel: null,
          betaRewardEarned: null,
        });
        setShowResult(true); // Still show feedback on error
        throw err; // Re-throw error to be caught by parent component if desired
      } finally {
        setIsLoading(false);
      }
    },
    [currentExercise, isLoading]
  );

  // Function to move to the next exercise
  const goToNextExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setShowResult(false);
      setLastSubmissionResult(null);
    } else {
      // If all exercises in current set are done, generate more
      toast(
        "Bạn đã hoàn thành tất cả bài tập trong phiên này! Đang tạo bài tập mới...",
        { icon: "👏" }
      );
      fetchExercises(limit);
    }
  }, [currentExerciseIndex, exercises.length, fetchExercises, limit]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchExercises(limit);
  }, [fetchExercises, limit]);

  return {
    exercises,
    currentExercise,
    currentExerciseIndex,
    isLoading,
    error,
    showResult,
    lastSubmissionResult,
    fetchExercises, // Allow parent to trigger re-generation
    submitAnswer,
    goToNextExercise,
  };
};
