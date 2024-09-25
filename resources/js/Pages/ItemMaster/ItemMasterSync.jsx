import { useForm,router } from "@inertiajs/react";
import React from "react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";


function ItemMasterForm({ handleShow }) {
    const { handleToast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        datefrom: "",
        dateto: "",
        page: 1,
        limit: 100,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/pull-item-master", {
            onSuccess: (data) => {
            const { status, message } = data.props.auth.sessions;
                handleShow();
                reset();
                handleToast(message, status);
            },

        });
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-2 mb-3">
    
                    <div>
                        <InputComponent
                            displayName="Date From"
                            name="datefrom"
                            type="date"
                            value={data.datefrom}
                            onChange={(e) =>
                                setData("datefrom", e.target.value)
                            }
                        />
                        {errors.datefrom && (
                            <span className="text-red-400 font-base">
                                <em>{errors.datefrom}</em>
                            </span>
                        )}
                    </div>

                    <div >
                        <InputComponent
                            displayName="Date To"
                            name="dateto"
                            type="date"
                            value={data.dateto}
                            onChange={(e) =>
                                setData("dateto", e.target.value)
                            }
                        />
                        {errors.dateto && (
                            <span className="text-red-400 font-base">
                                <em>{errors.dateto}</em>
                            </span>
                        )}
                    </div>

                    <div>
                        <InputComponent
                            name="page"
                            type="number"
                            min="1"
                            value={data.page}
                            onChange={(e) =>
                                setData("page", e.target.value)
                            }
                        />
                        {errors.page && (
                            <span className="text-red-400 font-base">
                                <em>{errors.page}</em>
                            </span>
                        )}
                    </div>

                    <div>
                        <InputComponent
                            name="limit"
                            type="number"
                            min="1"
                            value={data.limit}
                            onChange={(e) =>
                                setData("limit", e.target.value)
                            }
                        />
                        {errors.limit && (
                            <span className="text-red-400 font-base">
                                <em>{errors.limit}</em>
                            </span>
                        )}
                    </div>
                    
                </div>
       
                <button
                    type="submit"
                    className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                    disabled={processing}
                >
                    {processing ? "Submitting..." : "Submit"}
                </button>
            </form>
        </>
    );
}

export default ItemMasterForm;
