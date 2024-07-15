import React, { createContext, useContext, useState, useCallback } from "react";
import DissapearingToast from "../Components/Toast/DissapearingToast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");
	const [duration, setDuration] = useState(3000);

	const handleToast = useCallback((message, messageType, duration = 3000, ...params) => {
		document.getElementById("app-content").scrollIntoView(true);
		setMessage(message);
		setMessageType(messageType);
		setDuration(duration);

		setTimeout(() => setMessage(""), duration);

		params.forEach((param) => {
			if (typeof param === "function") {
				param();
			}
		});
	}, []);

	return (
		<ToastContext.Provider value={{ message, messageType, handleToast }}>
			<DissapearingToast
				type={messageType}
				message={message}
			/>
			{children}
		</ToastContext.Provider>
	);
}

// Custom hook to use the toast context
export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
