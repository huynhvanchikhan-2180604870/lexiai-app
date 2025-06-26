import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import Modal from "../../components/common/Modal";
import VocabCardGrid from "../../components/vocabulary/VocabCardGrid";
import WordCard from "../../components/vocabulary/WordCard";
import { useApi } from "../../hooks/useApi";
import {
  addWord,
  deleteWord,
  getAllWords,
  updateWord,
} from "../../services/vocabApi";

const VocabPage = () => {
  const [newWordInput, setNewWordInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState(null); // For showing detailed WordCard in modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWordData, setEditingWordData] = useState(null);

  const {
    data: vocabList,
    loading: loadingVocab,
    error: vocabError,
    execute: fetchVocabList,
    setData: setVocabList,
  } = useApi(getAllWords);
  const { loading: addingWord, execute: executeAddWord } = useApi(addWord);
  const { loading: updatingWord, execute: executeUpdateWord } =
    useApi(updateWord);
  const { loading: deletingWord, execute: executeDeleteWord } =
    useApi(deleteWord);

  useEffect(() => {
    fetchVocabList();
  }, [fetchVocabList]);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWordInput.trim()) {
      toast.error("Vui lòng nhập từ mới.");
      return;
    }
    try {
      const newWord = await executeAddWord(newWordInput);
      setVocabList((prev) => (prev ? [newWord, ...prev] : [newWord]));
      setNewWordInput("");
      toast.success(`Đã thêm từ "${newWord.word}" thành công!`);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleEditWord = (word) => {
    setSelectedWord(null); // Close detail modal if open
    setEditingWordData({ ...word }); // Clone word data for editing
    setIsEditModalOpen(true);
  };

  const handleUpdateWordSubmit = async (e) => {
    e.preventDefault();
    if (!editingWordData || !editingWordData._id) return;

    try {
      const updated = await executeUpdateWord(
        editingWordData._id,
        editingWordData
      );
      setVocabList((prev) =>
        prev.map((word) => (word._id === updated._id ? updated : word))
      );
      setIsEditModalOpen(false);
      setEditingWordData(null);
      toast.success(`Đã cập nhật từ "${updated.word}" thành công!`);
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const handleDeleteWord = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa từ này không?")) {
      try {
        await executeDeleteWord(id);
        setVocabList((prev) => prev.filter((word) => word._id !== id));
        toast.success("Đã xóa từ thành công!");
        if (selectedWord && selectedWord._id === id) {
          setSelectedWord(null);
        }
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
  };

  const handleShowDetails = (word) => {
    setSelectedWord(word);
  };

  const handlePlayAudio = (src) => {
    console.log("Playing audio:", src);
  };

  const filteredVocabList =
    vocabList?.filter(
      (word) =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.englishDefinition
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        word.vietnameseDefinition
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="p-4 pt-20 pb-20 md:pt-4 md:pb-4 min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-bold text-lexi-headline mb-8 mt-20 text-center"></h1>

      {/* Add New Word Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 mb-8 border border-white/60"
      >
        <form
          onSubmit={handleAddWord}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <InputField
            label="Mật khẩu"
            type="text"
            name="newWord"
            value={newWordInput}
            onChange={(e) => setNewWordInput(e.target.value)}
            placeholder="Nhập từ tiếng Anh mới..."
            icon={Plus}
            disabled={addingWord}
          />
          <Button
            type="submit"
            loading={addingWord}
            variant="primary"
            className="mt-auto mb-auto"
          >
            {addingWord ? "Đang thêm..." : "Thêm từ"}
          </Button>
        </form>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-4 mb-8 border border-white/60"
      >
        <InputField
          name="searchVocab"
          placeholder="Tìm kiếm từ vựng (tiếng Anh, tiếng Việt, nghĩa, ...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </motion.div>

      {/* Vocabulary List as Cards */}
      <VocabCardGrid
        vocabList={filteredVocabList}
        onEdit={handleEditWord}
        onDelete={handleDeleteWord}
        onPlayAudio={handlePlayAudio}
        onShowDetails={handleShowDetails}
        loading={loadingVocab}
        error={vocabError}
      />

      {/* Word Detail Modal */}
      <Modal
        isOpen={selectedWord !== null}
        onClose={() => setSelectedWord(null)}
        title="Chi tiết từ vựng"
      >
        {/* Render WordCard in detailed view inside the modal */}
        <WordCard
          wordData={selectedWord}
          onEdit={handleEditWord}
          onDelete={handleDeleteWord}
          onPlayAudio={handlePlayAudio} // Ensure play audio works here
          isDetailedView={true} // <<< Added this prop to enable full detail view
        />
      </Modal>

      {/* Edit Word Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Chỉnh sửa từ: ${editingWordData?.word}`}
      >
        {editingWordData && (
          <form onSubmit={handleUpdateWordSubmit}>
            <InputField
              label="Từ vựng"
              name="word"
              value={editingWordData.word}
              onChange={(e) =>
                setEditingWordData({ ...editingWordData, word: e.target.value })
              }
              disabled
            />
            <InputField
              label="Phiên âm"
              name="phonetic"
              value={editingWordData.phonetic || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  phonetic: e.target.value,
                })
              }
            />
            <InputField
              label="Định nghĩa tiếng Anh"
              name="englishDefinition"
              value={editingWordData.englishDefinition || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  englishDefinition: e.target.value,
                })
              }
              isTextArea={true}
            />
            <InputField
              label="Định nghĩa tiếng Việt"
              name="vietnameseDefinition"
              value={editingWordData.vietnameseDefinition || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  vietnameseDefinition: e.target.value,
                })
              }
              isTextArea={true}
            />
            <InputField
              label="Ví dụ tiếng Anh"
              name="example"
              value={editingWordData.example || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  example: e.target.value,
                })
              }
              isTextArea={true}
            />
            <InputField
              label="Ví dụ tiếng Việt"
              name="vietnameseExample"
              value={editingWordData.vietnameseExample || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  vietnameseExample: e.target.value,
                })
              }
              isTextArea={true}
            />
            <InputField
              label="Độ khó"
              name="difficulty"
              value={editingWordData.difficulty || "Chưa xếp loại"}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  difficulty: e.target.value,
                })
              }
            />
            <InputField
              label="Ghi chú của tôi"
              name="notes"
              value={editingWordData.notes || ""}
              onChange={(e) =>
                setEditingWordData({
                  ...editingWordData,
                  notes: e.target.value,
                })
              }
              isTextArea={true}
            />

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
                type="button"
              >
                Hủy
              </Button>
              <Button type="submit" loading={updatingWord} variant="primary">
                {updatingWord ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default VocabPage;
