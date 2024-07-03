import React from "react";

const TopPanel = ({ children }) => {
    return (
        <div className="w-full inline-block rounded-md mb-5">
            <div className="flex gap-3 flex-wrap">{children}</div>
        </div>
    );
};

export default TopPanel;
