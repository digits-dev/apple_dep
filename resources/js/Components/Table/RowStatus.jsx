import React from 'react'

const RowStatus = ({
  children,
  systemStatus,
  isLoading,
  center,
  color
}) => {


  const systemStatusColor = {
      active: "bg-status-success",
      inactive: "bg-status-error",
  }[systemStatus];


  return (
    <td className={`${center && 'text-center'} px-6 py-3 bg-white`}>
			{isLoading ? (
				<span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200">&nbsp;&nbsp;</span>
			) : (
        <>
        {systemStatusColor ? 
        <span className={`mx-auto rounded-full text-white px-3 py-1 ${systemStatusColor} `}>{children}</span> 
        :
				<span style={{background: color}} className={`mx-auto rounded-full ${color && 'text-white'} px-3 py-1 `}>{children}</span>
        }
				
        </>
			)}
		</td>
  )
}

export default RowStatus
