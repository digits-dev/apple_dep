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
    <select  name="perPage" id="perPage" value={perPage.current} onChange={handleChange}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
    </select>
  )
}

export default PerPage