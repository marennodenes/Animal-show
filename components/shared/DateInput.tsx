/**
 * Date Input Component
 * Reusable date input field
 */

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function DateInput({ 
  label, 
  value, 
  onChange, 
  required = false 
}: DateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
        required={required}
      />
    </div>
  );
}
