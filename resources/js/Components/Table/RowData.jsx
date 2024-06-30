import React from 'react'

const RowData = ({
  children,
  sticky,
  center
}) => {

  const stickyClass = {
    left: 'sticky left-0 after:absolute after:top-0 after:right-0  after:h-full after:w-[0.1px] after:bg-secondary',
    right: 'sticky right-0 before:absolute before:top-0 before:left-0  before:h-full before:w-[0.1px] before:bg-secondary',
  }[sticky];


  return (
    <td className={`px-6 py-3 bg-white ${stickyClass} ${center && "text-center"}`}>{children}</td>
  )
}

export default RowData
