'use client';

interface FormErrorMessageProps {
  message: string;
}

export default function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
      {message}
    </div>
  );
}