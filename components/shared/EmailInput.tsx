/**
 * Email Input Component
 * Reusable email input field
 */

interface EmailInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export default function EmailInput({ 
  label, 
  value, 
  onChange, 
  placeholder = 'email@mail.com', 
  required = false,
  id
}: EmailInputProps) {
  return (
    <div>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && '*'}
      </label>
      <input
        id={id}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
        placeholder={placeholder}
        required={required}
        minLength={3}
      />
    </div>
  );
}
