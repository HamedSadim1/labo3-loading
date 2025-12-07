import React, { useState } from "react";
import { FidgetSpinner } from "react-loader-spinner";
import { delay } from "../utils/delay";

const Loading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoading = async () => {
    setLoading(true);
    await delay(3000);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {loading ? (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass=""
            ballColors={["#ffffff", "#e0e7ff", "#c7d2fe"]}
            backgroundColor="#6366f1"
          />
          <p className="text-white mt-4 font-medium">Loading...</p>
        </div>
      ) : (
        <button
          onClick={handleLoading}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-6 py-3 text-white font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:shadow-xl"
        >
          Start Loading
        </button>
      )}
    </div>
  );
};

export default Loading;
