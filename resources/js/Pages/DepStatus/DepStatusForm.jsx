import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';

const DepStatusForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        dep_status: updateFormValues?.currentValue || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/dep_statuses/${updateFormValues?.currentId}`, {onSuccess: ()=>{handleShow(); reset()}});
        } else {
            post('/dep_statuses', {onSuccess: ()=>{handleShow(); reset()}});
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <InputComponent name="dep_status" value={data.dep_status} onChange={e => setData('dep_status', e.target.value)}/>
            {errors.dep_status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.dep_status}</em></span>}
           
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

export default DepStatusForm