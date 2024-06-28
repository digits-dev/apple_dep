import { Link } from '@inertiajs/react'
import React from 'react'

const RowAction = ({action, size, href}) => {

const iconSize = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}[size];

const icon = {
  view: <img className={iconSize} src="/images/table/eye.png" alt="eye icon" />,
  add: <img className={iconSize} src="/images/table/add.png" alt="eye icon" />,
  edit: <img className={iconSize} src="/images/table/pencil.png" alt="pencil icon" />
}[action];

  return (
    <Link href={href} as="button" className='inline-block mx-2'>
      {icon}
    </Link>
  )
}

export default RowAction