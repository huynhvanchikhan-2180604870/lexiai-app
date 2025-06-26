import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "../common/Button";

const MatchingExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const [leftOptions, setLeftOptions] = useState([]); // Words (question)
  const [rightOptions, setRightOptions] = useState([]); // Definitions (options)
  const [selectedLeft, setSelectedLeft] = useState(null); // Currently selected left item
  const [matches, setMatches] = useState({}); // Stores user's selected matches {leftId: rightId_text}
  const [revealedCorrectness, setRevealedCorrectness] = useState({}); // {id: boolean} for showing correct/incorrect after match

  // Initialize options when exercise changes
  useEffect(() => {
    if (exercise?.question && exercise?.options) {
      setLeftOptions(exercise.question);
      setRightOptions(exercise.options);
      setMatches({});
      setSelectedLeft(null);
      setRevealedCorrectness({});
    }
  }, [exercise]);

  const handleLeftClick = (item) => {
    if (showResult || isLoading || matches[item.id]) return; // Cannot select already matched or after result
    setSelectedLeft(item);
  };

  const handleRightClick = (rightItem) => {
    if (
      showResult ||
      isLoading ||
      !selectedLeft ||
      Object.values(matches).includes(rightItem.text)
    )
      return; // Cannot select if no left selected or already matched

    const newMatches = { ...matches, [selectedLeft.id]: rightItem.text }; // Store the right item's text as the match for left item's ID
    setMatches(newMatches);
    setSelectedLeft(null); // Clear selection

    // Optional: Immediately show if this specific pair is correct (visual feedback)
    // This is client-side evaluation, backend does the definitive check
    const correctAnswerMapping = JSON.parse(exercise.correctAnswer);
    if (
      rightItem.text.toLowerCase().trim() ===
      correctAnswerMapping[selectedLeft.id]?.toLowerCase().trim()
    ) {
      setRevealedCorrectness((prev) => ({ ...prev, [selectedLeft.id]: true }));
    } else {
      setRevealedCorrectness((prev) => ({ ...prev, [selectedLeft.id]: false }));
    }
  };

  const handleSubmit = () => {
    // Convert matches to backend format {questionId: userAnswerText}
    onSubmitAnswer(JSON.stringify(matches));
  };

  const renderCorrectnessIcon = (questionId) => {
    if (!showResult && revealedCorrectness[questionId] === undefined)
      return null; // Only show if result is being shown or already revealed

    const isThisPairCorrect = revealedCorrectness[questionId];

    if (isThisPairCorrect) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-2 text-green-500"
        >
          ✔
        </motion.span>
      );
    } else if (revealedCorrectness[questionId] === false) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-2 text-red-500"
        >
          ✘
        </motion.span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction || "Ghép từ với nghĩa tiếng Việt tương ứng:"}
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-4xl mb-6">
        {/* Left Column (Words) */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-xl shadow-custom-light-lg p-4 border border-white/60">
          <h3 className="text-xl font-semibold text-lexi-headline mb-4">
            Từ vựng
          </h3>
          <ul className="space-y-3">
            {leftOptions.map((item) => (
              <motion.li
                key={item.id}
                onClick={() => handleLeftClick(item)}
                className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out flex justify-between items-center
                            ${
                              selectedLeft?.id === item.id
                                ? "bg-lexi-button text-white shadow-md"
                                : "bg-gray-100/50 text-lexi-headline hover:bg-gray-200/50"
                            }
                            ${
                              matches[item.id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } ${showResult ? "cursor-not-allowed" : ""}
                            `}
                whileTap={{
                  scale:
                    selectedLeft?.id === item.id ||
                    showResult ||
                    matches[item.id]
                      ? 1
                      : 0.98,
                }}
              >
                <span>{item.text}</span>
                {getMatchedRightText(item.id) && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {getMatchedRightText(item.id).substring(0, 15)}...
                  </span>
                )}
                {renderCorrectnessIcon(item.id)}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Column (Definitions/Options) */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-xl shadow-custom-light-lg p-4 border border-white/60">
          <h3 className="text-xl font-semibold text-lexi-headline mb-4">
            Nghĩa
          </h3>
          <ul className="space-y-3">
            {rightOptions.map((item) => (
              <motion.li
                key={item.id}
                onClick={() => handleRightClick(item)}
                className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                            ${
                              Object.values(matches).includes(item.text)
                                ? "opacity-50 cursor-not-allowed"
                                : "bg-gray-100/50 text-lexi-subheadline hover:bg-gray-200/50"
                            }
                            ${showResult ? "cursor-not-allowed" : ""}
                            `}
                whileTap={{
                  scale:
                    Object.values(matches).includes(item.text) || showResult
                      ? 1
                      : 0.98,
                }}
              >
                {item.text}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {!showResult && (
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={
            Object.keys(matches).length !== leftOptions.length || isLoading
          }
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

export default MatchingExercise;
