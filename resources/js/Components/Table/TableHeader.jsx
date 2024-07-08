import { router } from '@inertiajs/react';
import React from 'react'
import DescIcon from './Icons/DescIcon';
import SortIcon from './Icons/SortIcon';
import AscIcon from './Icons/AscIcon';

const TableHeader = ({
  name,
  children,
  sortable = true,
  queryParams = null,
  justify = "between",
  width = "md",
  sticky
}) => {

  const sort_field = queryParams?.sortBy;
  const sort_direction = queryParams?.sortDir;
  const path = window.location.pathname;


  const handleSort = (name) => {
    let updatedParams = null;

    if (name === queryParams?.sortBy) {
        const sortDir = sort_direction === "asc" ? "desc" : "asc";
        updatedParams = {...queryParams, sortDir: sortDir};

        router.get(path, updatedParams, {preserveScroll:true, preserveState:true});
    } else {
        updatedParams = {...queryParams, sortBy: name, sortDir: "asc"};

        router.get(path, updatedParams,  {preserveScroll:true, preserveState:true});
    }

  };

  const widthClass = {
    auto: "w-auto",
    sm: 'min-w-20',
    md: 'min-w-40',
    lg: 'min-w-60',
    xl: 'min-w-72',
    '2xl': 'min-w-80',
  }[width];

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end"
  }[justify];

  const stickyClass = {
    left: 'sticky left-0 after:absolute after:top-0 after:right-0  after:h-full after:w-[0.60px] after:bg-secondary',
    right: 'sticky right-0 before:absolute before:top-0 before:left-0  before:h-full before:w-[0.60px] before:bg-secondary',
  }[sticky];

  return (
		<th
			onClick={sortable ? (() => handleSort(name)) : undefined}
			className={`text-secondary font-nunito-sans text-sm bg-white ${widthClass} ${stickyClass}`}>
			<div className={`px-5 py-3.5 flex items-center gap-3  left- ${sortable && "cursor-pointer"} ${justifyClass}`}>
				{children}
				{sortable && (
					<div>
						{sort_field &&
						sort_direction &&
						//  DESCENDING
						sort_field === name &&
						sort_direction === "desc" ? (
							<span className="inline-block mb-0.5">
								<DescIcon />
							</span>
						) : //  ASCENDING
						sort_field === name && sort_direction === "asc" ? (
							<span className="inline-block mb-0.5">
								<AscIcon/>
							</span>
						) : (
							// BOTH ICON
							<SortIcon />
						)}
					</div>
				)}
			</div>
		</th>
  );
}

export default TableHeader
