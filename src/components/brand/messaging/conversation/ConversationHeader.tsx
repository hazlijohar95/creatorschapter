
interface ConversationHeaderProps {
  title: string;
}

export function ConversationHeader({ title }: ConversationHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10">
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </div>
  );
}
