import React from 'react'

const TableHeader = ({
  name,
  sortable = true,
  sort_field = null,
  sort_direction = null,
  sortChanged = () => {},
  children,
}) => {
  
  return (
  
    <th onClick={(e) => sortChanged(name)} className='text-secondary'>
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