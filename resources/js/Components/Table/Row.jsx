import React from 'react'

const Row = ({children}) => {
  return (
    <tr className={`border-b border-secondary text-sm`}>
        {children}
    </tr>
  )
}

export default Row
