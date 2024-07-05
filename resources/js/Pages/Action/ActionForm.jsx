import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';

const ActionForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        action_name: updateFormValues?.currentValue || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/actions/${updateFormValues?.currentId}`, {onSuccess: ()=>{handleShow(); reset()}});
        } else {
            post('/actions', {onSuccess: ()=>{handleShow(); reset()}});
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <InputComponent name="action_name" value={data.action_name} onChange={e => setData('action_name', e.target.value)}/>
            {errors.action_name && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.action_name}</em></span>}
           
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

export default ActionForm