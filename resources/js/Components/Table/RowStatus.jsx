import React from 'react'

const RowStatus = ({
  children,
  status,
  isLoading,
  center
}) => {


  const statusColor = {
      success: "bg-status-success",
      error: "bg-status-error",
      completed: "bg-status-success",
      failed:"bg-status-error",
  }[status];


  return (
    <td className={`${center && 'text-center'} px-6 py-3 bg-white`}>
			{isLoading ? (
				<span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200">&nbsp;&nbsp;</span>
			) : (
				<span className={`mx-auto rounded-full text-white px-3 py-1 ${statusColor} `}>{children}</span>
			)}
		</td>
  )
}

export default RowStatus
