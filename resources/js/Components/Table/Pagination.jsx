import React, { Fragment } from "react";
import { Link } from "@inertiajs/react";
import useViewport from "../../Hooks/useViewport";


const Pagination = ({ paginate, onClick }) => {
    const { width } = useViewport();
    const mobileView = width < 640 ? true : false ;

    return (
        <div onClick={onClick} className="flex justify-between items-center w-full px-2 gap-2 mt-5">
            {mobileView ? 
            <>
                {paginate.prev_page_url ? 
                    <Link
                        href={paginate.prev_page_url}
                        preserveState
                        preserveScroll
                        className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-primary hover:bg-secondary shadow-md `}
                    >
                    « Previous
                    </Link> : 
                    <span className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-primary shadow-md opacity-50 cursor-not-allowed`}>
                        « Previous
                    </span>
                }

                {paginate.next_page_url ? 
                    <Link
                        href={paginate.next_page_url}
                        preserveState
                        preserveScroll
                        className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-primary hover:bg-secondary shadow-md `}
                    >
                    Next »
                    </Link> :    
                    <span className={`text-white block px-4 py-2 font-medium text-sm  rounded-md  bg-primary shadow-md opacity-50 cursor-not-allowed`}>
                        Next »
                    </span>
                }
            </> 
            // Desktop View
            :
            <>
                <span className="text-gray-500 font-medium text-sm">
                   {paginate.data.length != 0 ? 
                   `Showing ${paginate.from} to ${paginate.to} of ${paginate.total} results.` 
                   : 
                   `Showing 0 results.`} 
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
                            className={`text-white inline-block px-4 py-2 font-medium text-sm first:border-l-0 last:border-r-0 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md   border-l-[0.1px] border-r-[0.1px] border-gray-100 bg-primary hover:bg-secondary 
                                ${link.active && "bg-secondary text-white"} ${!link.url && "cursor-not-allowed "}`}
                        >
                            {Label}
                        </Link> :

                        <span className={`text-white inline-block px-4 py-2 font-medium text-sm first:border-l-0 last:border-r-0 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md   border-l-[0.1px] border-r-[0.1px] border-gray-100 bg-primary hover:bg-secondary 
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
