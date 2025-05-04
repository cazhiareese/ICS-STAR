import React from 'react';

function TabSwitcher({ currentTab, setTab, tabs }) {
  return (
    <div className="w-full lg:w-auto min-w-xs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${
            currentTab === tab.value
              ? 'border-primary font-satoshi-bold'
              : 'border-transparent font-satoshi-light'
          }`}
          onClick={() => setTab(tab.value)}
        >
          <p className="text-black text-md">{tab.label}</p>
        </button>
      ))}
    </div>
  );
}

export default TabSwitcher;