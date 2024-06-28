import React from 'react'

const TableButton = ({children}) => {
  return (
    <button className='bg-primary text-white px-5 py-2 rounded-lg font-nunito-sans text-sm border border-secondary'>{children}</button>
  )
}

export default TableButton