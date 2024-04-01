import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GrClose, GrDown, GrLinkDown, GrLinkUp, GrUp } from "react-icons/gr";
import { Column } from "./simple-table.d";
import SimpleTableSkeleton from "./simple-table-skeleton";

interface SimpleTableProps {
  columns: Column[];
  rows: any[];
  rowsPerPage?: number;
  height?: number;
  searchable?: boolean;
  actions?: any;
  advancedSearch?: any;
  loading?: boolean;
}

const HeaderSortable = ({
  column,
  sort,
  setSort,
}: {
  column: Column;
  sort: "asc" | "desc";
  setSort: (value: "asc" | "desc") => void;
}) => {
  return (
    <Button
      variant="link"
      onClick={() => {
        if (sort === "asc") {
          setSort("desc");
        } else {
          setSort("asc");
        }
      }}
      className="flex items-center p-0"
    >
      {column.title}
      {sort === "desc" ? (
        <GrLinkDown className="h-3 w-3 ml-2" />
      ) : (
        <GrLinkUp className="h-3 w-3 ml-2" />
      )}
    </Button>
  );
};

const SimpleTable = ({
  columns,
  rows,
  rowsPerPage,
  searchable,
  actions,
  advancedSearch,
  loading,
}: SimpleTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValues, setSearchValues] = useState<any>({});
  const [sortState, setSortState] = useState<{ [key: string]: "asc" | "desc" }>(
    {}
  );
  const totalPages = rowsPerPage ? Math.ceil(rows.length / rowsPerPage) : 1;

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

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function renderColumnValue(column: Column, item: any) {
    if (column.render) {
      return column.render(item);
    }
    if (column.money) {
      return formatCurrency(item[column.key]);
    }
    return item[column.key];
  }

  const handleSorting = (columnKey: string) => {
    setSortState((prevState) => ({
      ...prevState,
      [columnKey]: prevState[columnKey] === "asc" ? "desc" : "asc",
    }));
  };

  const startIndex = currentPage * (rowsPerPage || 1);
  const endIndex = Math.min(
    startIndex + (rowsPerPage || rows.length),
    rows.length
  );
  const sortedRows = [...rows].sort((a, b) => {
    const columnKey = Object.keys(sortState).find((key) => sortState[key]);
    if (!columnKey) return 0;

    const sortOrder = sortState[columnKey];
    const column = columns.find((col) => col.key === columnKey);
    if (!column) return 0;

    const aValue = a[column.key];
    const bValue = b[column.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
  });
  const filteredRows: any[] = sortedRows.filter((row) => {
    return Object.keys(searchValues).every((key) => {
      const value = searchValues[key].toLowerCase();
      return value === "null" ? true : row[key].toLowerCase().includes(value);
    });
  });
  const currentRows = filteredRows.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col items-end border rounded-md bg-card">
      {searchable && (
        <div className="w-full p-3 border-b">
          <div className="mb-2">
            <h3>
              <span className="text-gray-600">Pesquisar</span>
            </h3>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              {columns
                .filter((column) => column.search)
                .map((column) => {
                  if (column.type === "select") {
                    return (
                      <Select
                        key={column.key}
                        value={searchValues[column.key] || ""}
                        onValueChange={(value) => {
                          setSearchValues({
                            ...searchValues,
                            [column.key]: value as string,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue
                            placeholder={`Filtro por ${column.title}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{column.title}</SelectLabel>
                            {column?.options?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }
                  return (
                    <div key={column.key} className="relative">
                      <Input
                        key={column.key}
                        placeholder={`Pesquisar por ${column.title}`}
                        value={searchValues[column.key] || ""}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase();
                          setSearchValues({
                            ...searchValues,
                            [column.key]: value,
                          });
                        }}
                        className="w-full md:w-64"
                      />
                      {searchValues[column.key] && (
                        <Button
                          variant="outline"
                          size="minimal"
                          onClick={() => {
                            setSearchValues({
                              ...searchValues,
                              [column.key]: "",
                            });
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <GrClose className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              {advancedSearch}
            </div>
            {actions}
          </div>
        </div>
      )}
      {loading ? (
        <SimpleTableSkeleton />
      ) : (
        <Table className="border-b">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }}>
                  {column.sortable ? (
                    <HeaderSortable
                      key={column.key}
                      column={column}
                      sort={sortState[column.key] || "asc"}
                      setSort={() => handleSorting(column.key)}
                    />
                  ) : (
                    <span>{column.title}</span>
                  )}
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
                    {renderColumnValue(column, item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rowsPerPage &&
              currentRows.length < rowsPerPage &&
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
      )}

      {rowsPerPage && (
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
            disabled={
              currentPage === totalPages - 1 || currentRows.length === 0
            }
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={
              currentPage === totalPages - 1 || currentRows.length === 0
            }
          >
            <ChevronLast className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleTable;
