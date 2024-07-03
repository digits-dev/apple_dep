import React from 'react'

const Row = ({children}) => {


  return (
    <tr className={`border-b border-secondary text-sm has-[th]:border-none`}>
        {children}
    </tr>
  )
}

export default Row
