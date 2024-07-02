import React, { useState } from 'react';
import FormatLabelName from '../../Utilities/FormatLabelName';

const InputComponent = ({ type = "text", name, value, onChange, placeholder }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-700">{FormatLabelName(name)}</label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
      />
    </div>
  );
};

export default InputComponent;
