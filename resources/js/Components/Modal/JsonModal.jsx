import React, { useRef, useState } from "react";

const JsonModal = ({ show, onClose, children, title, modalData }) => {
    console.log(children);
    if (!show) {
        return null;
    }

    const [isCopied, setisCopied] = useState(false);

    const JsonRef = useRef(null);

    const handleCopied = async ()  => {

        let contentToCopy = '';
        contentToCopy = JsonRef.current.textContent;
    
        await navigator.clipboard.writeText(contentToCopy); // Copy the text
        setisCopied(true);
        setTimeout (()=> {
          setisCopied(false);
        }, 2000)
      }

    let parsedData;

    try {
        parsedData = JSON.parse(modalData);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        parsedData = modalData;
    }

    return (
        <div className="modal-backdrop z-[100] p-5 fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-custom m-auto max-h-[90vh] w-full max-w-screen-md ">
                <div className="flex justify-between p-5 border-b-2 items-center">
                    <p className="font-nunito-sans font-extrabold text-lg">
                        {title}
                    </p>
                    <i
                        className="fa-solid fa-x text-red-500 font-extrabold text-md cursor-pointer"
                        onClick={onClose}
                    ></i>
                </div>
                <div className='flex justify-end py-2 px-5'>
                  <button onClick={handleCopied} className='bg-gray-500 self-end px-3 py-2 rounded-lg font-nunito-sans text-xs font-medium text-white'>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</button>
                </div>
                <pre ref={JsonRef} className="py-3 px-5 text-sm overflow-auto max-h-[70vh] ">
                    {JSON.stringify(parsedData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default JsonModal;
