import React from 'react'

const ContentPanel = ({children}) => {
  return (
    <div className='py-4 px-3 my-5 rounded-lg bg-white shadow-sm  w-full flex flex-col justify-between'>{children}</div>
  )
}

export default ContentPanel
