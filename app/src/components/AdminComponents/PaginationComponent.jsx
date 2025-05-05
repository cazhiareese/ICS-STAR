import { MoveLeft, MoveRight } from 'lucide-react';

const PaginationComponent = ({ page, setPage, totalPages }) => {
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '') {
          setPage('');  // allow user to clear the field temporarily
        } else {
          const number = parseInt(value, 10);
          if (!isNaN(number) && number >= 1) {
            setPage(number);
          }
        }
      };
      

  return (
    <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
      <MoveLeft 
        className={`cursor-pointer ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (page > 1) setPage(page - 1);
        }}
      />
      <p className='text-sm'>Page</p>
      <input
        type="text"
        value={page}
        onChange={handleInputChange}
        className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold bg-white focus:bg-whitey"
      />
      <p className='text-sm'>of {totalPages}</p>
      <MoveRight 
        className={`cursor-pointer ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (page < totalPages) setPage(page + 1);
        }}
      />
    </div>
  );
};

export default PaginationComponent;
