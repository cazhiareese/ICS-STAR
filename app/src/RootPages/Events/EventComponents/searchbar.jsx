import React from 'react';

const SearchBar = () => {
    return (
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
                aria-label="Search"
            />
            <button type="button">Search</button>
        </div>
    );
};

export default SearchBar;