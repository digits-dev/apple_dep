import React from 'react'

const TableRow = ({children}) => {
  return (
    <tr key={item.id} className="border-b border-secondary last:border-none text-sm"> 
        {children}
    </tr>
  )
}

export default TableRow