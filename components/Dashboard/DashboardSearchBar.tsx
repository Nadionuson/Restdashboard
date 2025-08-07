import { Search } from 'lucide-react';

interface DashboardSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function DashboardSearchBar({ value, onChange }: DashboardSearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-modern pl-10"
        placeholder="Search restaurants by name..."
      />
    </div>
  );
}
