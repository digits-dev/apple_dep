import React from 'react'
import TableButton from './TableButton'
import { useState } from 'react';

const Filters = ({path, children, onSubmit}) => {
  
  const childCount = React.Children.count(children);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  }

  return (
    <>
    <TableButton onClick={handleShow} >Filters</TableButton>
    {show && 
      <div  className='fixed inset-0 z-[51] overflow-hidden'>
        {/* modal backdrop  */}
        <div onClick={handleShow} className='bg-black/50 h-full w-full overflow-hidden'></div>
        {/* modal content  */}
        <div className=' h-auto max-h-[90%] w-5/6  md:w-[650px] fixed z-[52] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-md px-5 py-5 flex flex-col gap-4 overflow-auto'>
          <header className='flex items-center justify-between '>
            <h1 className='text-lg font-bold'>Filters</h1>
          </header>
  
          <form className='flex flex-col h-full justify-between gap-5'  onSubmit={onSubmit}>
           <div className={`grid gap-4 ${childCount == 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
            {children ? children : 'Please add fields'}
           </div>
            {/* Buttons */}
            <div className='flex gap-4 justify-center items-center text-sm py-3'>
              <button className='py-2 px-4 bg-primary border-[0.1px] border-primary text-white rounded-md' type="submit">Search</button>
              <button onClick={handleShow} className='py-2 px-4 bg-gray-100 border-[0.1px] border-primary text-gray-900 rounded-md' type="button">Cancel</button>
            </div>
          </form>

        </div>
      </div>
      }
    </>
  )
}

export default Filters