import React, { useState } from "react";
import '../../../css/notification.css';
import animationData from '../../../../public/animations/patch-notes-anim.json'
import Lottie from 'lottie-react';
import axios from "axios";

const PatchNotesModal = ({
    show,
    onClose,
    title,
    subject,
    fixes,
    changes,
    width = "lg",
    isNotif
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

    const [loading, setLoading] = useState(false);

    const ConfirmPatchNote = async () => {
        
        try {
            setLoading(true);
            let response;
            response = await axios.post(`/update_patchnote`);
            if (response.data.status == "success") {
              setLoading(false);
              onClose();
            } else {
              alert('Something went wrong, please try again later');
              setLoading(false);
            }
        } catch (error) {
            alert('Something went wrong, please try again later');
            setLoading(false);
        } 
    };

    return (
        <>
            <div className="modal-backdrop z-[100]">
                <div
                    className={`bg-white relative rounded-lg shadow-custom ${maxWidth} w-full px-2 py-2 m-5 max-h-[90vh] overflow-y-auto font-nunito-sans flex flex-col`}
                >
                    {isNotif == '1' && 
                        <div className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer absolute z-50 right-2" onClick={onClose}>
                            <i className="fa-solid fa-x text-red-500 font-extrabold text-md "/>
                        </div>
                    }
                    
                    <div className="w-full h-72">
                        <Lottie animationData={animationData} loop={true} style={{ height: '100%', width: '100%' }} />
                    </div>
                    <p className="text-center font-extrabold text-2xl">{title}</p>
                    <p className="text-center text-gray-500">{subject}</p>
                    <main className="pb-3 p-3 font-nunito-sans">
                        {changes && 
                            <>
                                <p className="font-bold mb-1">New Features</p>
                                <div className="wysiwyg mb-5">
                                    <div className="whitespace-pre-line leading-loose text-sm border p-5 rounded-lg max-h-80 overflow-y-auto" dangerouslySetInnerHTML={{__html: changes}}></div>
                                </div>
                            </>
                        }
                        
                        {fixes &&
                            <>
                                <p className="font-bold mb-1">Improvements</p>
                                <div className="wysiwyg">
                                    <div className="whitespace-pre-line leading-loose text-sm border  p-5 rounded-lg max-h-80 overflow-y-auto" dangerouslySetInnerHTML={{__html: fixes}}></div>
                                </div>
                            </>
                        }
                    </main>
                    {isNotif != '1' && 
                        <div className="flex items-end justify-end">
                            <button
                                type="button"
                                onClick={()=> {ConfirmPatchNote();}}
                                disabled={loading}
                                className="bg-primary w-fit text-white font-nunito-sans  py-3 px-5 text-xs md:text-sm font-bold rounded-md mx-3 hover:opacity-70"
                            >
                                {loading ? 'Please wait...' : 'Got it!'}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default PatchNotesModal;
