/**
 * Text Input Component
 * Reusable text input field
 */

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TextInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
