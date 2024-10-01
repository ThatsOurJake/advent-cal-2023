import React from "react";

const baseClasses = [
  "bg-main",
  "rounded-base",
  "py-2",
  "border-2",
  "border-black",
  "shadow-light",
  "transition-all",
  "hover:shadow-none",
  "hover:translate-x-boxShadowX",
  "hover:translate-y-boxShadowY",
];

const Btn = ({ children, className, ...others }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const classes = [
    ...baseClasses,
    className?.split(" "),
  ];

  return (
    <button {...others} className={classes.join(' ')}>
      {children}
    </button>
  );
};

export default Btn;
