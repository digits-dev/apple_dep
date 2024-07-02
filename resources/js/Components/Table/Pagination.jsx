import React, { Fragment } from "react";
import { Link } from "@inertiajs/react";
import useViewport from "../../Hooks/useViewport";


const Pagination = ({ paginate }) => {
    const { width } = useViewport();
    const mobileView = width < 640 ? true : false ;

    return (
        <div className="flex justify-between items-center w-full px-2 gap-2">
            {mobileView ? 
            <>
                <Link
                    href={paginate.prev_page_url}
                    preserveState
                    preserveScroll
                    className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-gray-500 shadow-md ${!paginate.prev_page_url && "opacity-50 cursor-not-allowed"} `}
                >
                 « Previous
                </Link>
                <Link
                    href={paginate.next_page_url}
                    preserveState
                    preserveScroll
                    className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-gray-500 shadow-md ${!paginate.next_page_url && "opacity-50 cursor-not-allowed"}`}
                >
                 Next »
                </Link>
            </> 
            // Desktop View
            :
            <>
                <span className="text-gray-500 font-medium text-sm">
                    Showing {paginate.from} to {paginate.to} of {paginate.total} results.
                </span>

                <nav className="inline-flex p-2">
                    {paginate.links.map((link, index) => {
                        const Label = index == 0
                            ? <i className="fa-solid fa-chevron-left text-sm"></i>
                            : paginate.links.length - 1 == index
                            ? <i className="fa-solid fa-chevron-right text-sm"></i>
                            : link.label;

                        return <Fragment key={"page" + link.label + 'index' + index}>
                        {link.url ? 

                        <Link
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`text-white inline-block px-4 py-2 font-medium text-sm first:border-l-0 last:border-r-0 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md   border-l-[0.1px] border-r-[0.1px] border-gray-100 bg-gray-500 
                                ${link.active && "bg-gray-700 text-white"} ${!link.url && "cursor-not-allowed "}`}
                        >
                            {Label}
                        </Link> :

                        <span className={`text-white inline-block px-4 py-2 font-medium text-sm first:border-l-0 last:border-r-0 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md   border-l-[0.1px] border-r-[0.1px] border-gray-100 bg-gray-500 
                            cursor-not-allowed `}>
                                {Label}
                        </span>}
                      </Fragment>
})}
                </nav>
            </>
            }
         
        </div>
    );
};

export default Pagination;
