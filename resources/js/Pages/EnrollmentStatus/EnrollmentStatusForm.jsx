import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';

const EnrollmentStatusForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        enrollment_status: updateFormValues?.currentValue || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/enrollment_statuses/${updateFormValues?.currentId}`, {onSuccess: ()=>{handleShow(); reset()}});
        } else {
            post('/enrollment_statuses', {onSuccess: ()=>{handleShow(); reset()}});
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <InputComponent name="enrollment_status" value={data.enrollment_status} onChange={e => setData('enrollment_status', e.target.value)}/>
            {errors.enrollment_status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.enrollment_status}</em></span>}
           
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