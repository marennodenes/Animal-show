/**
 * Password Input Component
 * Reusable password input field
 */

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  id?: string;
}

export default function PasswordInput({ 
  label, 
  value, 
  onChange, 
  placeholder = '••••••••', 
  required = false,
  minLength,
  id
}: PasswordInputProps) {
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
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}
