import React, { useContext } from "react";
import { ToastProvider } from "../../Context/ToastContext";

const AppContent = ({ children }) => {
    return (
        <div id="app-content" className="h-full bg-screen-color px-2 py-2 ">
            <ToastProvider>
				<span>{children}</span>
			</ToastProvider>
        </div>
    );
};

export default AppContent;
