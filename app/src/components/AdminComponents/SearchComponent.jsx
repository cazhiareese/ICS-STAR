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
        className={`w-full lg:w-xs px-4 py-2 border rounded-3xl focus:outline-none bg-white ${
          focused ? 'border-primary border-2' : 'border-gray-400'
        }`}
      />
      <Search className={`absolute mr-2 ${focused ? 'text-primary' : 'text-gray-400'}`} size={20} />
    </div>
  );
}

export default SearchComponent;