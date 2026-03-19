/**
 * Success Message Component
 * Display success messages to users
 */

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      {message}
    </div>
  );
}
