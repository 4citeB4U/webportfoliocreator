import { FC, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Box, ChevronDown, BarChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DraggableItemProps {
  id: string;
  name: string;
  type: string;
  category: string;
  statistics?: {
    visitors?: number;
    pageViews?: number;
    bounceRate?: number;
    avgTime?: string;
  };
}

export const DraggableComponent: FC<DraggableItemProps> = ({ id, name, type, category, statistics }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type === 'project' ? 'PROJECT' : 'COMPONENT',
    item: { id, name, type, category, statistics },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="space-y-2">
      <DropdownMenu>
        <div
          ref={drag}
          className={`flex items-center justify-between p-2 border rounded-lg cursor-move transition-all ${
            isDragging ? 'opacity-50 scale-95' : 'opacity-100'
          }`}
        >
          <span className="flex items-center gap-2">
            {type === 'project' ? (
              <BarChart className="h-4 w-4" />
            ) : (
              <Box className="h-4 w-4" />
            )}
            {name}
          </span>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-4 space-y-4">
            <h4 className="font-medium">{name}</h4>
            {statistics && (
              <div className="grid grid-cols-2 gap-4">
                {statistics.visitors && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{statistics.visitors.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Monthly Visitors</p>
                  </div>
                )}
                {statistics.pageViews && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{statistics.pageViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                  </div>
                )}
                {statistics.bounceRate && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{statistics.bounceRate}%</p>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  </div>
                )}
                {statistics.avgTime && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{statistics.avgTime}</p>
                    <p className="text-sm text-muted-foreground">Avg. Time on Site</p>
                  </div>
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Type: {type}</p>
              <p>Category: {category}</p>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const DroppableZone: FC<{
  onDrop: (item: DraggableItemProps) => void;
  children?: React.ReactNode;
  className?: string;
}> = ({ onDrop, children, className }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'PROJECT'],
    drop: (item: DraggableItemProps) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${className} ${
        isOver ? 'border-2 border-primary border-dashed' : 'border border-border'
      } rounded-lg transition-all`}
    >
      {children}
    </div>
  );
};

export const ComponentPreview: FC<{ item: DraggableItemProps | null }> = ({ item }) => {
  if (!item) return null;

  return (
    <div className="p-4 border rounded-lg bg-background">
      <h3 className="font-semibold mb-2">{item.name}</h3>
      {item.statistics && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {item.statistics.visitors && (
            <div>
              <p className="text-2xl font-bold text-primary">{item.statistics.visitors.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Monthly Visitors</p>
            </div>
          )}
          {item.statistics.pageViews && (
            <div>
              <p className="text-2xl font-bold text-primary">{item.statistics.pageViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Page Views</p>
            </div>
          )}
        </div>
      )}
      <div className="text-sm text-muted-foreground">
        <p>Type: {item.type}</p>
        <p>Category: {item.category}</p>
      </div>
    </div>
  );
};