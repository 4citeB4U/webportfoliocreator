import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  ChevronDown,
  Component,
  Palette,
  Layout,
  Video,
  Settings,
  QrCode,
  ChevronRight,
  PlusCircle,
  BarChart,
} from "lucide-react";
import { useDrag } from 'react-dnd';

interface WebsiteData {
  id: string;
  name: string;
  url: string;
  analytics: {
    totalVisits: number;
    uniqueVisitors: number;
    avgTimeOnSite: string;
    bounceRate: string;
  };
}

interface WebsiteManagerProps {
  onEditModeChange: (isEditing: boolean) => void;
}

const mockWebsites: WebsiteData[] = [
  {
    id: "project-1",
    name: "Project 1",
    url: "https://project1.com",
    analytics: {
      totalVisits: 0,
      uniqueVisitors: 0,
      avgTimeOnSite: "0m 0s",
      bounceRate: "0%"
    }
  },
  {
    id: "project-2",
    name: "Project 2",
    url: "https://project2.com",
    analytics: {
      totalVisits: 0,
      uniqueVisitors: 0,
      avgTimeOnSite: "0m 0s",
      bounceRate: "0%"
    }
  },
  {
    id: "project-3",
    name: "Project 3",
    url: "https://project3.com",
    analytics: {
      totalVisits: 0,
      uniqueVisitors: 0,
      avgTimeOnSite: "0m 0s",
      bounceRate: "0%"
    }
  }
];

const DraggableMenuItem: FC<{ website: WebsiteData }> = ({ website }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WEBSITE',
    item: website,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <DropdownMenuItem className="hover:bg-secondary transition-colors">
        {website.name}
      </DropdownMenuItem>
    </div>
  );
};

const categories = [
  { id: "components", icon: Component, label: "Component Library", color: "text-blue-500" },
  { id: "themes", icon: Palette, label: "Theme Settings", color: "text-purple-500" },
  { id: "media", icon: Video, label: "Media Assets", color: "text-green-500" },
  { id: "layout", icon: Layout, label: "Page Layout", color: "text-orange-500" },
  { id: "qr", icon: QrCode, label: "QR Code Generator", color: "text-pink-500" },
];

export const WebsiteManager: FC<WebsiteManagerProps> = ({ onEditModeChange }) => {
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteData | null>(null);
  const [activeCategory, setActiveCategory] = useState("components");

  return (
    <div className="space-y-4">
      {/* Website Selector */}
      <div className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex-1 flex items-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Globe className="h-4 w-4" />
              Projects
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {mockWebsites.map((site) => (
              <DraggableMenuItem key={site.id} website={site} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="ml-2 hover:bg-secondary/80 transition-colors"
          onClick={() => {
            // Handle new project creation
          }}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Button */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 hover:bg-secondary/80 transition-colors"
        disabled={!selectedWebsite}
        onClick={() => {
          // Show statistics modal/drawer
        }}
      >
        <BarChart className={`h-4 w-4 ${selectedWebsite ? 'text-green-500' : 'text-gray-400'}`} />
        Statistics
      </Button>

      {/* Category Buttons */}
      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 hover:bg-secondary/80 transition-colors"
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon className={`h-4 w-4 ${category.color}`} />
            {category.label}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        ))}
      </div>

      {/* Settings Button - Fixed at bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-secondary/80 transition-colors"
          onClick={() => {
            // Handle settings
          }}
        >
          <Settings className="h-4 w-4 text-gray-400" />
          Settings
        </Button>
      </div>
    </div>
  );
};