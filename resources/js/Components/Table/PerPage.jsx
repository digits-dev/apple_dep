import { router } from '@inertiajs/react';
import React, { useRef } from 'react'

const PerPage = ({queryParams}) => {
  const perPage = useRef(queryParams?.perPage || 10);
  const path = window.location.pathname;


  const handleChange = (e) => {
      perPage.current = e.target.value;
      const updatedParams = {...queryParams, perPage: perPage.current, page: 1};
      router.get(path, updatedParams, {preserveScroll:true, preserveState:true});
  }

  return (
    <div className='custom-select'>
      <select  name="perPage" id="perPage" value={perPage.current} onChange={handleChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
      </select>
      {/* Icon  */}
      <span className=' arrow-icon mt-0.5'>
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 7L8.39711 0.25H0.602886L4.5 7Z" fill="#797878"/>
        </svg> 
      </span>
    </div>
  )
}


export default PerPage