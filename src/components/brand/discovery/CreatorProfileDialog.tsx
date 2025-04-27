
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DiscoverableCreator } from "../hooks/useCreators";

interface CreatorProfileDialogProps {
  creator: DiscoverableCreator | null;
  onClose: () => void;
}

export function CreatorProfileDialog({ creator, onClose }: CreatorProfileDialogProps) {
  if (!creator) return null;

  return (
    <Dialog open={!!creator} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{creator.name}</DialogTitle>
          <DialogDescription>{creator.handle}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 mt-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-muted-foreground">{creator.location}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {creator.categories.map(category => (
                <Badge key={category} variant="secondary">{category}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium text-sm mb-1">Followers</div>
            <div className="text-lg">{creator.followers}</div>
          </div>
          <div>
            <div className="font-medium text-sm mb-1">Engagement</div>
            <div className="text-lg">{creator.engagementRate}</div>
          </div>
        </div>
        {creator.socialLinks && creator.socialLinks.length > 0 && (
          <div className="mt-4">
            <div className="font-medium mb-1 text-sm">Social Links</div>
            <ul className="list-disc list-inside space-y-1">
              {creator.socialLinks.map(link => (
                <li key={link.platform}>
                  <a 
                    className="text-primary underline" 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
