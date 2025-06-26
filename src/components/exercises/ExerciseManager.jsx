import { AnimatePresence, motion } from "framer-motion";
import FillInBlankExercise from "./FillInBlankExercise";
import FlashcardExercise from "./FlashcardExercise";
import ListenChooseImageExercise from "./ListenChooseImageExercise";
import MatchingExercise from "./MatchingExercise";
import MultipleChoiceExercise from "./MultipleChoiceExercise";
import PronunciationPracticeExercise from "./PronunciationPracticeExercise";
import SentenceConstructionExercise from "./SentenceConstructionExercise";

const ExerciseManager = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  if (!exercise) {
    return (
      <div className="text-center text-gray-500 h-64 flex items-center justify-center">
        Đang tải bài tập...
      </div>
    );
  }

  const exerciseComponentMap = {
    flashcard: FlashcardExercise,
    multiple_choice: MultipleChoiceExercise,
    fill_in_blank: FillInBlankExercise,
    sentence_construction: SentenceConstructionExercise,
    pronunciation_practice: PronunciationPracticeExercise,
    matching: MatchingExercise,
    listen_choose_image: ListenChooseImageExercise,
  };

  const SpecificExerciseComponent = exerciseComponentMap[exercise.exerciseType];

  if (!SpecificExerciseComponent) {
    console.error(
      `Error: Component for exercise type "${exercise.exerciseType}" not found.`
    );
    return (
      <div className="text-center text-red-500 h-64 flex items-center justify-center">
        Lỗi: Dạng bài tập "{exercise.exerciseType}" không được hỗ trợ.
      </div>
    );
  }

  // Log the exercise type being rendered for debugging purposes
  console.log(
    `ExerciseManager: Rendering ${exercise.exerciseType} exercise with ID ${exercise._id}`
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={exercise._id} // Key ensures component remounts for new exercise, triggering animations
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full"
      >
        <SpecificExerciseComponent
          exercise={exercise}
          onSubmitAnswer={onSubmitAnswer}
          showResult={showResult}
          submissionResult={submissionResult}
          isLoading={isLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ExerciseManager;
