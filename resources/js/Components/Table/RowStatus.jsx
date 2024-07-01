import React from 'react'

const RowStatus = ({
  children,
  status,
  isLoading
}) => {


  const statusColor = {
      success: "bg-status-success",
      error: "bg-status-error",
  }[status];


  return (
    <td className={`text-center bg-white`}>
			{isLoading ? (
				<span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-500">&nbsp;&nbsp;</span>
			) : (
				<span className={`mx-auto rounded-full text-white px-3 py-1 text-center ${statusColor} `}>{children}</span>
			)}
		</td>
  )
}

export default RowStatus
