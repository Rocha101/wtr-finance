import { GrRotateRight } from "react-icons/gr";

interface LoadingProps {
  dialog?: boolean;
}

const Loading = ({ dialog }: LoadingProps) => {
  return (
    <div
      className={`${
        dialog ? "h-full " : "h-screen"
      } w-full flex items-center justify-center`}
    >
      <GrRotateRight className="animate-spin text-4xl" />
    </div>
  );
};

export default Loading;
