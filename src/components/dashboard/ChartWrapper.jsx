import { motion } from "framer-motion";

const ChartWrapper = ({ title, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-custom-light-lg p-6 border border-white/60 ${className}`}
    >
      <h3 className="text-xl font-bold text-lexi-headline mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        {/* Placeholder for chart. Replace with actual charting library like Recharts */}
        {children || <p>Biểu đồ sẽ hiển thị ở đây</p>}
      </div>
    </motion.div>
  );
};

export default ChartWrapper;
