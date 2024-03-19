import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Column = {
  title: string;
  key: string;
  render?: (row: any) => any;
  width?: string;
};

interface SimpleTableProps {
  columns: Column[];
  rows: any[];
  rowsPerPage: number;
  height?: number;
}

const SimpleTable = ({ columns, rows, rowsPerPage }: SimpleTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, rows.length);

  const currentRows = rows.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const renderPaginationButtons = () => {
    const paginationRange = 2;
    const start = Math.max(0, currentPage - paginationRange);
    const end = Math.min(totalPages - 1, currentPage + paginationRange);

    const buttons = [];
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          disabled={i === currentPage}
          onClick={() => setCurrentPage(i)}
          size="icon"
          className="text-xs"
        >
          {i + 1}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex flex-col items-end border rounded-md">
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} style={{ width: column.width }}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{ width: column.width }}
                  className="py-1"
                >
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {currentRows.length < rowsPerPage &&
            [...Array(rowsPerPage - currentRows.length)].map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  colSpan={columns.length}
                  className="py-6"
                  style={{ width: "100%" }}
                />
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 px-3">
        <span className="mr-2">
          Página {currentRows.length === 0 ? 0 : currentPage + 1} de{" "}
          {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0 || currentRows.length === 0}
        >
          <ChevronFirst className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 0 || currentRows.length === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {renderPaginationButtons()}
        <Button
          variant="outline"
          size="icon"
          onClick={nextPage}
          disabled={currentPage === totalPages - 1 || currentRows.length === 0}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || currentRows.length === 0}
        >
          <ChevronLast className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SimpleTable;
