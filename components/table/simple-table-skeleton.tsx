import React from "react";
import { GrRefresh } from "react-icons/gr";

const SimpleTableSkeleton = () => {
  return (
    <div className="h-[588px] w-full flex flex-col items-center justify-center">
      <GrRefresh className="animate-spin h-6 w-6" />
    </div>
  );
};

export default SimpleTableSkeleton;
