import React from "react";
import DescIcon from "../Table/Icons/DescIcon";
import FormatLabelName from "../../Utilities/FormatLabelName";
import Select from 'react-select';

const colourStyles = {
    multiValue: (styles, { data }) => {
      const color = data.color;
      return {
        ...styles,
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
      backgroundColor: 'black',
      color: 'white',
    }),
};

const DropdownSelect = ({ options, onChange, value, name, defaultSelect, displayName, is_multi='', selectType = '', placeholder }) => {
    return (
        <div className="relative">
            <label
                htmlFor={name}
                className="block text-sm font-bold text-gray-700 font-nunito-sans"
            >
                {displayName || FormatLabelName(name)}
            </label>
            {selectType 
            ? 
           <Select
                placeholder={placeholder}
                defaultValue={value}
                name={name}
                className="block w-full py-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={onChange}
                options={options.map(opt => ({ value: opt.id, label: opt.name, name: name }))}
            />
             
               
            : 
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="appearance-none p-2 text-sm outline-none border border-gray-300 rounded-lg bg-white w-full cursor-pointer"
                >
                    <option value="">{defaultSelect}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            }
            {!selectType 
            ? 
                <span className="absolute top-1/2 right-5 -translate-y-1/2  pointer-events-none">
                    <DescIcon />
                </span>
            : ''}
           
        </div>
    );
};

export default DropdownSelect;
