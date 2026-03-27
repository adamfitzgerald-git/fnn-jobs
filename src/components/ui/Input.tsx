type InputProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-forest mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
