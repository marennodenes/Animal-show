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
    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded">
      {message}
    </div>
  );
}
