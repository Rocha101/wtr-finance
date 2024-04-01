import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SimpleTableSkeleton = () => {
  return (
    <div className="h-[588px] w-full flex flex-col items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
    </div>
  );
};

export default SimpleTableSkeleton;
