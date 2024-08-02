import React, { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import debounce from "lodash/debounce";

const TableSearch = ({ queryParams }) => {
	const [searchValue, setSearchValue] = useState(queryParams?.search || "");
	const path = window.location.pathname;

	const debouncedSearch = debounce((searchValue, path, queryParams)=> {
		router.get(path, { ...queryParams, search: searchValue, page: 1 }, { preserveState: true, replace: true });
	}, 500);

	useEffect(() => {

		if (searchValue != "") {
			debouncedSearch(searchValue, path, queryParams);
		} else {
			router.get(path, {}, {preserveState:true});
		}

		return () => debouncedSearch.cancel();

	}, [searchValue]);

	return (
		<search className="font-nunito-sans w-full max-w-[400px]">
			<input
				className="border border-secondary rounded-lg overflow-hidden h-10 w-full block px-4 text-sm outline-none"
				type="text"
				name="search"
				id="search"
				placeholder="Search"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
		</search>
	);
};

export default TableSearch;
