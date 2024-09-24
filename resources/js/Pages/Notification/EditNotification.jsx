import React, { useEffect, useState } from 'react'
import { useNavbarContext } from "../../Context/NavbarContext";
import ContentPanel from '../../Components/Table/ContentPanel';
import InputComponent from "../../Components/Forms/Input";
import { Link, useForm } from '@inertiajs/react';
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import TextAreaInput from '../../Components/Forms/TextAreaInput';
import { useToast } from "../../Context/ToastContext";
import Modal from "../../Components/Modal/Modal";

const EditNotification = ({notification}) => {



  const { setTitle } = useNavbarContext();
  const { handleToast } = useToast();
  const [showLoadingModal, setshowLoadingModal] = useState(false);
  const { data, setData, processing, reset, post, errors } = useForm({
      title: notification?.title || '',
      subject: notification?.subject ||'',
      notif_type: notification?.notif_type || '',
      content: notification?.content || '',
      selected: {value: notification?.notif_type, label: notification?.notif_type}
  });


  function handleChange(e) {
    const key = e.name ? e.name : e.target.name;
    const value = e.value ? e.value : e.target.value;
    setData((editForms) => ({
        ...editForms,
        [key]: value,
    }));
  }
  

  useEffect(() => {
    setTimeout(() => {
            setTitle("Notification Management - Edit");
        }, 5);
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      Swal.fire({
          title: `<p class="font-nunito-sans text-3xl" >Update Notification?</p>`,
          showCancelButton: true,
          confirmButtonText: "Update",
          confirmButtonColor: "#000000",      
          icon: "question",
          iconColor: "#000000",
          reverseButtons: true,
      }).then(async (result) => {
          if (result.isConfirmed) {
              setshowLoadingModal(true);
              post("/notif_manager/edit-save", {
                  onSuccess: (data) => {
                      const { message, success } = data.props.auth.sessions;
                      handleToast(message, success);
                      setshowLoadingModal(false);
                  },
                  onError: (newErrors) => {
                      console.log(newErrors);
                      setshowLoadingModal(false);
                  }
              }); 
          }
      });
      
      
  };

  return (
    <>
      <ContentPanel>
        <div className='font-nunito-sans text-sm'>
          <p className='mb-5'>Welcome to the Notification Creator Module! Create and send notifications quickly and easily.</p>
          <form onSubmit={handleSubmit}>
            <div className='flex space-x-2 mb-2'>
              <div className='flex-1'>
                <InputComponent 
                  name="title"
                  type="text"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={data.title}
                />
                {errors.title && (
                    <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                        {errors.title}
                    </span>
                )}
              </div>
              <div className='flex-1'>
                <DropdownSelect
                    placeholder="Choose Type"
                    selectType="select2"
                    displayName="Select Notification Type"
                    name="notif_type"
                    options={[{id:'Notification', value: 'Notification', name: 'Notification'}, {id: 'Patch Note', value: 'Patch Note', name: 'Patch Note'}]}
                    value={data.selected}
                    onChange={handleChange}
                />
                {errors.notif_type && (
                    <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                        {errors.notif_type}
                    </span>
                )}
              </div>
            </div>
            <InputComponent 
              name="subject"
              type="text"
              placeholder="Enter Subject"
              extendedClass1={'mb-2'}
              value={data.subject}
              onChange={handleChange}
            />
            {errors.subject && (
                <span className=" inline-block text-red-500 font-base mb-2 text-xs md:text-sm">
                    {errors.subject}
                </span>
            )}
            <TextAreaInput
              name="content"
              type="text"
              placeholder="Your Content"
              rows={12}
              value={data.content}
              onChange={handleChange}
              isrequired={false}
            />
            {errors.content && (
                <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                    {errors.content}
                </span>
            )}
            <div className='flex justify-between'>
              <Link
                type="btn"
                className="bg-primary w-fit text-white font-nunito-sans py-2 px-5 text-sm rounded-md mt-5 hover:opacity-70"
                href={'/notif_manager'}
              >
                Back              
              </Link>
              <button
                type="submit"
                className="bg-primary w-fit text-white font-nunito-sans py-2 px-5 text-sm rounded-md mt-5 hover:opacity-70"
                disabled={processing}
              >
                {processing
                    ? "Please Wait..."
                    : "Update"}
              </button>
            </div>
          </form>
        </div>
      <Modal show={showLoadingModal} modalLoading={true}/>
      </ContentPanel>
    </>
  )
}

export default EditNotification