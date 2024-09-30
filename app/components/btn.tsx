import React from "react";

const Btn = ({ children, ...others }: React.HtmlHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...others} className="bg-main rounded-md py-2 border-2 border-black shadow-light transition-all hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY">
      {children}
    </button>
  );
};

export default Btn;
