import React from 'react';
import DescIcon from '../Table/Icons/DescIcon';

const DropdownSelect = ({ options, onChange, value, name, defaultSelect }) => {
  return (

    <div class="relative ">
      <select name={name} value={value} onChange={onChange} className="appearance-none p-2 text-sm outline-none border border-gray-300 rounded-lg bg-white w-full cursor-pointer">
      <option value="">{defaultSelect}</option>
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      
      <span class="absolute top-1/2 right-5 -translate-y-1/2  pointer-events-none">
        <DescIcon/>
      </span>
  </div>
  );
};



export default DropdownSelect;