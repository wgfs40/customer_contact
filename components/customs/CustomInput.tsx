"use client";

interface CustomInputProps {
  type: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
}

const CustomInput = ({
  type,
  placeholder,
  className,
  onChange,
  value,
  disabled,
  required,
  autoFocus,
  name,
}: CustomInputProps) => {
  return (
    <div>
      <input
        type={type}
        name={name}
        className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default CustomInput;
