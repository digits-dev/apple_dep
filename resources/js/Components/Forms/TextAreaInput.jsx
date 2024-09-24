import React from "react";
import FormatLabelName from "../../Utilities/FormatLabelName";

const TextAreaInput = ({
    name,
    value,
    onChange,
    placeholder,
    displayName,
    is_disabled,
    extendClass,
    extendClass1,
    isrequired = true,
    isHighlight = false,
    rows = 5,
}) => {
    return (
        <div className={extendClass}>
            <label
                htmlFor={name}
                className="block text-sm font-bold text-gray-700 font-nunito-sans"
            >
                {displayName || FormatLabelName(name)}
            </label>
            <textarea
                id={name}
                required={isrequired}
                value={value}
                name={name}
                disabled={is_disabled}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`mt-1 block w-full px-3 py-2 placeholder:text-gray-300 border placeholder:text-sm  rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm ${extendClass1}`}
                style={{ borderColor: isHighlight ? "#3b82f6" : "#D1D5DB" }}
            />
        </div>
    );
};

export default TextAreaInput;
