import React, { useContext } from "react";

const AppContent = ({ children }) => {
    return (
        <div className="content h-full bg-screen-color px-10 py-5">
            <span>{children}</span>
        </div>
    );
};

export default AppContent;
