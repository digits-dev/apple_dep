import React from 'react';

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <button className="float-right ml-2 bg-black hover:bg-black-600 text-white text-sm font-bold rounded px-2 py-1" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;