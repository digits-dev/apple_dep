import React from 'react'

const TableButton = ({children, onClick}) => {
  return (
    <button onClick={onClick} className='bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 '>{children}</button>
  )
}

export default TableButton