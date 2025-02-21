import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type IconType = 
  | "navigation"   // For navigation-related icons 
  | "action"       // For action buttons
  | "status"       // For status indicators
  | "alert"        // For warnings and errors
  | "data"         // For data-related icons
  | "social"       // For social features
  | "development"  // For development tools
  | "system";      // For system functions

interface ColorPalette {
  base: string;      // The main color
  hover: string;     // Hover state color
  muted: string;     // Muted/disabled state
  accent: string;    // Accent/highlight color
}

// Map icon names to their semantic types
const iconTypeMap: Record<string, IconType> = {
  // Navigation icons
  Home: "navigation",
  Menu: "navigation",
  ArrowLeft: "navigation",
  ArrowRight: "navigation",

  // Action icons
  Plus: "action",
  Minus: "action",
  Edit: "action",
  Trash: "action",
  Save: "action",
  Send: "action",
  Wand: "action",

  // Development icons
  Code: "development",
  Terminal: "development",
  Git: "development",
  Database: "development",
  Layout: "development",
  FolderKanban: "development",
  Globe: "development",

  // System icons
  Settings: "system",
  User: "system",
  Lock: "system",
  LogIn: "system",
  LogOut: "system",

  // Status icons
  Check: "status",
  X: "status",
  AlertCircle: "alert",
  AlertTriangle: "alert",

  // Data icons
  BarChart: "data",
  PieChart: "data",
  LineChart: "data",
  Table: "data",

  // Social icons
  Share: "social",
  Message: "social",
  Mail: "social",
  Users: "social"
};

// Define base color palettes for each type
const colorPalettes: Record<IconType, ColorPalette> = {
  navigation: {
    base: "text-cyan-400",
    hover: "text-cyan-300",
    muted: "text-cyan-600",
    accent: "text-cyan-200"
  },
  action: {
    base: "text-emerald-400",
    hover: "text-emerald-300",
    muted: "text-emerald-600",
    accent: "text-emerald-200"
  },
  status: {
    base: "text-blue-400",
    hover: "text-blue-300",
    muted: "text-blue-600",
    accent: "text-blue-200"
  },
  alert: {
    base: "text-rose-400",
    hover: "text-rose-300",
    muted: "text-rose-600",
    accent: "text-rose-200"
  },
  data: {
    base: "text-violet-400",
    hover: "text-violet-300",
    muted: "text-violet-600",
    accent: "text-violet-200"
  },
  social: {
    base: "text-pink-400",
    hover: "text-pink-300",
    muted: "text-pink-600",
    accent: "text-pink-200"
  },
  development: {
    base: "text-amber-400",
    hover: "text-amber-300",
    muted: "text-amber-600",
    accent: "text-amber-200"
  },
  system: {
    base: "text-indigo-400",
    hover: "text-indigo-300",
    muted: "text-indigo-600",
    accent: "text-indigo-200"
  }
};

export function getIconColor(
  iconName: string,
  state: keyof ColorPalette = "base"
): string {
  const type = iconTypeMap[iconName] || "system";
  return colorPalettes[type][state];
}

export function withContextualColor(
  Icon: LucideIcon,
  state: keyof ColorPalette = "base"
): React.FC<Omit<LucideProps, "ref">> {
  const StyledIcon: React.FC<Omit<LucideProps, "ref">> = (props) => {
    const colorClass = getIconColor(Icon.displayName || "", state);
    return React.createElement(Icon, {
      ...props,
      className: cn(colorClass, props.className)
    });
  };
  StyledIcon.displayName = `Contextual${Icon.displayName || "Icon"}`;
  return StyledIcon;
}