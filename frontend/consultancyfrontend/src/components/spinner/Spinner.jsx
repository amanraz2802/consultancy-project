import React from "react";
import { Loader } from "lucide-react";

function Spinner({ text }) {
  return (
    // <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center mt-32">
      <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
    // </div>
  );
}

export default Spinner;
