
export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
      <div className="text-sm font-medium">Campaign Status:</div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-green-500 mr-1" />
        <span className="text-sm">Active</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-gray-500 mr-1" />
        <span className="text-sm">Draft</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-amber-500 mr-1" />
        <span className="text-sm">Paused</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-purple-500 mr-1" />
        <span className="text-sm">Completed</span>
      </div>
    </div>
  );
}
