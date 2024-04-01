import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
      <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
    </div>
  );
};

export default Loading;
