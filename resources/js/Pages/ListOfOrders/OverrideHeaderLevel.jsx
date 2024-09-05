import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import ReactSelect from "../../Components/Forms/ReactSelect";
import { useToast } from "../../Context/ToastContext";

import axios from "axios";
import InputComponent from "../../Components/Forms/Input";
import { set } from "lodash";

const OverrideHeaderLevel = ({ handleShow, action, orderId }) => {
    const { handleToast } = useToast();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState([]);
    const [lines, setLines] = useState([]);
    const [depCompany, setDepCompany] = useState("");
    const [depCompanies, setDepCompanies] = useState([]);
    const [forms, setForms] = useState({
        order_id: orderId,
        ship_date: "",
        order_ref_no: "",
        dr_number: "",
        sales_order_no: "",
        order_date: "",
        dep_company_id: "",
        serial_numbers: {},
    });

    useEffect(() => {
        axios
            .get("/orders/get-current-shipdate", {
                params: { orderId }, // Correctly passing orderId as a query parameter
            })
            .then((response) => {
                console.log(response.data.depCompanies);
                setOrder(response.data.order);
                setLines(response.data.lines);
                setDepCompanies(response.data.depCompanies);
                setDepCompany(response.data.order.customer_id);
                setForms((forms) => ({
                    ...forms,
                    ship_date: response.data.order.ship_date,
                    order_ref_no: response.data.order.order_ref_no,
                    dr_number: response.data.order.dr_number,
                    sales_order_no: response.data.order.sales_order_no,
                    order_date: response.data.order.order_date,
                    dep_company_id: response.data.order.customer_id,
                }));
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

    function handleChangeCompany(e, prop) {
        const key = e.label;
        const value = e.value;
        setForms((forms) => ({
            ...forms,
            [prop]: value,
        }));
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

    // const validate = () => {
    //     const newErrors = {};
    //     if (!forms.ship_date) newErrors.ship_date = "Ship date required";
    //     return newErrors;
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmationMessage = action;
        const confirmed = await showConfirmationDialog(confirmationMessage);

        if (confirmed) {
            // const newErrors = validate();

            // if (Object.keys(newErrors).length > 0) {
            //     setErrors(newErrors);
            //     return;
            // }

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
            <form
                className="flex flex-col h-full justify-between gap-5"
                onSubmit={handleSubmit}
            >
                <label className="block text-xl font-bold">Order Details</label>
                <div className="grid gap-4 grid-cols-2">
                    <InputComponent
                        name="sales_order_no"
                        displayName="Sales Order Number"
                        value={forms.sales_order_no}
                        onChange={handleChange}
                    />
                    <InputComponent
                        name="dr_number"
                        displayName="Delivery Number"
                        value={forms.dr_number}
                        onChange={handleChange}
                    />
                    <InputComponent
                        name="order_ref_no"
                        displayName="Order Ref Number"
                        value={forms.order_ref_no}
                        onChange={handleChange}
                    />
                    <InputComponent
                        name="ship_date"
                        type="date"
                        displayName="New Ship date"
                        value={forms.ship_date}
                        onChange={handleChange}
                    />
                    {/* {errors.ship_date && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.ship_date}
                        </div>
                    )} */}
                    <InputComponent
                        name="order_date"
                        type="date"
                        displayName="Order Date"
                        value={forms.order_date}
                        onChange={handleChange}
                    />
                    {console.log(depCompanies)}

                    <ReactSelect
                        placeholder="Select Dep Company"
                        name="dep_company_id"
                        displayName="Dep Company Name"
                        options={depCompanies}
                        value={depCompanies.find(
                            (depCompany) =>
                                depCompany.value == forms.dep_company_id
                        )}
                        onChange={(e) => {
                            console.log(e);
                            handleChangeCompany(e, "dep_company_id");
                            console.log(depCompany);
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xl font-bold  mb-3">
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
