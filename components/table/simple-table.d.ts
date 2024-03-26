type Column = {
  title: string;
  key: string;
  render?: (row: any) => any;
  width?: string;
  money?: boolean;
  search?: boolean;
  type?: "select" | "text" | "number" | "date" | "time" | "datetime";
  options?: { label: string; value: string }[];
  sortable?: boolean;
};

export { Column };
