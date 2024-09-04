import React, { useState } from 'react'

const TransactionJsonTabs = ({RequestData, ResponseData}) => {

const [activeTab, setActiveTab] = useState('TabOne');

const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

    let JsonRequestData;
    let JsonResponseData;
    try {
        JsonRequestData = JSON.parse(RequestData);
        JsonResponseData = JSON.parse(ResponseData);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        JsonRequestData = RequestData;
        JsonResponseData = ResponseData;
    }

  return (
    <div className="w-full   flex flex-col">
      <div className="flex w-full border-b border-gray-300">
        <button
          className={`py-2 flex-1 px-4 ${
            activeTab === 'TabOne' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          } focus:outline-none font-nunito-sans font-bold`}
          onClick={() => handleTabChange('TabOne')}
        >
          JSON Request
        </button>
        <button
          className={`py-2 flex-1  px-4 ${
            activeTab === 'TabTwo' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          } focus:outline-none font-nunito-sans font-bold`}
          onClick={() => handleTabChange('TabTwo')}
        >
          JSON Response
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        {activeTab === 'TabOne' && 
            <div className='overflow-auto max-h-[70vh]'>
                <pre className="py-3 px-5 text-sm">
                    {JSON.stringify(JsonRequestData, null, 2)}
                </pre>
            </div>
        }
        {activeTab === 'TabTwo' && 
            <div className='overflow-auto max-h-[70vh]'>
                <pre className="py-3 px-5 text-sm">
                    {JSON.stringify(JsonResponseData, null, 2)}
                </pre>
            </div>
        }
      </div>

    </div>
  );
}

export default TransactionJsonTabs