import { AnimatePresence, motion } from "framer-motion"; // Import AnimatePresence
import { Edit, Link as LinkIcon, Speaker, Trash2, Video } from "lucide-react";
import { formatTimeAgo } from "../../utils/helpers";
import AudioPlayer from "../common/AudioPlayer";
import Button from "../common/Button";

const WordCard = ({
  wordData,
  onEdit,
  onDelete,
  onPlayAudio,
  isDetailedView = false,
  className = "",
}) => {
  if (!wordData) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không tìm thấy dữ liệu từ vựng.
      </div>
    );
  }

  const renderSynonyms = (syns) => {
    return syns && syns.length > 0 ? syns.join(", ") : "N/A";
  };

  const renderAntonyms = (ants) => {
    return ants && ants.length > 0 ? ants.join(", ") : "N/A";
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

  return (
    <motion.div
      className={`relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60 h-full flex flex-col justify-between ${className}`}
    >
      {/* Time Added Tag */}
      {wordData.addedAt && (
        <div className="absolute top-3 right-4 bg-gray-100/70 backdrop-blur-sm text-gray-600 text-[14px] px-3 py-1 rounded-full shadow-sm">
          {formatTimeAgo(wordData.addedAt)}
        </div>
      )}
      {/* Main Content Area */}
      <div className="mt-3">
        <div className="flex justify-between items-start mb-4 pr-16">
          <div>
            <h3 className="text-3xl font-extrabold text-lexi-headline mb-1">
              {wordData.word}
            </h3>
            {wordData.translation &&
              wordData.translation !== "N/A (AI Failed)" &&
              wordData.translation !== "N/A (No Definition)" && (
                <p className="text-xl font-bold text-lexi-button mb-2">
                  {wordData.translation}
                </p>
              )}
            {wordData.phonetic && wordData.phonetic !== "N/A" && (
              <p className="text-lg text-gray-600 italic mb-3">
                {wordData.phonetic}
              </p>
            )}
          </div>
          <div className="flex space-x-2 z-10">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                aria-label="Edit word"
              >
                <Edit size={20} className="text-lexi-illustration-secondary" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                aria-label="Delete word"
              >
                <Trash2 size={20} className="text-red-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Essential Info for concise view */}
        <div className="grid grid-cols-1 gap-y-2 text-lexi-subheadline text-sm mb-4">
          <div>
            <p className="font-semibold text-lexi-headline">Loại từ:</p>
            <p>{wordData.wordType || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-lexi-headline">Độ khó:</p>
            {renderDifficulty(wordData.difficulty)}
          </div>
        </div>

        {/* Detailed View Content (only if isDetailedView is true) */}
        <AnimatePresence>
          {isDetailedView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lexi-subheadline text-sm border-t pt-4 mt-4 border-gray-100"
            >
              <div className="md:col-span-2">
                <p className="font-semibold text-lexi-headline">
                  Định nghĩa tiếng Anh:
                </p>
                <p>{wordData.englishDefinition || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-lexi-headline">
                  Định nghĩa tiếng Việt:
                </p>
                <p>{wordData.vietnameseDefinition || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-lexi-headline">
                  Ví dụ tiếng Anh:
                </p>
                <p className="italic">{wordData.example || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-lexi-headline">
                  Ví dụ tiếng Việt:
                </p>
                <p className="italic">{wordData.vietnameseExample || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-lexi-headline">
                  Từ đồng nghĩa:
                </p>
                <p className="break-words">
                  {renderSynonyms(wordData.synonyms)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-lexi-headline">
                  Từ trái nghĩa:
                </p>
                <p className="break-words">
                  {renderAntonyms(wordData.antonyms)}
                </p>
              </div>
              {wordData.notes && (
                <div className="md:col-span-2">
                  <p className="font-semibold text-lexi-headline">
                    Ghi chú của tôi:
                  </p>
                  <p>{wordData.notes}</p>
                </div>
              )}
              {wordData.nextReviewAt && (
                <div className="md:col-span-2">
                  <p className="font-semibold text-lexi-headline">
                    Ôn tập tiếp theo:
                  </p>
                  <p>
                    {new Date(wordData.nextReviewAt).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    ({wordData.repetitions} lần lặp lại, EF:{" "}
                    {wordData.easeFactor?.toFixed(2)})
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>{" "}
      {/* End of main content wrapper */}
      {/* Action Buttons & Links at the bottom of the card */}
      <div className="flex flex-wrap sm:flex-row sm:justify-start items-center space-x-2 space-y-2 sm:space-y-0 mt-6 pt-4 border-t border-gray-100">
        {wordData.audioUrl && wordData.audioUrl !== "N/A" && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Speaker size={20} className="text-lexi-button" />
            <AudioPlayer src={wordData.audioUrl} />
            <span className="text-sm text-gray-600">Nghe</span>
          </div>
        )}
        {wordData.mouthArticulationVideoUrl &&
          wordData.mouthArticulationVideoUrl !== "N/A" && (
            <a
              href={wordData.mouthArticulationVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-lexi-button hover:underline text-sm font-medium flex-shrink-0"
            >
              <Video size={20} className="mr-1" /> Khẩu hình
            </a>
          )}
        {wordData.cambridgeLink && (
          <a
            href={wordData.cambridgeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline text-sm font-medium flex-shrink-0"
          >
            <LinkIcon size={20} className="mr-1" /> Cambridge
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default WordCard;
