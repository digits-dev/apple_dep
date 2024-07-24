import { useForm } from "@inertiajs/react";
import React from "react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";

function ItemMasterForm({ action, handleShow, setUpdateFormValues }) {
    const { handleToast } = useToast();
    const { data, setData, post, put, processing, errors, reset } = useForm({
        digits_code: setUpdateFormValues?.digits_code || "",
        upc_code_up_1: setUpdateFormValues?.upc_code_up_1 || "",
        upc_code_up_2: setUpdateFormValues?.upc_code_up_2 || "",
        upc_code_up_3: setUpdateFormValues?.upc_code_up_3 || "",
        upc_code_up_4: setUpdateFormValues?.upc_code_up_4 || "",
        upc_code_up_5: setUpdateFormValues?.upc_code_up_5 || "",
        wh_category: setUpdateFormValues?.wh_category || "",
        supplier_item_code: setUpdateFormValues?.supplier_item_code || "",
        item_description: setUpdateFormValues?.item_description || "",
        brand_description: setUpdateFormValues?.brand_description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (action == "edit") {
            put(`/item_master_update/${setUpdateFormValues?.currentId}`, {
                onSuccess: (data) => {
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                },
            });
        } else {
            post("/item_master_create", {
                onSuccess: (data) => {
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                },

            });
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                    <div className="space-y-3 flex-1 mb-3">
                        <InputComponent
                            name="Digits Code"
                            value={data.digits_code}
                            onChange={(e) =>
                                setData("digits_code", e.target.value)
                            }
                        />
                        {errors.digits_code && (
                            <span className="text-red-400 font-base">
                                <em>{errors.digits_code}</em>
                            </span>
                        )}

                        <InputComponent
                            name="UPC Code Up"
                            value={data.upc_code_up_1}
                            onChange={(e) =>
                                setData("upc_code_up_1", e.target.value)
                            }
                        />
                        {errors.upc_code_up_1 && (
                            <span className="text-red-400 font-base">
                                <em>{errors.upc_code_up_1}</em>
                            </span>
                        )}

                        <InputComponent
                            name="UPC Code Up 2"
                            value={data.upc_code_up_2}
                            onChange={(e) =>
                                setData("upc_code_up_2", e.target.value)
                            }
                        />
                        {errors.upc_code_up_2 && (
                            <span className="text-red-400 font-base">
                                <em>{errors.upc_code_up_2}</em>
                            </span>
                        )}

                        <InputComponent
                            name="UPC Code Up 3"
                            value={data.upc_code_up_3}
                            onChange={(e) =>
                                setData("upc_code_up_3", e.target.value)
                            }
                        />
                        {errors.upc_code_up_3 && (
                            <span className="text-red-400 font-base">
                                <em>{errors.upc_code_up_3}</em>
                            </span>
                        )}

                        <InputComponent
                            name="UPC Code Up 4"
                            value={data.upc_code_up_4}
                            onChange={(e) =>
                                setData("upc_code_up_4", e.target.value)
                            }
                        />
                        {errors.upc_code_up_4 && (
                            <span className="text-red-400 font-base">
                                <em>{errors.upc_code_up_4}</em>
                            </span>
                        )}
                    </div>
                    <div className="space-y-3 flex-1">
                        <InputComponent
                            name="UPC Code Up 5"
                            value={data.upc_code_up_5}
                            onChange={(e) =>
                                setData("upc_code_up_5", e.target.value)
                            }
                        />
                        {errors.upc_code_up_5 && (
                            <span className="text-red-400 font-base">
                                <em>{errors.upc_code_up_5}</em>
                            </span>
                        )}

                        <InputComponent
                            name="WH Category"
                            value={data.wh_category}
                            onChange={(e) =>
                                setData("wh_category", e.target.value)
                            }
                        />
                        {errors.wh_category && (
                            <span className="text-red-400 font-base">
                                <em>{errors.wh_category}</em>
                            </span>
                        )}

                        <InputComponent
                            name="Supplier Item Code"
                            value={data.supplier_item_code}
                            onChange={(e) =>
                                setData("supplier_item_code", e.target.value)
                            }
                        />
                        {errors.supplier_item_code && (
                            <span className="text-red-400 font-base">
                                <em>{errors.supplier_item_code}</em>
                            </span>
                        )}

                        <InputComponent
                            name="Item Description"
                            value={data.item_description}
                            onChange={(e) =>
                                setData("item_description", e.target.value)
                            }
                        />
                        {errors.item_description && (
                            <span className="text-red-400 font-base">
                                <em>{errors.item_description}</em>
                            </span>
                        )}

                        <InputComponent
                            name="Brand Description"
                            value={data.brand_description}
                            onChange={(e) =>
                                setData("brand_description", e.target.value)
                            }
                        />
                        {errors.brand_description && (
                            <span className="text-red-400 font-base">
                                <em>{errors.brand_description}</em>
                            </span>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                    disabled={processing}
                >
                    {action == "edit"
                        ? processing
                            ? "Updating..."
                            : "Update"
                        : processing
                        ? "Submitting..."
                        : "Submit"}
                </button>
            </form>
        </>
    );
}

export default ItemMasterForm;
