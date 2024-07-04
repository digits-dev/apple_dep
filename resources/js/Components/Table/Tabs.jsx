import React, { useState } from 'react';
import TableContainer from './TableContainer';
import Thead from './Thead';
import Row from './Row';
import TableHeader from './TableHeader';
import RowData from './RowData';

const Tabs = ({ tabs }) => {
    console.log(tabs);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="bg-white rounded-md mt-4 w-full font-nunito-sans">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex items-center justify-between px-4">
            <p className='font-bold text-gray-700'>JSON Logs</p>
            <div>
                {tabs.map((tab) => (
                    <button
                    key={tab.id}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 ${
                        tab.id === activeTab
                        ? 'border-gray-700 text-gray-700 font-bold'
                        : 'border-transparent text-secondary hover:text-gray-900 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                    >
                    {tab.label}
                    </button>
                ))}
            </div>
        </nav>
      </div>
      <div className="px-4 py-5">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={tab.id === activeTab ? 'block' : 'hidden'}
          >
            <TableContainer autoHeight>
                <Thead>
                    <Row>
                        <TableHeader sortable={false} justify='center'>Head1</TableHeader>
                        <TableHeader sortable={false} justify='center'>Head2</TableHeader>
                        <TableHeader sortable={false} justify='center'>Head3</TableHeader>
                    </Row>
                </Thead>
                <tbody>
                    {Array.from({length:5}, (_,index)=> index).map(item => 
                    <Row key={item}>
                        <RowData center>
                            Data{item + 1}
                        </RowData>
                        <RowData center>
                            Data{item + 1}
                        </RowData>
                        <RowData center>
                            Data{item + 1}
                        </RowData>
                    </Row>
                )}
                    
                </tbody>
            </TableContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
