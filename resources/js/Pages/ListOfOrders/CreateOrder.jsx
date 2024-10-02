import React, { useEffect, useState } from 'react'
import InputComponent from '../../Components/Forms/Input';
import { useForm } from '@inertiajs/react';
import DropdownSelect from '../../Components/Dropdown/Dropdown';
import axios from "axios";
import Modal from '../../Components/Modal/Modal';

const CreateOrder = ({customers}) => {

    const [selectedDepCompany, setSelectedDepCompany] = useState(null);
    const [showLoadingModal, setshowLoadingModal] = useState(false);
    const [linesData, setLinesData] = useState([
        {
            digits_code: '',
            item_description: '',
            wh_category: '',
            serial_number: '',
        },
    ]);

    const { data, setData, processing, reset, post, errors } = useForm({
        // FOR HEADER
        sales_order_no: '',
        customer_id: '',
        order_ref_no: '',
        dr_number: '',
        order_date: '',
        ship_date: '',

        // FOR LINES
        dep_company_id: '',
        lines_data: linesData,
    });

    const addLines = () => {
        const newLines = {
            digits_code: '',
            item_description: '',
            wh_category: '',
            serial_number: '',
        }

        setLinesData([...linesData, newLines])
    }
    
    const deleteLines = (index) => {
        const filteredLines = linesData.filter((_, i) => i !== index); // Remove the item at the given index
        setLinesData(filteredLines);
    };

    function handleChangeCustomer(e) {
        setData('dep_company_id', 0);
        const key = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;

        

        setData((editForms) => ({
            ...editForms,
            [key]: value,
        }));

    }

    function handleDepCompanyChange(e) {
        if (e.value){
            const key = e.name ? e.name : e.target.name;
            const value = e.value ? e.value : e.target.value;

            setData((editForms) => ({
                ...editForms,
                [key]: value,
            }));

        }
        else {
            Swal.fire({
                title: "DEP Organization ID not found",
                text: "Please insert DEP Organization ID first then try again",
                icon: 'warning',
                confirmButtonColor: "#000000",
                iconColor: "#cc0000",  
              });
        }
        

    }

    const handleChangeLines = (index, field, value) => {
        const updatedData = [...linesData];
        updatedData[index][field] = value;
        setLinesData(updatedData);
        setData('lines_data', linesData);

    };

    useEffect(() => {

        if (data.customer_id){
            const getDepCompany = async () => {
                try {
                    const response = await axios.get(`/get_dep_companies/${data.customer_id}`);

                    const selectedDepCompanies = response.data.map(depCompany => {
                        return{
                            id: depCompany.dep_organization_id,
                            name: depCompany.dep_company_name,
                        }
                    })
                    setSelectedDepCompany(selectedDepCompanies);
                } catch (error) {
                    console.error("There was an error fetching the Dep Company data!", error);
                }
            };
    
            getDepCompany();

        }

    }, [data.customer_id]);


    const Customers = customers.map(customer => {
        return{
            id: customer.value,
            name: customer.label,
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Create Order?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",      
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setshowLoadingModal(true);
                post("/list_of_orders/create_order", {
                    onSuccess: (data) => {
                        const { message, success } = data.props.auth.sessions;
                        handleToast(message, success);
                        setshowLoadingModal(false);
                    },
                    onError: (newErrors) => {
                  
                        setshowLoadingModal(false);
                    }
                }); 
            }
        });
        
        
    };
     
  return (
    <>
        <form className='font-nunito-sans' onSubmit={handleSubmit}>
            <p className='font-bold mb-2'>Header Data</p>
            <div className='flex gap-3 border p-5 rounded-lg'>
                <div className='flex-1'>
                    <InputComponent
                        name='sales_order_no'
                        displayName='Sales Order #'
                        placeholder='Sales Order #'
                        required={true}
                        onChange={(e) =>
                            setData("sales_order_no", e.target.value)
                        }
                        value={data.sales_order_no}
                    />
                    {errors.sales_order_no && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.sales_order_no}
                        </span>
                    )}
                    <InputComponent
                        name='order_ref_no'
                        displayName='Order Ref #'
                        placeholder='Order Ref #'
                        required={true}
                        extendedClass='mt-2.5'
                        onChange={(e) =>
                            setData("order_ref_no", e.target.value)
                        }
                        value={data.order_ref_no}
                    />
                    {errors.order_ref_no && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.order_ref_no}
                        </span>
                    )}
                    <InputComponent
                        name='dr_number'
                        displayName='DR Number'
                        placeholder='DR Number'
                        required={true}
                            extendedClass='mt-2.5'
                        onChange={(e) =>
                            setData("dr_number", e.target.value)
                        }
                        value={data.dr_number}
                    />
                    {errors.dr_number && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.dr_number}
                        </span>
                    )}
                </div>
                <div className='flex-1 space-y-2'>
                    <InputComponent
                        name='order_date'
                        displayName='Order Date'
                        required={true}
                        type='date'
                        onChange={(e) =>
                            setData("order_date", e.target.value)
                        }
                        value={data.order_date}
                    />
                    {errors.order_date && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.order_date}
                        </span>
                    )}
                    <InputComponent
                        name='ship_date'
                        displayName='Ship Date'
                        required={true}
                        type='date'
                        onChange={(e) =>
                            setData("ship_date", e.target.value)
                        }
                        value={data.ship_date}
                    />
                    {errors.ship_date && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.ship_date}
                        </span>
                    )}
            
                    <DropdownSelect
                        placeholder="Select Customer"
                        selectType="select2"
                        displayName="Customer Name"
                        name="customer_id"
                        required={true}
                        options={Customers}
                        value={data.notif_type}
                        onChange={handleChangeCustomer}
                        menuPlacement='top'
                    />
                    {errors.customer_id && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.customer_id}
                        </span>
                    )}
                </div>           
            </div>
        
            {selectedDepCompany && 
                <div>
                    <p className='font-bold my-2'>Lines Data</p>
                    <div className='flex space-x-1'>
                        <div className='flex-1'>
                            <DropdownSelect
                                placeholder="Select Dep Company"
                                selectType="select2"
                                displayName="DEP Company Name"
                                name="dep_company_id"
                                // required={true}
                                options={selectedDepCompany}
                                value={data.dep_company_id === 0 ? '' : data.dep_company_id}
                                onChange={handleDepCompanyChange}
                                menuPlacement='top'
                            />
                        </div>
                        
                        <InputComponent
                            name='dep_organization_id'
                            disabled={true}
                            displayName='DEP Organization ID'
                            placeholder='DEP Organization ID'
                            value={data.dep_company_id === 0 ? '' : data.dep_company_id}
                            onChange={(e) => handleChangeLines(index, 'digits_code', e.target.value)}
                        />
                    </div>
                    {errors.dep_company_id && (
                        <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                            {errors.dep_company_id}
                        </span>
                    )}
                    <p className='text-sm py-2'><span className='text-red-500'>Note: </span>Please ensure the DEP Organization ID of the selected DEP Company exist</p>
                    {data.dep_company_id != 0 &&
                        <>
                            <p className='font-bold text-sm mb-2'>Items</p>
                            <div className='space-y-2'>
                                {linesData && linesData.map((item, index)=> (
                                    <div className='flex gap-1 border p-3 rounded-lg items-center justify-evenly' key={index}>
                                        <div className='flex-1'>
                                            <InputComponent
                                                name='digits_code'
                                                placeholder='Digits Code'
                                                required={true}
                                                value={item.digits_code}
                                                onChange={(e) => handleChangeLines(index, 'digits_code', e.target.value)}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <InputComponent
                                                name='item_description'
                                                placeholder='Item Description'
                                                required={true}
                                                value={item.item_description}
                                                onChange={(e) => handleChangeLines(index, 'item_description', e.target.value)}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <InputComponent
                                                name='wh_category'
                                                displayName='WH Category'
                                                placeholder='WH Category'
                                                required={true}
                                                value={item.wh_category}
                                                onChange={(e) => handleChangeLines(index, 'wh_category', e.target.value)}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <InputComponent
                                                name='serial_number'
                                                placeholder='Serial Number'
                                                required={true}
                                                value={item.serial_number}
                                                onChange={(e) => handleChangeLines(index, 'serial_number', e.target.value)}
                                            />
                                        </div>
                                        {linesData.length != 1 &&
                                            <div className='p-3 hover:bg-gray-200 ml-1 rounded-full flex items-center justify-center cursor-pointer'  onClick={() => deleteLines(index)}>
                                                <i className="fa-solid fa-square-minus text-red-500"></i>
                                            </div>
                                        }
                                    </div>

                                ))}
                            </div>
                            <div className='flex justify-end'>
                                <button
                                    type="button"
                                    className="bg-green-600 w-fit text-white font-nunito-sans py-2 px-5 text-sm rounded-md mt-5 hover:opacity-70"
                                    onClick={()=>{addLines()}}
                                >
                                    Add Item
                                </button>
                            </div>
                            
                        </>

                    }
                </div>
            }

            
            <button
                type="submit"
                className="bg-primary w-fit text-white font-nunito-sans py-2 px-5 text-sm rounded-md mt-5 hover:opacity-70"
                // disabled={!data.dep_company_id || processing}
            >
                {processing
                    ? "Please Wait..."
                    : "Create"
                }
            </button>
        </form>
        <Modal show={showLoadingModal} modalLoading={true}/>
    </>
  )
}

export default CreateOrder