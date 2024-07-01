import React from 'react'

const RowData = ({
  children,
  sticky,
  center,
  isLoading
}) => {

  const stickyClass = {
		left: "sticky left-0 after:absolute after:top-0 after:right-0 z-40  after:h-full after:w-[0.1px] after:bg-secondary bg-white",
		right: "sticky right-0 before:absolute before:top-0 before:left-0  z-40  before:h-full before:w-[0.1px] before:bg-secondary",
	}[sticky];

  return (
    <td className={`px-6 py-3 bg-white  ${stickyClass} ${center && "text-center"}`}>
      {isLoading ? <span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200 ">&nbsp;&nbsp;</span> : children}
    </td>
  )
}

export default RowData
