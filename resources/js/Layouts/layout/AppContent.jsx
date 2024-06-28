import React, { useContext } from "react";

const AppContent = ({ children }) => {
    return (
        <div className="h-full  bg-screen-color px-5 py-5 ">
            <span>{children}</span>
        </div>
    );
};

export default AppContent;
