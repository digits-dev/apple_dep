import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import ReactSelect from "../../Components/Forms/ReactSelect";

const OverrideOrderForm = ({ handleShow, updateFormValues, onSubmit, options }) => {
    const { data, setData, processing, setError, errors, reset } = useForm({
        id: updateFormValues?.id || "",
        order_id: updateFormValues?.order_id || "",
        customer_id: updateFormValues?.customer_id || "",
        po_number: updateFormValues?.po_number || "",
        delivery_number: updateFormValues?.delivery_number || "",
        order_date: updateFormValues?.order_date || "",
        ship_date: updateFormValues?.ship_date || "",
        serial_number: updateFormValues?.serial_number || "",
        order_number: updateFormValues?.order_number || "",
    });

    const [selectedOption, setSelectedOption] = useState(null);


    useEffect(() => {

        if (updateFormValues?.customer_id) {
            const defaultOption = options.find(option => option.value === updateFormValues?.customer_id);
    
            setSelectedOption(defaultOption || null);
        }

    }, [updateFormValues, options]);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate serial number
        {/*if (!data.serial_number) {
            setError('serial_number', 'Serial Number is required.');
            return;
        }*/}

        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl">Override Order?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                onSubmit({ ...data, customer_id: selectedOption ? selectedOption.value : "" });
                handleShow();
                reset();
            }
        });
    };

    const handleSelectChange = (selectedOption) => {
        // console.log("Selected option:", selectedOption);
        setSelectedOption(selectedOption);
        setData('customer_id', selectedOption ? selectedOption.value : "");
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="space-y-3 mb-10">
                    {/* <InputComponent
                        name="Serial Number"
                        value={data.serial_number}
                        onChange={(e) => setData("serial_number", e.target.value)}
                    />
                    {errors.serial_number && (
                        <span className="text-red-400 font-base">
                            <em>{errors.serial_number}</em>
                        </span>
                    )} */}
                    <ReactSelect
                        placeholder="Select an option"
                        name="dep_company"
                        value={selectedOption}
                        options={options}
                        onChange={handleSelectChange}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary w-full text-white font-nunito-sans py-3 text-sm mb-2 font-bold rounded-md hover:opacity-70"
                    disabled={processing}
                >
                    {processing ? "Updating..." : "Override"}
                </button>
            </form>
        </>
    );
};

export default OverrideOrderForm;
