import React from 'react'
import TableButton from './TableButton'
import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'

const Import = ({path}) => {

  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  const submit = (e) => {
    e.preventDefault()
    router.post('/test', {file: data});
  }

  const handleShow = () => {
    setShow(!show);
  }
  
  return (
    <>
    <TableButton onClick={handleShow}>Import</TableButton>
    {show && 
    <div  className='fixed inset-0 z-[51]'>
      {/* modal backdrop  */}
      <div onClick={handleShow} className='bg-black/50 h-full w-full'></div>
      {/* modal content  */}
      <div className='h-2/6 w-2/6 fixed z-[52] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-md px-5 py-5 flex flex-col gap-4'>
        <header className='flex items-center justify-between '>
          <h1 className='text-lg font-bold'>Import</h1>
          <a className='underline underline-offset-2 cursor-pointer' href={path}>Download Template</a>
        </header>

        <form className='flex flex-col h-full'  onSubmit={submit}>
          <div className='flex-1 flex gap-3 items-center'>
            <label htmlFor="file" className='text-lg font-medium'>File:</label>
            <input className='border  border-primary w-full p-1 rounded-md cursor-pointer' id='file' type="file" onChange={e => setData(e.target.files[0])} />
          </div>
          {/* Buttons */}
          <div className='h-10 flex gap-4 justify-center items-center text-sm'>
            <button className='py-2 px-4 bg-primary border-[0.1px] border-primary text-white rounded-md' type="submit">Import</button>
            <button onClick={handleShow} className='py-2 px-4 bg-gray-100 border-[0.1px] border-primary text-gray-900 rounded-md' type="button">Cancel</button>
          </div>
        </form>


      
      </div>
    </div>
    }
    </>
  )
}

export default Import

// h-1/2 w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-400