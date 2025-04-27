
export function CampaignErrorState({ error }: { error: Error }) {
  return (
    <div className="w-full flex items-center justify-center py-10 text-destructive">
      Error loading campaigns: {error.message}
    </div>
  );
}
