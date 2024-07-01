import React from 'react';
import TableButton from './TableButton';

const Export = ({path}) => {



  return (
    <button className='bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary'><a className='px-5 py-2.5' href={path}>Export</a></button>
  )
}

export default Export
