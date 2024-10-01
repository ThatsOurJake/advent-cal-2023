import React from "react";

interface AlertProps {
  children: React.ReactNode | React.ReactNode[];
  type: 'error' | 'success' | 'warning';
};

const typeClasses = {
  error: 'bg-red-200',
  success: 'bg-green-200',
  warning: 'bg-yellow-200',
};

const baseClasses = [
  'text-black',
  'shadow-light',
  'border-black',
  'border-2',
  'rounded-base',
  'py-2',
  'px-4',
  'mt-6',
  'mb-4',
];

const Alert = ({ children, type }: AlertProps) => {
  const classes = [
    ...baseClasses,
    typeClasses[type],
  ];

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};

export default Alert;
