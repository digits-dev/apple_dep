import React from "react";
import LoadingIcon from "../Table/Icons/LoadingIcon";

const Modal = ({
    show,
    onClose,
    children,
    title,
    modalLoading,
    width = "lg",
}) => {
    if (!show) {
        return null;
    }

    const maxWidth = {
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
    }[width];

    return (
        <>
            {modalLoading ? (
                <div className="modal-backdrop z-[120]">
                    <div className="bg-transparent rounded-lg w-32 m-5 ">
                        <main className="py-5 px-5 flex items-center justify-center">
                            <LoadingIcon classes="h-14 w-14 fill-white" />
                        </main>
                    </div>
                </div>
            ) : (
                <div className="modal-backdrop z-[100]">
                    <div
                        className={`bg-white rounded-lg shadow-custom ${maxWidth} w-full m-5  max-h-[90vh]`}
                    >
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
                        <main className="py-3 px-5 max-h-[70vh] overflow-y-auto">{children}</main>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
