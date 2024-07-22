import React, { useContext } from "react";
import { ToastProvider } from "../../Context/ToastContext";

const AppContent = ({ children }) => {
    return (
        <div id="app-content" className="h-full bg-screen-color p-4 ">
            <ToastProvider>
				{children}
			</ToastProvider>
        </div>
    );
};

export default AppContent;
