
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex space-x-1 px-4 py-2 bg-white/10 rounded-lg">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
      </div>
    </div>
  );
}
