import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AudioPlayer = ({ src, className = "" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((e) => console.error("Error playing audio:", e));
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

  // Optional: volume control slider (can be added later)
  // const handleVolumeChange = (e) => {
  //   const newVolume = parseFloat(e.target.value);
  //   if (audioRef.current) {
  //     audioRef.current.volume = newVolume;
  //     setVolume(newVolume);
  //     setIsMuted(newVolume === 0);
  //   }
  // };

  if (!src) {
    return <span className="text-gray-500 text-sm">Không có âm thanh</span>;
  }

  return (
    <div
      className={`flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 ${className}`}
    >
      <audio ref={audioRef} src={src} preload="auto" />
      <motion.button
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        className="p-1 rounded-full text-lexi-headline hover:bg-gray-200"
        aria-label={isPlaying ? "Tạm dừng phát âm" : "Phát âm"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </motion.button>

      {/* Mute button */}
      <motion.button
        onClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        className="p-1 rounded-full text-lexi-headline hover:bg-gray-200"
        aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Optional volume slider
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 rounded-lg appearance-none cursor-pointer bg-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lexi-button [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3"
      /> */}
    </div>
  );
};

export default AudioPlayer;
