import React from 'react';

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input { ...props } type="text" className="w-2/3 border-2 border-black px-3 py-2 rounded-base text-black"/>
  )
};

export default TextInput;
