import React, { useContext } from "react";

const AppContent = ({ children }) => {
    return (
        <div className="content flex-1 bg-screen-color">
            <span>{children}</span>
        </div>
    );
};

export default AppContent;
