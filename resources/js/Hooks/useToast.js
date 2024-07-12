import { useState } from 'react';

// Custom hook
function useToast() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleToast = (message, messageType, duration = 3000, ...params) => {
    document.getElementById('app-content').scrollIntoView(true);
    setMessage(message);
    setMessageType(messageType);
    setTimeout(() => setMessage(""), duration); 

    params.forEach(param => {
        if (typeof param === 'function') {
          param();
        }
      });
  };

  return {
    message,
    messageType,
    handleToast
  };
}

export default useToast;
