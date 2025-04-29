
interface ConversationEmptyProps {
  searchTerm: string;
  filter: string;
}

export function ConversationEmpty({ searchTerm, filter }: ConversationEmptyProps) {
  return (
    <div className="px-4 py-10 text-sm text-white/60 text-center">
      {searchTerm ? 
        `No conversations found matching "${searchTerm}"` : 
        filter !== "all" ? 
          `No ${filter} conversations found` : 
          "No conversations found."}
    </div>
  );
}
