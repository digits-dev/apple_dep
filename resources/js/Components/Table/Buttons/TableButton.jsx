import React from 'react'

const TableButton = ({children, onClick, disabled, type}) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className='bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 '>{children}</button>
  )
}

export default TableButton