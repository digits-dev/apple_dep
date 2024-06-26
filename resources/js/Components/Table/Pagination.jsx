import React from "react";
import { Link } from "@inertiajs/react";
import useViewport from "../../Hooks/useViewport";


const Pagination = ({ paginate }) => {
    const { width } = useViewport();
    const mobileView = width < 640 ? true : false ;

    return (
        <div className="flex justify-between items-center w-full px-4 py-2 gap-2">
            {mobileView ? 
            <>
                <Link
                    href={paginate.prev_page_url}
                    className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-gray-500 shadow-md ${!paginate.prev_page_url && "opacity-50 cursor-not-allowed"} `}
                >
                 « Previous
                </Link>
                <Link
                    href={paginate.next_page_url}
                    className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-gray-500 shadow-md ${!paginate.next_page_url && "opacity-50 cursor-not-allowed"}`}
                >
                 Next »
                </Link>
            </> 
            // Desktop View
            :
            <>
                <span className="text-gray-500 font-medium">
                    Showing {paginate.from} to {paginate.to} of {paginate.total} results.
                </span>

                <nav className="inline-flex p-2">
                    {paginate.links.map((link, index) => (
                        <Link
                            key={link.label + index + link.id}
                            href={link.url}
                            preserveScroll
                            className={`text-white inline-block px-4 py-2 font-medium text-sm first:border-l-0 last:border-r-0 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md   border-l-[0.1px] border-r-[0.1px] border-gray-100 bg-gray-500 
                                ${link.active && "bg-gray-700 text-white"} ${!link.url && "cursor-not-allowed "}`}
                        >
                            {index == 0
                                ? <i className="fa-solid fa-chevron-left text-sm"></i>
                                : paginate.links.length - 1 == index
                                ? <i className="fa-solid fa-chevron-right text-sm"></i>
                                : link.label}
                        </Link>
                    ))}
                </nav>
            </>
            }
         
        </div>
    );
};

export default Pagination;
