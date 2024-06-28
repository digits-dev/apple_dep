import React from 'react';

const DropdownSelect = ({ options, onChange, value }) => {
  return (
    <select value={value} onChange={onChange} className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
      {options.map((option, index) => (
        <option key={index} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default DropdownSelect;