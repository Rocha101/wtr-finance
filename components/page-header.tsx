import Link from "next/link";
import { Button } from "./ui/button";
import { GrPrevious } from "react-icons/gr";

interface PageHeaderProps {
  title: string;
  description?: string;
  backlink?: string;
}

const PageHeader = ({ title, description, backlink }: PageHeaderProps) => {
  return (
    <div className="w-full items-center gap-4 flex px-3">
      {backlink && (
        <Link href={backlink} passHref>
          <Button variant="ghost" size="icon">
            <GrPrevious />
          </Button>
        </Link>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 ml-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
