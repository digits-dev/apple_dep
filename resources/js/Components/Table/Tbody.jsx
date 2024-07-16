import React from 'react'
import useViewport from '../../Hooks/useViewport';

const Tbody = ({data, children}) => {
    const { width } = useViewport();
    const mobileView = width < 640 ? true : false ;

  return (
   <>
    {data?.length != 0 ?  
        <tbody>
            {children}
        </tbody>
        : <tbody>
            <tr className='absolute w-full h-full top-0 grid place-items-center p-12'>
                <td className={`my-2 text-center text-xl font-nunito-sans font-semibold flex ${mobileView && 'flex-col'} gap-4 items-center justify-center`}>
                    <i className="fa-solid fa-inbox text-3xl"></i><em>No data available.</em>
                </td>
            </tr>
        </tbody>}
    </>
  )
}

export default Tbody