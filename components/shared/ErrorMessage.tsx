/**
 * Error Message Component
 * Display error messages to users
 */

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {message}
    </div>
  );
}
