import React, { useRef, useState } from 'react'

const TransactionJsonTabs = ({RequestData, ResponseData}) => {

const [activeTab, setActiveTab] = useState('TabOne');
const [isCopied, setisCopied] = useState(false);

const requestRef = useRef(null);
const responseRef = useRef(null);


const handleCopied = async ()  => {

  let contentToCopy = '';
  if (activeTab === 'TabOne' && requestRef.current) {
    contentToCopy = requestRef.current.textContent; // Get the text from the JSON request <pre> element
  } else if (activeTab === 'TabTwo' && responseRef.current) {
    contentToCopy = responseRef.current.textContent; // Get the text from the JSON response <pre> element
  }
  
  await navigator.clipboard.writeText(contentToCopy); // Copy the text
  setisCopied(true);
  setTimeout (()=> {
    setisCopied(false);
  }, 2000)
}

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
      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-fit">
        {activeTab === 'TabOne' && 
            <div className='overflow-auto max-h-[40vh]'>
                <div className='flex justify-end cursor-pointer pr-2' onClick={handleCopied}>
                  <img src='/images/others/copy-icon.png' className='w-5 h-auto'/>
                  <p className='text-gray-500 font-nunito-sans font-semibold text-sm ml-2'>{isCopied ? 'Copied!' : 'Copy'}</p>
                </div>
                <pre ref={requestRef} className="py-3 px-5 text-sm">
                    {JSON.stringify(JsonRequestData, null, 2)}
                </pre>
            </div>
        }
        {activeTab === 'TabTwo' && 
            <div className='overflow-auto h-full max-h-[40vh]'>
                <div className='flex justify-end cursor-pointer pr-2' onClick={handleCopied}>
                  <img src='/images/others/copy-icon.png' className='w-5 h-auto'/>
                  <p className='text-gray-500 font-nunito-sans font-semibold text-sm ml-2'>{isCopied ? 'Copied!' : 'Copy'}</p>
                </div>
                <pre ref={responseRef} className="py-3 px-5 text-sm">
                    {JSON.stringify(JsonResponseData, null, 2)}
                </pre>
            </div>
        }
      </div>

    </div>
  );
}

export default TransactionJsonTabs