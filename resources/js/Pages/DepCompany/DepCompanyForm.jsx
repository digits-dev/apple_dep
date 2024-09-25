import { useForm } from "@inertiajs/react";
import React from "react";
import InputComponent from "../../Components/Forms/Input";
import Select from "../../Components/Forms/Select";
import ReactSelect from "../../Components/Forms/ReactSelect";
import TextAreaInput from '../../Components/Forms/TextAreaInput';
import { useToast } from "../../Context/ToastContext";

const DepCompanyForm = ({
    action,
    handleShow,
    updateFormValues,
    customers,
}) => {
    const { handleToast } = useToast();
    const { data, setData, processing, reset, post, put, errors } = useForm({
        dep_company_name: updateFormValues?.dep_company_name || "",
        dep_organization_id: updateFormValues?.dep_organization_id || "",
        note: updateFormValues?.note || '',
        customer_id: updateFormValues?.customer_id || null,
        status: updateFormValues?.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (action == "edit") {
            put(`/dep-companies/${updateFormValues?.currentId}`, {
                onSuccess: (data) => {
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                },
            });
        } else {
            post("/dep-companies", {
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
            <form className="space-y-4" onSubmit={handleSubmit}>
                <InputComponent
                    disabled={action == 'view' ? true : false}
                    name="dep_company_name"
                    displayName={"DEP Company Name"}
                    placeholder="DEP Company Name"
                    value={data.dep_company_name}
                    onChange={(e) =>
                        setData("dep_company_name", e.target.value)
                    }
                />

                {errors.dep_company_name && (
                    <span className="mt-1 inline-block text-sm text-red-400 font-base">
                        {errors.dep_company_name}
                    </span>
                )}

                <InputComponent
                    name="dep_organization_id"
                    disabled={action == 'view' ? true : false}
                    value={data.dep_organization_id}
                    placeholder={"DEP Organization Id"}
                    displayName={"DEP Organization Id"}
                    onChange={(e) =>
                        setData("dep_organization_id", e.target.value)
                    }
                />

                {errors.dep_organization_id && (
                    <span className="mt-1 inline-block text-sm text-red-400 font-base">
                        {errors.dep_organization_id}
                    </span>
                )}
                <ReactSelect
                    placeholder="Select Customer Name"
                    name="customer_id"
                    displayName="Customer Name"
                    options={customers}
                    disabled={action == 'view' ? true : false}
                    value={customers.find(
                        (customer) => customer.value == data.customer_id
                    )}
                    onChange={(e) => setData("customer_id", e.value)}
                />

                {errors.customer_id && (
                    <span className="mt-1 inline-block text-sm text-red-400 font-base">
                        {errors.customer_id}
                    </span>
                )}



                <TextAreaInput name="note" rows={2} is_disabled={action == 'view' ? true : false} placeholder="Add Note" isrequired={false} value={data.note} onChange={e => setData('note', e.target.value)} />
                {errors.note && <span className='mt-1 inline-block text-red-400 text-sm font-base'>{errors.note}</span>}

                {action == "edit" && (
                    <Select
                        name="status"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        options={[
                            { id: 1, name: "Active" },
                            { id: 0, name: "Inactive" },
                        ]}
                        selectedId={data.status}
                    />
                )}
                {errors.status && (
                    <span className="mt-1 inline-block text-sm text-red-400 font-base">
                        {errors.status}
                    </span>
                )}

                {action != 'view' && 
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
                }
                
            </form>
        </>
    );
};

export default DepCompanyForm;
