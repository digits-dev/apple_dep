import React from "react";

const ContentPanel = ({ marginBottom, children }) => {
    return (
        <div
            className={`py-4 px-4 rounded-lg bg-white shadow-sm  w-full flex flex-col justify-between mb-${marginBottom}`}
        >
            {children}
        </div>
    );
};

export default ContentPanel;
