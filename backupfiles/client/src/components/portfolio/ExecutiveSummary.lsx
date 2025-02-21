import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { Volume2, VolumeX } from "lucide-react";

const script = `Pro Driver Academy (PDA) is a Wisconsin-based nonprofit organization dedicated to addressing the critical shortage of qualified Class A Commercial Driver's License (CDL) holders in Southeastern Wisconsin and the Milwaukee metropolitan area. Our comprehensive training program exceeds all WisDOT and FMCSA requirements while maintaining accessibility for underserved populations.`;

export default function ExecutiveSummary() {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Executive Summary</h1>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => isSpeaking ? stop() : speak(script)}
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To transform aspiring drivers into highly skilled, safety-conscious professionals while providing economic opportunities for underserved populations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be Wisconsin's premier nonprofit training provider for the logistics and mobility sector, recognized for excellence in CDL training, safety, regulatory compliance, and community impact.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
              <li>Safety: Uncompromising commitment to safety standards</li>
              <li>Professionalism: Developing highly skilled drivers</li>
              <li>Accessibility: Making training attainable for diverse populations</li>
              <li>Integrity: Operating with transparency and honesty</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Re-use the existing ExecutiveDashboard component for charts */}
    </div>
  );
}
