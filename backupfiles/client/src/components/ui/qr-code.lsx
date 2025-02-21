import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface QRCodeProps {
  url: string;
  size?: number;
  includeMargin?: boolean;
  className?: string;
  level?: "L" | "M" | "Q" | "H";
}

export function QRCode({
  url,
  size = 256,
  includeMargin = true,
  className,
  level = "M",
}: QRCodeProps) {
  const logoUrl = "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text x="50" y="50" text-anchor="middle" dy=".3em" 
        fill="currentColor" font-family="Arial" font-weight="bold" font-size="40">
        PDA
      </text>
    </svg>
  `);

  return (
    <Card className={cn("inline-block", className)}>
      <CardContent className="flex items-center justify-center p-4">
        <QRCodeSVG
          value={url}
          size={size}
          level={level}
          includeMargin={includeMargin}
          imageSettings={{
            src: logoUrl,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
          }}
        />
      </CardContent>
    </Card>
  );
}