import { GrRotateRight } from "react-icons/gr";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <GrRotateRight className="animate-spin text-4xl" />
    </div>
  );
};

export default Loading;
