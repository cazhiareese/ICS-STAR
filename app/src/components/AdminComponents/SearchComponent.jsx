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
        className={`w-full px-5 py-3 pr-10 border rounded-full text-black focus:outline-none bg-whitey lg:w-xs ${
          focused ? 'border-primary' : 'border-neutral-300'
        }`}
      />
      <button
        className="absolute right-1 py-3 px-5 bg-primary rounded-full text-white hover:bg-hover transition" >
        <Search size={20} />
      </button>
    </div>
  );
}

export default SearchComponent;