import React from "react";
import { useNavigate } from "react-router-dom";

const ViewDetailButton = ({ link }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-md flex items-center gap-2"
          onClick={
            () => {
              navigate(link);
            }
            // console.log(`View ${activeTab} details`)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ViewDetailButton;
