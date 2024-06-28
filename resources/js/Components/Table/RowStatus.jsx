import React from 'react'

const RowStatus = ({
  children, 
  status,   
  stickyLeftOrder = null,
  stickyRightOrder = null
}) => {

    const statusColor = {
      success: "bg-status-success",
      error: "bg-status-error",
    }[status];

    // const stickyOrderVal = {
    //   first: `sticky ${stickyPosition}-0`,
    //   second: `sticky ${stickyPosition}-40`,
    //   third: `sticky ${stickyPosition}-60`,
    //   fourth: `sticky ${stickyPosition}-80`,
    // }[stickyOrder];

    const stickyLeftOrderVal = {
      first: `sticky left-0`,
      second: `sticky left-40`,
      third: `sticky left-60`,
      fourth: `sticky left-80`,
    }[stickyLeftOrder];
  
    const stickyRightOrderVal = {
      first: `sticky right-0`,
      second: `sticky right-40`,
      third: `sticky right-60`,
      fourth: `sticky right-80`,
    }[stickyRightOrder];

  return ( 
    <td className={`text-center bg-white ${stickyLeftOrder && stickyLeftOrderVal} ${stickyRightOrder && stickyRightOrderVal}`}>
        <span className={`mx-auto rounded-full text-white px-3 py-1 text-center ${statusColor} `}>{children} 
        </span>
    </td>
  )
}

export default RowStatus
