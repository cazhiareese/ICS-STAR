import React from 'react'
import SearchBar from '../../components/searchbar'


function AlumniSearch() {
  return (
    <div className='flex flex-col'>
        {/* Search bar */}
        <div className='flex flex-col w-full mt-28 shadow-md pb-8 items-center rounded-2xl'>
            <SearchBar/>
        </div>
    </div>
  )
}

export default AlumniSearch