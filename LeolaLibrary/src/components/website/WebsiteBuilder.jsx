import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { 
  DraggableComponent, 
  DroppableZone,
  type DraggableItemProps 
} from "@/components/dnd/DraggableComponent";

interface Website {
  id: string;
  name: string;
  components: DraggableItemProps[];
}

interface WebsiteBuilderProps {
  projectId?: string;
}

export const WebsiteBuilder: FC<WebsiteBuilderProps> = ({ projectId }) => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeWebsite, setActiveWebsite] = useState<Website | null>(null);

  // Load existing website if projectId is provided
  useEffect(() => {
    if (projectId) {
      // For Pro Driver Academy, we'll load it as an existing website
      const pdaWebsite: Website = {
        id: projectId,
        name: "Pro Driver Academy",
        components: [] // This would be loaded from your actual components
      };
      setWebsites(prev => [...prev, pdaWebsite]);
      setActiveWebsite(pdaWebsite);
    }
  }, [projectId]);

  const createNewWebsite = () => {
    const newWebsite: Website = {
      id: `website-${Date.now()}`,
      name: `New Website ${websites.length + 1}`,
      components: []
    };
    setWebsites([...websites, newWebsite]);
    setActiveWebsite(newWebsite);
  };

  const deleteWebsite = (websiteId: string) => {
    // Don't allow deletion of Pro Driver Academy project
    if (websiteId === 'pda') {
      return;
    }
    setWebsites(websites.filter(w => w.id !== websiteId));
    if (activeWebsite?.id === websiteId) {
      setActiveWebsite(null);
    }
  };

  const handleDrop = (item: DraggableItemProps) => {
    if (!activeWebsite) return;

    const updatedWebsite = {
      ...activeWebsite,
      components: [...activeWebsite.components, { ...item, id: `${item.id}-${Date.now()}` }]
    };

    setActiveWebsite(updatedWebsite);
    setWebsites(websites.map(w => 
      w.id === activeWebsite.id ? updatedWebsite : w
    ));
  };

  const removeComponent = (componentId: string) => {
    if (!activeWebsite) return;

    const updatedWebsite = {
      ...activeWebsite,
      components: activeWebsite.components.filter(c => c.id !== componentId)
    };

    setActiveWebsite(updatedWebsite);
    setWebsites(websites.map(w => 
      w.id === activeWebsite.id ? updatedWebsite : w
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with website management buttons */}
      <div className="border-b border-gray-800 mb-4 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={createNewWebsite}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Website
          </Button>
        </div>
        {activeWebsite && activeWebsite.id !== 'pda' && (
          <Button
            variant="destructive"
            onClick={() => deleteWebsite(activeWebsite.id)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Website
          </Button>
        )}
      </div>

      {/* Website Content Area */}
      <div className="flex-1">
        {activeWebsite ? (
          <DroppableZone
            onDrop={handleDrop}
            className="min-h-[calc(100vh-12rem)] bg-white p-4 rounded-lg border border-gray-200"
          >
            {activeWebsite.components.map((component) => (
              <div
                key={component.id}
                className="relative mb-4"
                onDoubleClick={() => removeComponent(component.id)}
              >
                <DraggableComponent {...component} />
              </div>
            ))}
            {activeWebsite.id === 'pda' && (
              <iframe 
                src="/projects/pro-driver-academy"
                className="w-full min-h-[600px] border-0"
                title="Pro Driver Academy Preview"
              />
            )}
          </DroppableZone>
        ) : (
          <Card className="min-h-[calc(100vh-12rem)] flex items-center justify-center text-muted-foreground">
            Create a new website to get started
          </Card>
        )}
      </div>
    </div>
  );
};