import { useForm } from "@inertiajs/react";
import React from "react";
import InputComponent from "../../Components/Forms/Input";

const OverrideOrderForm = ({ handleShow, updateFormValues }) => {
    const { data, setData, processing, errors, reset } = useForm({
        sales_order_no: updateFormValues?.sales_order_no || "",
        customer_name: updateFormValues?.customer_name || "",
        order_ref_no: updateFormValues?.order_ref_no || "",
        order_date: updateFormValues?.order_date || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Override Order?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleShow();
                reset();
            }
        });
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="space-y-3 mb-10">
                    <InputComponent
                        name="Sales Order #"
                        value={data.sales_order_no}
                        onChange={(e) =>
                            setData("sales_order_no", e.target.value)
                        }
                    />
                    {errors.sales_order_no && (
                        <span className="text-red-400 font-base">
                            <em>{errors.sales_order_no}</em>
                        </span>
                    )}
                    <InputComponent
                        name="Customer Name"
                        value={data.customer_name}
                        onChange={(e) =>
                            setData("customer_name", e.target.value)
                        }
                    />
                    {errors.customer_name && (
                        <span className="text-red-400 font-base">
                            <em>{errors.customer_name}</em>
                        </span>
                    )}
                    <InputComponent
                        name="Order Ref #"
                        value={data.order_ref_no}
                        onChange={(e) =>
                            setData("order_ref_no", e.target.value)
                        }
                    />
                    {errors.order_ref_no && (
                        <span className="text-red-400 font-base">
                            <em>{errors.order_ref_no}</em>
                        </span>
                    )}
                    <InputComponent
                        name="Order Date"
                        value={data.order_date}
                        onChange={(e) => setData("order_date", e.target.value)}
                    />
                    {errors.order_date && (
                        <span className="text-red-400 font-base">
                            <em>{errors.order_date}</em>
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-primary w-full text-white font-nunito-sans  py-3 text-sm mb-2 font-bold rounded-md hover:opacity-70"
                    disabled={processing}
                >
                    {processing ? "Updating..." : "Override"}
                </button>
            </form>
        </>
    );
};

export default OverrideOrderForm;
