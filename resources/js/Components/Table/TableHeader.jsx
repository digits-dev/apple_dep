import { router } from '@inertiajs/react';
import React from 'react'

const TableHeader = ({
  name,
  sortable = true,
  queryParams = null,
  children,
}) => {

  const sort_field = queryParams?.sortBy;
  const sort_direction = queryParams?.sortDir;
  const path = window.location.pathname;
  

  const handleSort = (name) => {
    let updatedParams = null;

    if (name === queryParams.sortBy) {
        const sortDir = sort_direction === "asc" ? "desc" : "asc";
        updatedParams = {...queryParams, sortDir: sortDir};

        router.get(path, updatedParams, {preserveScroll:true, preserveState:true});
    } else {
        updatedParams = {...queryParams, sortBy: name, sortDir: "asc"};

        router.get(path, updatedParams,  {preserveScroll:true, preserveState:true});
    }

  };
  
  return (
  
    <th onClick={(e) => handleSort(name)} className='text-secondary'>
      <div className="px-3 py-3 flex items-center  justify-between gap-2 cursor-pointer">
        {children}
        {sortable && (
          <div className={"flex flex-col"}>
            
            <i className={"fa-solid fa-chevron-up" + (sort_field === name && sort_direction === "asc"
                  ? "text-white"
                  : "")}></i>
      
            <i className={"fa-solid fa-chevron-down" + (sort_field === name && sort_direction === "desc"
                  ? "text-white"
                  : "")}></i>
          </div>
        )}
      </div>
    </th>
  )
}

export default TableHeader