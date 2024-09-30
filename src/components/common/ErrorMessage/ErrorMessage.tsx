import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <div style={{ color: 'red' }}>{message}</div>;
};

export default ErrorMessage;
