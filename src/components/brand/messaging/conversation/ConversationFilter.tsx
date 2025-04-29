
import { useState } from "react";
import { Search, Filter, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: "all" | "unread" | "archived";
  onFilterChange: (filter: "all" | "unread" | "archived") => void;
}

export function ConversationFilter({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: ConversationFilterProps) {
  return (
    <div className="p-2 space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search conversations..."
          className="pl-8 bg-black/50 border-white/10 text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => onFilterChange("all")}
            className={filter === "all" ? "bg-yellow-600 text-white" : "text-white/70"}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === "unread" ? "default" : "ghost"}
            onClick={() => onFilterChange("unread")}
            className={filter === "unread" ? "bg-yellow-600 text-white" : "text-white/70"}
          >
            Unread
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-white/70">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 text-white border-white/20">
            <DropdownMenuItem onClick={() => onFilterChange("all")}>
              <Check className={`h-4 w-4 mr-2 ${filter === "all" ? "opacity-100" : "opacity-0"}`} />
              All Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("unread")}>
              <Check className={`h-4 w-4 mr-2 ${filter === "unread" ? "opacity-100" : "opacity-0"}`} />
              Unread
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("archived")}>
              <Check className={`h-4 w-4 mr-2 ${filter === "archived" ? "opacity-100" : "opacity-0"}`} />
              Archived
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
