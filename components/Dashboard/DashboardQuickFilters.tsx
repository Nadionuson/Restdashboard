import { Globe2, Users, User } from 'lucide-react';

interface DashboardQuickFiltersProps {
  visibilityFilters: string[];
  toggleFilter: (key: string) => void;
}

export function DashboardQuickFilters({ visibilityFilters, toggleFilter }: DashboardQuickFiltersProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Quick Filter
      </label>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => toggleFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
            ${visibilityFilters.includes('all')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
        >
          <Globe2 className="w-4 h-4" />
          Show Me Everything
        </button>
        <button
          type="button"
          onClick={() => toggleFilter('friends')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
            ${visibilityFilters.includes('friends')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
        >
          <Users className="w-4 h-4" />
          Friends'
        </button>
        <button
          type="button"
          onClick={() => toggleFilter('mine')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
            ${visibilityFilters.includes('mine')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
        >
          <User className="w-4 h-4" />
          Just Mine
        </button>
      </div>
    </div>
  );
}
