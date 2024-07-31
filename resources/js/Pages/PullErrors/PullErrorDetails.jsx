import React, { useEffect } from 'react'
import Button from '../../Components/Table/Buttons/Button';
import ContentPanel from '../../Components/Table/ContentPanel';
import { Head } from '@inertiajs/react';
import { useNavbarContext } from '../../Context/NavbarContext';

const PullErrorDetails = ({pullError}) => {
    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("ERP Pull Error - Details");
        }, 5);
    }, []);


    return (
        <>
            <Head title="ERP Pull Error - Details" />
            <ContentPanel marginBottom={2}>

             
                <div className="mb-10 border font-nunito-sans  overflow-hidden " >
                <table className="table-auto border-collapse w-full  text-gray-700">
                    <tbody>
                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td >Sales Order #:</td>
                            <td>{pullError.order_number}</td>
                            <td>Serial1:</td>
                            <td>{pullError.serial1}</td>
                         
                        </tr>
                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Customer Name:</td>
                            <td>{pullError.customer_name}</td>
                            <td>Serial2:</td>
                            <td>{pullError.serial2}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            
                       <td>Line Number:</td>
                            <td>{pullError.line_number}</td>
                            <td>Serial3:</td>
                            <td>{pullError.serial3}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Order Reference Number</td>
                            <td>{pullError.order_ref_no}</td>
                            <td>Serial4:</td>
                            <td>{pullError.serial4}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>DR Number:</td>
                            <td>{pullError.dr_number}</td>
                            <td>Serial5:</td>
                            <td>{pullError.serial5}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Digits Code:</td>
                            <td>{pullError.digits_code}</td>
                            <td>Serial6:</td>
                            <td>{pullError.serial6}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Brand:</td>
                            <td>{pullError.brand}</td>
                            <td>Serial7:</td>
                            <td>{pullError.serial7}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>WH Category:</td>
                            <td>{pullError.wh_category}</td>
                            <td>Serial8:</td>
                            <td>{pullError.serial8}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Confirm Date:</td>
                            <td>{pullError.confirm_date}</td>
                            <td>Serial9:</td>
                            <td>{pullError.serial9}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Errors Message:</td>
                            <td>{pullError.errors_message}</td>
                            <td>Serial10:</td>
                            <td>{pullError.serial10}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Shipped Quantity:</td>
                            <td>{pullError.shipped_quantity}</td>
                            <td>Created Date:</td>
                            <td>{pullError.created_at}</td>
                        </tr>

                        <tr className='*:px-4 *:py-2 *:border *:border-gray-700'>
                            <td>Item Description:</td>
                            <td colSpan="3">{pullError.item_description}</td>
                        </tr>
                    </tbody>
                </table>
          
                </div>
                <div className="flex gap-2">
                    <Button type="link" href="/erp_pull_erp">
                        Back
                    </Button>
                  
                </div>
            </ContentPanel>
        </>
    );
}

export default PullErrorDetails