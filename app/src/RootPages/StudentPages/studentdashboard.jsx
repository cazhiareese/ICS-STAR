import React from "react";
import { useState } from "react";
import { PersonStanding } from "lucide-react";

function StudentLanding() {
    const [count, setCount] = useState(0);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="container max-w-md p-6 bg-white shadow-lg rounded-lg 
                        hover:-translate-y-2 transition-transform duration-300 ease-in-out">
          <h1 className="text-3xl font-bold text-blue-500 text-center">Frontend</h1>
          <p className="mt-2 text-gray-600 text-center">This is a sample Tailwind test.</p>
          <PersonStanding size={48} className="text-blue-500" />
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setCount(count + 1)}
            >
              Count: {count}
            </button>
          </div>
        </div>
      </div>
    );
}

export default StudentLanding;
