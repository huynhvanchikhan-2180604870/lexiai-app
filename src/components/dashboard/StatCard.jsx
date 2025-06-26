import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass = "bg-blue-500",
  valueColorClass = "text-white",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl p-6 shadow-custom-light-lg flex flex-col items-start justify-between min-h-[120px] ${colorClass}`}
    >
      <div className="flex items-center mb-2">
        {Icon && <Icon size={32} className={`mr-3 ${valueColorClass}`} />}
        <p className={`text-lg font-semibold ${valueColorClass}`}>{title}</p>
      </div>
      <p className={`text-5xl font-extrabold ${valueColorClass}`}>{value}</p>
    </motion.div>
  );
};

export default StatCard;
