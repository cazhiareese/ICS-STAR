import React, {useState} from 'react'

// This is the sorting dropdown component
// 'filters' is the list of filters to display 
// 'selectedFilter' is used to change the ui of the button
// 'onSelect' is an event to change the ui of the button

// the 'selectedFilter' and 'onSelect' states are set in the parent component
function SortModal({filters, selectedFilter, onSelect}) {
  const [open, setOpen] = useState(false)
  const selectedLabel = filters.find((f) => f.value === selectedFilter)?.label || selectedFilter;
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1 font-satoshi-light text-black hover:border-hover hover:shadow-md bg-[#FFFFFF]"
      > <span className="font-satoshi-bold text-primary">{selectedLabel}</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-48 origin-top-right rounded-lg bg-[#FFFFFF] shadow-xl">
          <div className="py-2 text-sm text-black">
            <div className="px-4 py-1 font-satoshi-medium text-black">Sort by:</div>
            {filters.map(({label, value} )=> (
              <button
                key={value}
                onClick={() => {
                  onSelect(value);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                {/* Radio-style indicator */}
                <span className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-black">
                  {selectedFilter === value && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </span>

                <span
                  className={`${
                    selectedFilter === value ? 'font-semibold text-primary' : ''
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SortModal
