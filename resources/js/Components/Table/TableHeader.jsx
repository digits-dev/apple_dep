import { router } from '@inertiajs/react';
import React from 'react'

const TableHeader = ({
  name,
  sortable = true,
  queryParams = null,
  children,
  justify = "between",
  width = "md",
  stickyLeftOrder = null,
  stickyRightOrder = null,
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

  const colWidth = {
    auto: "w-auto",
    sm: 'min-w-20',
    md: 'min-w-40',
    lg: 'min-w-80',
  }[width];

  const justifyValue = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end"
  }[justify];

  // const stickyOrderVal = {
  //   first: `sticky ${alignment}-0`,
  //   second: `sticky ${alignment}-40`,
  //   third: `sticky ${alignment}-60`,
  //   fourth: `sticky ${alignment}-80`,
  // }[stickyOrder];

  const stickyLeftOrderVal = {
    first: `sticky left-0`,
    second: `sticky left-40`,
    third: `sticky left-60`,
    fourth: `sticky left-80`,
  }[stickyLeftOrder];

  const stickyRightOrderVal = {
    first: `sticky right-0`,
    second: `sticky right-40`,
    third: `sticky right-60`,
    fourth: `sticky right-80`,
  }[stickyRightOrder];


  return (
  
    <th onClick={(e) => handleSort(name)} className={`text-secondary font-nunito-sans border-b  border-secondary text-sm bg-white  ${colWidth} ${stickyLeftOrder && stickyLeftOrderVal} ${stickyRightOrder && stickyRightOrderVal}`}>
      <div className={`px-6 py-3.5 flex items-center gap-3 ${sortable && "cursor-pointer"} ${justifyValue}`}>
        {children}
        {sortable && (
          <div>

          { sort_field && sort_direction &&
              sort_field === name && sort_direction === "desc" ?
              <span className='inline-block mb-0.5'>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 7L8.39711 0.25H0.602886L4.5 7Z" fill="#797878"/>
                </svg> 
              </span>
              : sort_field === name && sort_direction === "asc" ?
              <span className='inline-block mb-0.5'>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 0L8.39711 6.75H0.602886L4.5 0Z" fill="#797878"/>
                </svg>
              </span>
              :
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 15L8.39711 8.25H0.602886L4.5 15Z" fill="#797878"/>
                <path d="M4.5 0L8.39711 6.75H0.602886L4.5 0Z" fill="#797878"/>
              </svg>
          }
          </div>
        )}
      </div>
    </th>
  )
}

export default TableHeader