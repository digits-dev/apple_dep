import React from "react";
import LoadingIcon from "../Table/Icons/LoadingIcon";

const Modal = ({ show, onClose, children, title, modalLoading }) => {
    if (!show) {
        return null;
    }

    return (
        <>
        { modalLoading ? 
        <div className="modal-backdrop z-[120]">
            <div className="bg-transparent rounded-lg w-32 m-5 ">
                <main className="py-5 px-5 flex items-center justify-center"><LoadingIcon classes="h-14 w-14 fill-white"/></main>
            </div>
        </div> 
        :
        <div className="modal-backdrop z-[100]">
            <div className="bg-white rounded-lg shadow-custom max-w-lg w-full m-5 ">
                <div className="flex justify-between p-5 border-b-2 items-center">
                    <p className="font-nunito-sans font-extrabold text-lg">
                        {title}
                    </p>
                    <i
                        className="fa-solid fa-x text-red-500 font-extrabold text-md cursor-pointer"
                        onClick={onClose}
                    ></i>
                </div>
                <main className="py-3 px-5">{children}</main>
            </div>
        </div>}
        </> 
       
    );
};

export default Modal;
