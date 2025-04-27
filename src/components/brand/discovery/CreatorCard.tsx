
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DiscoverableCreator } from "../hooks/useCreators";

interface CreatorCardProps {
  creator: DiscoverableCreator;
  onViewProfile: () => void;
}

export function CreatorCard({ creator, onViewProfile }: CreatorCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{creator.name}</h3>
                <p className="text-muted-foreground">{creator.handle}</p>
              </div>
              <Button size="sm" className="mt-2 sm:mt-0" onClick={onViewProfile}>
                View Profile
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {creator.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary">{category}</Badge>
              ))}
              {creator.categories.length > 3 && (
                <Badge variant="outline">+{creator.categories.length - 3}</Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>{creator.followers} followers</span>
              <span>{creator.engagementRate} engagement</span>
              <span>{creator.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
