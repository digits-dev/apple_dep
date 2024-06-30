import React from 'react'

const RowStatus = ({
  children,
  status,
  sticky
}) => {

    const stickyClass = {
        left: 'sticky left-0',
        right: 'sticky right-0',
    }[sticky];

    const statusColor = {
        success: "bg-status-success",
        error: "bg-status-error",
    }[status];


  return (
    <td className={`text-center bg-white ${stickyClass}`}>
        <span className={`mx-auto rounded-full text-white px-3 py-1 text-center ${statusColor} `}>{children}
        </span>
    </td>
  )
}

export default RowStatus
