import { Skeleton } from "./ui/skeleton";

interface FormSkeletonProps {
  numberOfInputs: number;
}

const FormSkeleton = ({ numberOfInputs }: FormSkeletonProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {Array.from({ length: numberOfInputs }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="w-10 h-3" />
            <Skeleton className="w-full h-10" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="w-20 h-10" />
      </div>
    </div>
  );
};

export default FormSkeleton;
