import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from 'react';
import { useToast } from "../../Context/ToastContext";

import axios from "axios";
import InputComponent from "../../Components/Forms/Input";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import Tbody from "../../Components/Table/Tbody";
import RowData from "../../Components/Table/RowData";


const OverrideHeaderLevel = ({ handleShow, action, orderId}) => {
    const { handleToast } = useToast();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState({
        order_id: orderId,
        ship_date: '',
    });
    const [currentShipdate, setCurrentShipdate] = useState([]);
    const [orderLines, setOrderLines] = useState([]);

    useEffect(() => {
        axios.get('/orders/get-current-shipdate', {
            params: { orderId }  // Correctly passing orderId as a query parameter
        })
        .then(response => {
            setCurrentShipdate(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the ship date!', error);
        });
    }, [orderId]);

    useEffect(() => {
        axios.get('/orders/get-order-lines', {
            params: { orderId }  // Correctly passing orderId as a query parameter
        })
        .then(response => {
            setOrderLines(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the ship date!', error);
        });
    }, [orderId]);

    // State to store the serial numbers
    const [orderLinesState, setOrderLinesState] = useState(orderLines);

    function handleChange(e, index) {
        const {key, value } = e.target;
        setForms((forms) => ({
            ...forms,
            [key]: value,
        }));

        const updatedOrderLines = orderLinesState.map((line, i) =>
            i === index ? { ...line, serial_number: value } : line
        );
        // Set the updated orderLinesState
        setOrderLinesState(updatedOrderLines);

        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!forms.ship_date) newErrors.ship_date = 'Ship date required';
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
            const response = await axios.post('/orders/override', {forms, serialNumbers }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            handleToast(response.data.message, response.data.status);
            handleShow();
            
        } catch (error) {
            if (error.response && error.response.status === 422) {
                handleToast(error.response.data.errors, 'error');
            } else {
                handleToast('An error occurred. Please try again.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <form className='space-y-4' onSubmit={handleSubmit}>
            <div className="">
                <label  className="block text-sm font-bold text-gray-700 font-nunito-sans"> Current Ship date</label>
                <input
                    name="ship_date"
                    type="text"
                    value={currentShipdate}
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
            {(errors.ship_date) && (
                <div className="font-nunito-sans font-bold text-red-600">
                    {errors.ship_date}
                </div>
            )}

            <div>
                <div className="font-nunito-sans font-extrabold text-lg my-2">
                    Devices
                </div>
                <TableContainer
                    autoHeight
                >
                    <Thead>
                        <Row>
                            <TableHeader
                                width="md"
                                justify="center"
                                sortable={
                                    false
                                }
                            >
                                ID
                            </TableHeader>
                            <TableHeader
                                width="md"
                                justify="center"
                                sortable={
                                    false
                                }
                            >
                                Digits Code
                            </TableHeader>
                            <TableHeader
                                width="md"
                                justify="center"
                                sortable={
                                    false
                                }
                            >
                                Item Description
                            </TableHeader>
                            <TableHeader
                                width="md"
                                justify="center"
                                sortable={
                                    false
                                }
                            >
                                Serial
                            </TableHeader>
                        </Row>
                    </Thead>

                    <Tbody>
                        {orderLines &&
                            orderLines?.length > 0 ? (
                                orderLines && orderLines?.map((line, index) => (
                                    <Row key={index + line.id}>
                                        <RowData
                                            center
                                        >
                                           <input 
                                               type="text" 
                                               value={line.id} 
                                               readOnly 
                                               className="text-center"
                                           />
                                        </RowData>
                                        <RowData
                                            center
                                        >
                                            {line.digits_code}
                                        </RowData>
                                        <RowData
                                            center
                                        >
                                            {line.item_description}
                                        </RowData>
                                        <RowData
                                            center
                                        >
                                            <input 
                                                type="text" 
                                                value={line.serial_number} 
                                                name="serial_number"
                                                onChange={(e) => handleChange(e, index)}
                                                className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                                            />
                                        </RowData>
                                    </Row>
                                )
                            )
                            ) : (
                               
                                <div className="flex items-center justify-center ml-[380px]">
                                    <span className="items-center justify-center font-bold text-black-500">
                                        Processing...
                                    </span>
                                </div>
                               
                            )
                        }
    
                    </Tbody>
                </TableContainer>
            </div>
            <div className="pb-2">
                <button
                    type="submit"
                    onClick={() => handleShow()}
                    className="bg-gray-300 text-black font-nunito-sans px-3 py-3 text-sm font-bold rounded-md mt-1 hover:opacity-70"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-primary text-white float-right font-nunito-sans px-3 py-3 mb-5 text-sm font-bold rounded-md mt-1 hover:opacity-70"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Override"}
                </button>
            </div>
        </form>
   
        </>
    )
}

export default OverrideHeaderLevel;
