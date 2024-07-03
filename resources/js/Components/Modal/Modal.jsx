import React from "react";

const Modal = ({ show, onClose, children, title }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop z-[100]">
            <div className="bg-white rounded-lg shadow-custom max-w-lg w-full m-5 ">
                <div className="flex justify-between p-5 border-b-2 items-center">
                    <p className="font-nunito-sans font-extrabold text-lg">
                        {title}
                    </p>
                    <p
                        onClick={onClose}
                        className="cursor-pointer font-nunito-sans text-gray-500 text-sm"
                    >
                        Close
                    </p>
                </div>
                <main className="py-3 px-5">{children}</main>
            </div>
        </div>
    );
};

export default Modal;
