/**
 * Text Area Component
 * Reusable textarea field
 */

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  required = false 
}: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );
}
