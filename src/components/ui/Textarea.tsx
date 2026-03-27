type TextareaProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

export function Textarea({
  label,
  name,
  required,
  placeholder,
  defaultValue,
  rows = 4,
}: TextareaProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-forest mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
  );
}
