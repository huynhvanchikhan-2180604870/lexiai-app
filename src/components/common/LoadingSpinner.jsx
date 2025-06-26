const LoadingSpinner = ({ size = "md", color = "text-blue-500" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} border-current border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
