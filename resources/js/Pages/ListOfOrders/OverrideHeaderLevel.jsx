import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import { useToast } from "../../Context/ToastContext";

import axios from "axios";
import InputComponent from "../../Components/Forms/Input";

const OverrideHeaderLevel = ({ handleShow, action, orderId }) => {
    const { handleToast } = useToast();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState({
        order_id: orderId,
        ship_date: "",
        serial_numbers: {},
    });

    const [order, setOrder] = useState([]);
    const [lines, setLines] = useState([]);

    useEffect(() => {
        axios
            .get("/orders/get-current-shipdate", {
                params: { orderId }, // Correctly passing orderId as a query parameter
            })
            .then((response) => {
                console.log(response.data.order);
                setOrder(response.data.order);
                setLines(response.data.lines);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the ship date!",
                    error
                );
            });
    }, [orderId]);

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setForms((forms) => ({
            ...forms,
            [key]: value,
        }));

        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
    function handleSerialNumberChange(e, orderLinesId) {
        const value = e.target.value.toUpperCase();

        setForms((prevForms) => ({
            ...prevForms,
            serial_numbers: {
                ...prevForms.serial_numbers,
                [orderLinesId]: value,
            },
        }));

        setErrors((prevErrors) => ({ ...prevErrors, serial_numbers: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!forms.ship_date) newErrors.ship_date = "Ship date required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmationMessage = action;
        const confirmed = await showConfirmationDialog(confirmationMessage);

        if (confirmed) {
            const newErrors = validate();

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            await submitForm();
        }
    };

    // Function to show the confirmation dialog
    const showConfirmationDialog = (actionType) => {
        return Swal.fire({
            title: `<p class="font-nunito-sans text-3xl">Are you sure you want to ${actionType} this Device?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            reverseButtons: true,
            iconColor: "#000000",
        }).then((result) => result.isConfirmed);
    };

    // Function to handle form submission
    const submitForm = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/orders/override", forms, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            handleToast(response.data.message, response.data.status);
            handleShow();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                handleToast(error.response.data.errors, "error");
            } else {
                handleToast("An error occurred. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="">
                    <label className="block text-sm font-bold text-gray-700 font-nunito-sans">
                        {" "}
                        Current Ship date
                    </label>
                    <input
                        name="ship_date"
                        type="text"
                        value={order.ship_date}
                        disabled
                        class="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-200 dark:border-gray-300 dark:placeholder-gray-500 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <InputComponent
                    name="ship_date"
                    type="datetime-local"
                    displayName="New Ship date"
                    value={forms.ship_date}
                    onChange={handleChange}
                />
                {errors.ship_date && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.ship_date}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700">
                        Devices
                    </label>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2 text-left">
                                    Enrollment Status
                                </th>
                                <th className="border p-2 text-left">
                                    Item Code
                                </th>
                                <th className="border p-2 text-left">
                                    Serial Numbers
                                </th>
                                <th className="border p-2 text-left">
                                    New Serial Numbers
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((line, index) => (
                                <tr key={index}>
                                    <td
                                        className={`border p-2 text-sm ${
                                            line.enrollment_status ===
                                            "Enrollment Success"
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        {line.enrollment_status}
                                    </td>
                                    <td className="border p-2 text-sm text-gray-700">
                                        {line.item_code}
                                    </td>
                                    <td className="border p-2 text-sm text-gray-700">
                                        {line.serial_number}
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            name={`serial_number_${line.order_lines_id}`}
                                            type="text"
                                            className="border rounded p-1 w-full"
                                            onChange={(e) =>
                                                handleSerialNumberChange(
                                                    e,
                                                    line.order_lines_id
                                                )
                                            }
                                            value={
                                                forms.serial_numbers[
                                                    line.order_lines_id
                                                ] || ""
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="submit"
                    className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Override"}
                </button>
            </form>
        </>
    );
};

export default OverrideHeaderLevel;
