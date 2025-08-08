import { Globe2, Users, User } from 'lucide-react';

interface DashboardQuickFiltersProps {
  visibilityFilters: string[];
  toggleFilter: (key: string) => void;
  excludeKeys?: string[]; // NEW: keys to hide
}

const FILTERS = [
  { key: 'all', label: 'Show Me Everything', Icon: Globe2 },
  { key: 'friends', label: "Friends'", Icon: Users },
  { key: 'mine', label: 'Just Mine', Icon: User },
];

export function DashboardQuickFilters({ visibilityFilters, toggleFilter, excludeKeys = [] }: DashboardQuickFiltersProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Quick Filter
      </label>
      <div className="flex gap-2 flex-wrap">
        {FILTERS.filter(({ key }) => !excludeKeys.includes(key)).map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
              ${visibilityFilters.includes(key)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
