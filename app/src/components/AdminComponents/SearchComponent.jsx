import React from 'react';
import { Search } from 'lucide-react';

function SearchComponent({ query, setQuery, focused, setFocused }) {
  return (
    <div className="relative flex items-center justify-end flex-1">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full lg:w-64 px-4 py-2 border rounded-3xl focus:outline-none bg-white ${
          focused ? 'border-primary border-2' : 'border-gray-400'
        }`}
      />
      <button
        className='absolute top-1/2 -translate-y-1/2 right-0 h-[40px] w-[70px] flex items-center justify-center rounded-full bg-primary'
      >
        <Search className={`absolute text-white`} size={20} />
      </button>
      
    </div>
  );
}

export default SearchComponent;