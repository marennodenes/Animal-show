/**
 * Disabled Email Input Component
 * Non-editable email display field
 */

interface DisabledEmailInputProps {
  label: string;
  value: string;
  helperText?: string;
}

export default function DisabledEmailInput({ 
  label, 
  value,
  helperText = 'Email kan ikke endres'
}: DisabledEmailInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="email"
        value={value}
        disabled
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
      />
      <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    </div>
  );
}
