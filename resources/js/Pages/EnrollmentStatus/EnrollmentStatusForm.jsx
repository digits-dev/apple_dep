import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';
import Select from '../../Components/Forms/Select';

const EnrollmentStatusForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        enrollment_status: updateFormValues?.currentValue || '',
        status: updateFormValues?.status,
        color: updateFormValues?.color || "#000000",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/enrollment_statuses/${updateFormValues?.currentId}`, {
                onSuccess: (data) => {
                    const { status, message } = data.props.auth.sessions;
                    handleShow();
                    reset();
                    handleToast(message, status);
                }
            });
        } else {
            post('/enrollment_statuses', {
                onSuccess: (data) => {
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
            <InputComponent name="enrollment_status" value={data.enrollment_status} onChange={e => setData('enrollment_status', e.target.value)}/>
            {errors.enrollment_status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.enrollment_status}</em></span>}

            {action == 'edit' &&  
                <Select name="status" 
                    value={data.status} 
                    onChange={e => setData('status', e.target.value)} 
                    options={[{id:1, name:'Active'}, {id:0, name:'Inactive'}]} 
                    selectedId={data.status}
                />
            }
            {errors.status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.status}</em></span>}

            <InputComponent
                    name="color"
                    value={data.color}
                    onChange={(e) => setData("color", e.target.value)}
                />
                {errors.color && (
                    <span className="mt-1 inline-block text-red-400 font-base">
                        <em>{errors.color}</em>
                    </span>
                )}
                <input
                    type="color"
                    value={data.color}
                    className="w-full"
                    onChange={(e) => setData("color", e.target.value)}
                />
           
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

export default EnrollmentStatusForm