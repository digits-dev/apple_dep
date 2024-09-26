import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import InputComponent from '../../Components/Forms/Input';
import TextAreaInput from '../../Components/Forms/TextAreaInput';
import Select from '../../Components/Forms/Select';
import { useToast } from '../../Context/ToastContext';

const CustomerForm = ({action, handleShow, updateFormValues}) => {
    const { handleToast } = useToast();

    const { data, setData, processing, reset, post, put, errors } = useForm({
        customer_name: updateFormValues?.customer_name || '',
        note_customer: updateFormValues?.note || '',
        status: updateFormValues?.status,
        dep_company_name: '',
        dep_organization_id: '',
        note_dep_company: '',
    });

    const [afterAddCustomer, setAfterAddCustomer] = useState(false);

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
            <InputComponent name="customer_name" disabled={action == 'view' ? true : false} placeholder="Customer Name" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)}/>
            {errors.customer_name && <span className='mt-1 inline-block text-sm text-red-400 font-base'>{errors.customer_name}</span>}

            <TextAreaInput name="note_customer" displayName={'Note'} rows={2} is_disabled={action == 'view' ? true : false} placeholder="Add Note (Customer)" isrequired={false} value={data.note_customer} onChange={e => setData('note_customer', e.target.value)} />
            {errors.note_customer && <span className='mt-1 inline-block text-red-400 text-sm font-base'>{errors.note_customer}</span>}

            {action == 'edit' &&  
                <Select name="status" 
                    value={data.status} 
                    onChange={e => setData('status', e.target.value)} 
                    options={[{id:1, name:'Active'}, {id:0, name:'Inactive'}]} 
                    selectedId={data.status}
                />
            }
            {errors.status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.status}</em></span>}

            
            {action == 'edit' && 
                <button
                type="submit"
                className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                disabled={processing}
                >
                    {action == 'edit' ? processing ? "Updating..." : "Update" : processing ? "Submitting..." : "Submit"}
                </button>
            }

            {action == 'create' && 
                <button
                type="button"
                disabled={afterAddCustomer == true ? 1 : 0}
                onClick={() => {setAfterAddCustomer(true)}}
                className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                >
                    Add
                </button>
            }

            {afterAddCustomer && 
                <>
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

                <TextAreaInput name="note_dep_company" displayName={'Note'} rows={2} is_disabled={action == 'view' ? true : false} placeholder="Add Note (DEP Company)" isrequired={false} value={data.note_dep_company} onChange={e => setData('note_dep_company', e.target.value)} />
                {errors.note_dep_company && <span className='mt-1 inline-block text-red-400 text-sm font-base'>{errors.note_dep_company}</span>}

                <button
                type="submit"
                className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                disabled={processing}
                >
                    {processing ? "Submitting..." : "Submit"}
                </button>
                </>
            }
            
        </form>
   
        </>
    )
}

export default CustomerForm