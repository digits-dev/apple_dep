import React, { useEffect, useState } from 'react';
import { router } from "@inertiajs/react";

const TableSearch = ({queryParams}) => {
 const [searchValue, setSearchValue] = useState("");
 const path = window.location.pathname;

 useEffect(() => {

    let delayDebounceFn = null;

    if (searchValue !== '') {

      delayDebounceFn = setTimeout(() => {
        router.get(path, {...queryParams, search: searchValue, page: 1}, {preserveState: true});
      }, 500);
      
    } else {
      const { search, ...updatedParams } = queryParams;
      router.get(path, updatedParams, {preserveState: true});
    }

    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
    
  }, [searchValue, queryParams?.search]); 

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <search>
        <input type="text" name="search" id="search" placeholder='Search'
            value={searchValue}
            onChange={handleInputChange}
            />
    </search>
  )
}

export default TableSearch