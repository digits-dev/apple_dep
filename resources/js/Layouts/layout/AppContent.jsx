import React, { useContext } from "react";

const AppContent = ({ children }) => {
    return (
        <div className="h-full bg-screen-color px-2 py-2 ">
            <span>{children}</span>
        </div>
    );
};

export default AppContent;
