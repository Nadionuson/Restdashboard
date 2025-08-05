export function DashboardQuickFilters() {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Quick Filter
      </label>
      <details className="relative w-full md:w-64">
        <summary className="input-modern cursor-pointer list-none">
          Privacy Filter
        </summary>
        <div className="absolute mt-1 w-full bg-white border border-border rounded shadow z-10 p-2 space-y-1">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm">Just Mine</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm">Friends'</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" defaultChecked />
            <span className="text-sm">Show me everything</span>
          </label>
        </div>
      </details>
    </div>
  );
}
