import React from "react";

const NotificationsModal = ({
    show,
    onClose,
    title,
    subject,
    content,
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
            <div className="modal-backdrop z-[100]">
                <div
                    className={`bg-white rounded-lg shadow-custom ${maxWidth} w-full m-5  max-h-[90vh]`}
                >
                    <div className="flex justify-between p-5 border-b-2 items-center">
                        <div className="flex justify-center items-center">
                            <i className="fa-solid fa-circle-info text-zinc-500 mr-5 text-xl"></i>
                            <p className="font-nunito-sans font-extrabold text-lg">
                                {title}
                            </p>
                        </div>
                        <div className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer" onClick={onClose}>
                            <i
                                className="fa-solid fa-x text-red-500 font-extrabold text-md "
                            ></i>
                        </div>
                    </div>
                    <main className="pb-3 px-5 font-nunito-sans">
                        <p className="text-base py-3 font-semibold">{subject}</p>
                        <p className="whitespace-pre-line leading-loose text-sm border p-3 rounded-lg max-h-80 overflow-y-auto">{content}</p>
                    </main>
                </div>
            </div>
        </>
    );
};

export default NotificationsModal;
