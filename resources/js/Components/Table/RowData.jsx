import React from 'react'

const RowData = ({
  children, 
  stickyLeftOrder = null,
  stickyRightOrder = null
}) => {
  
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
    <td className={`px-6 py-3 bg-white ${stickyLeftOrder && stickyLeftOrderVal} ${stickyRightOrder && stickyRightOrderVal}`}>{children}</td>
  )
}

export default RowData