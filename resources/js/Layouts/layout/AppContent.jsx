import React, { useContext } from "react";

const AppContent = ({ children }) => {
    return (
        <div className="content">
            <span>{children}</span>
        </div>
    );
};

export default AppContent;
