
import { SearchField } from "./filters/SearchField";
import { SortSelect } from "./filters/SortSelect";

interface ApplicationFilterBarProps {
  searchValue: string;
  sortValue: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function ApplicationFilterBar({
  searchValue,
  sortValue,
  onSearchChange,
  onSortChange,
}: ApplicationFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <SearchField value={searchValue} onChange={onSearchChange} />
      <SortSelect value={sortValue} onChange={onSortChange} />
    </div>
  );
}
