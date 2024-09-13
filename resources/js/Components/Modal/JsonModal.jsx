import React, { useRef, useState } from "react";

const JsonModal = ({ show, onClose, children, title, modalData }) => {
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
                    <div className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer" onClick={onClose}>
                        <i
                            className="fa-solid fa-x text-red-500 font-extrabold text-md "
                        ></i>
                    </div>
                </div>
                <div className='flex justify-end cursor-pointer pr-5 pt-5' onClick={handleCopied}>
                  <img src='/images/others/copy-icon.png' className='w-5 h-auto'/>
                  <p className='text-gray-500 font-nunito-sans font-semibold text-sm ml-2'>{isCopied ? 'Copied!' : 'Copy'}</p>
                </div>
                <pre ref={JsonRef} className="py-3 px-5 text-sm overflow-auto max-h-[70vh] ">
                    {JSON.stringify(parsedData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default JsonModal;
