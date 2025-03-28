import React, { useState } from 'react';
import { Search } from "lucide-react";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("");

    const countries = [
        { name: "Belgium", continent: "Europe" },
        { name: "India", continent: "Asia" },
        { name: "Bolivia", continent: "South America" },
        { name: "Ghana", continent: "Africa" },
        { name: "Japan", continent: "Asia" },
        { name: "Canada", continent: "North America" },
        { name: "New Zealand", continent: "Australasia" },
        { name: "Italy", continent: "Europe" },
        { name: "South Africa", continent: "Africa" },
        { name: "China", continent: "Asia" },
        { name: "Paraguay", continent: "South America" },
        { name: "Usa", continent: "North America" },
        { name: "France", continent: "Europe" },
        { name: "Botswana", continent: "Africa" },
        { name: "Spain", continent: "Europe" },
        { name: "Senegal", continent: "Africa" },
        { name: "Brazil", continent: "South America" },
        { name: "Denmark", continent: "Europe" },
        { name: "Mexico", continent: "South America" },
        { name: "Australia", continent: "Australasia" },
        { name: "Tanzania", continent: "Africa" },
        { name: "Bangladesh", continent: "Asia" },
        { name: "Portugal", continent: "Europe" },
        { name: "Pakistan", continent: "Asia" },
    ];

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Filter countries based on search input
    const filteredCountries = searchInput
        ? countries.filter((country) =>
              country.name.toLowerCase().includes(searchInput.toLowerCase())
          )
        : [];

    return (
        <div>
            {/* Search Bar */}
            <div className="flex flex-row items-center relative w-1/3 h-12 m-16">
                <input
                    type="search"
                    className="font-satoshi-medium w-full h-full px-4 py-2 rounded-xl bg-gray-100 text-gray-600 border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter Alumni Name"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button className="absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-xl hover:brightness-125 flex items-center justify-center w-1/6 cursor-pointer">
                    <Search size={20} />
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Continent</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCountries.map((country, index) => (
                        <tr key={index}>
                            <td>{country.name}</td>
                            <td>{country.continent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchBar;
