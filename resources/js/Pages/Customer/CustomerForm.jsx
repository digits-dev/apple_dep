import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';
import Select from '../../Components/Forms/Select';
import { useToast } from '../../Context/ToastContext';

const CustomerForm = ({action, handleShow, updateFormValues}) => {
    const { handleToast } = useToast();

    const { data, setData, processing, reset, post, put, errors } = useForm({
        customer_code: updateFormValues?.party_number || '',
        customer_code: updateFormValues?.currentCusCodeValue || '',
        customer_name: updateFormValues?.currentValue || '',
        status: updateFormValues?.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/customers/${updateFormValues?.currentId}`, {
                onSuccess: (data)=>{
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                }
            });
        } else {
            post('/customers', {
                onSuccess: (data )=>{
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                }
            });
        }
    }

    return (
        <>
        <form className='space-y-4' onSubmit={handleSubmit}>
            <InputComponent name="party_number" value={data.party_number} onChange={e => setData('party_number', e.target.value)}/>
            <InputComponent name="customer_code" value={data.customer_code} onChange={e => setData('customer_code', e.target.value)}/>
            {errors.customer_code && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.customer_code}</em></span>}
            <InputComponent name="customer_name" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)}/>
            {errors.customer_name && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.customer_name}</em></span>}
           
            {action == 'edit' &&  
                <Select name="status" 
                    value={data.status} 
                    onChange={e => setData('status', e.target.value)} 
                    options={[{id:1, name:'Active'}, {id:0, name:'Inactive'}]} 
                    selectedId={data.status}
                />
            }
            {errors.status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.status}</em></span>}

            <button
                type="submit"
                className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                disabled={processing}
            >
                {action == 'edit' ? processing ? "Updating..." : "Update" : processing ? "Submitting..." : "Submit"}
            </button>
        </form>
   
        </>
    )
}

export default CustomerForm