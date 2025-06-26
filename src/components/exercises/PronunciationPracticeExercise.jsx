import { motion } from "framer-motion";
import { Mic, StopCircle, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import Button from "../common/Button";

const PronunciationPracticeExercise = ({
  exercise,
  onSubmitAnswer,
  showResult,
  submissionResult,
  isLoading,
}) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript,
    setError: setSpeechError,
  } = useSpeechRecognition();
  const [hasRecorded, setHasRecorded] = useState(false);

  // Reset transcript and recording state when exercise changes
  useEffect(() => {
    setTranscript("");
    setSpeechError("");
    setHasRecorded(false);
  }, [exercise, setTranscript, setSpeechError]);

  const handleStartRecording = () => {
    setHasRecorded(false);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    setHasRecorded(true);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onSubmitAnswer(transcript); // Send transcribed text to backend for AI evaluation
    } else {
      toast.error("Vui lòng ghi âm phát âm của bạn trước khi kiểm tra.");
    }
  };

  const wordData = exercise.vocabulary;

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h2 className="text-2xl font-bold text-lexi-headline mb-6 text-center">
        {exercise.instruction ||
          `Hãy phát âm từ "${wordData?.word || "từ vựng"}"`}
      </h2>

      {/* Target Word and Phonetic */}
      <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-gray-200/50 text-center w-full max-w-md">
        <p className="text-4xl font-extrabold text-lexi-headline">
          {wordData?.word || "N/A"}
        </p>
        <p className="text-2xl text-gray-600 italic mt-2">
          {wordData?.phonetic || "N/A"}
        </p>
        {wordData?.mouthArticulationVideoUrl &&
          wordData.mouthArticulationVideoUrl !== "N/A" && (
            <a
              href={wordData.mouthArticulationVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-lexi-button hover:underline text-sm font-medium mt-3"
            >
              <Video size={20} className="mr-1" /> Xem khẩu hình miệng
            </a>
          )}
      </div>

      {/* Recording Controls */}
      <div className="flex space-x-4 mb-6">
        {!showResult && !isListening && (
          <Button
            onClick={handleStartRecording}
            disabled={isLoading || isListening}
            variant="primary"
            size="lg"
            className="!bg-green-500 hover:!bg-green-600"
          >
            <Mic size={24} className="mr-2" /> Bắt đầu ghi âm
          </Button>
        )}
        {!showResult && isListening && (
          <Button
            onClick={handleStopRecording}
            disabled={isLoading || !isListening}
            variant="danger"
            size="lg"
          >
            <StopCircle size={24} className="mr-2" /> Dừng ghi âm
          </Button>
        )}
      </div>

      {/* Live Transcript / Recorded Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100/70 p-3 rounded-lg border border-gray-200/50 text-gray-800 text-lg italic text-center w-full max-w-md mb-6"
        >
          Bạn đã nói: "{transcript}"
        </motion.div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {/* Submit Button */}
      {!showResult && hasRecorded && !isListening && (
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!transcript.trim() || isLoading}
          variant="primary"
          size="lg"
          className="w-full max-w-md"
        >
          Kiểm tra phát âm
        </Button>
      )}
    </div>
  );
};

export default PronunciationPracticeExercise;
