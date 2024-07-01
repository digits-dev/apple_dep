import React from 'react'

const TopPanel = ({children}) => {
  return (
    <div className='w-full inline-block py-2 px-2.5 rounded-md bg-white shadow-sm'>
      <div className='flex gap-3 flex-wrap'>
        {children}
      </div>
    </div>
  )
}

export default TopPanel