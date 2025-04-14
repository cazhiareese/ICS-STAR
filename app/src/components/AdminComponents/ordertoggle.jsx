import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

function OrderToggle({ direction, onToggle }) {
  const isAscending = direction === 'asc';

  return (
    <button
      onClick={() => onToggle(isAscending ? 'desc' : 'asc')}
      className="px-2 rounded-full border border-gray-300 flex items-center justify-center hover:border-hover hover:shadow-md cursor-pointer"
    >
      {isAscending ? (
        <ArrowUp className="text-primary" />
      ) : (
        <ArrowDown className="text-primary" />
      )}
    </button>
  );
}

export default OrderToggle;
