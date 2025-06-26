import { motion } from "framer-motion"; // For subtle animations
import React from "react";

const InputField = React.forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      error,
      placeholder,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-semibold text-lexi-subheadline mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <motion.input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                        ${Icon ? "pl-10" : ""}
                        ${
                          error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-lexi-button focus:border-lexi-button"
                        }
                        text-lexi-headline placeholder-gray-400 transition-all duration-200 ease-in-out`}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
