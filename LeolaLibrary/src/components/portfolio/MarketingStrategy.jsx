import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { Volume2, VolumeX } from "lucide-react";
import { BarChartComponent, PieChartComponent } from "../charts/DashboardCharts";

const overviewScript = `Pro Driver Academy's marketing strategy focuses on reaching and serving underserved populations in Southeastern Wisconsin while building strong partnerships with community organizations and industry stakeholders.`;

const budgetData = {
  title: "Marketing Budget Allocation",
  data: [
    { name: "Digital Marketing", value: 35 },
    { name: "Community Outreach", value: 30 },
    { name: "Industry Partnerships", value: 20 },
    { name: "Print Materials", value: 15 }
  ],
  explanation: "Our marketing budget is strategically allocated across digital marketing (35%), community outreach (30%), industry partnerships (20%), and print materials (15%)."
};

const audienceData = {
  title: "Target Audience Distribution",
  data: [
    { name: "Career Changers", value: 35 },
    { name: "Veterans", value: 25 },
    { name: "Recent Graduates", value: 20 },
    { name: "Unemployed", value: 20 }
  ],
  explanation: "Our target audience includes career changers (35%), veterans (25%), recent graduates (20%), and unemployed individuals (20%)."
};

export default function MarketingStrategy() {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Marketing Strategy</h1>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => isSpeaking ? stop() : speak(overviewScript)}
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <PieChartComponent chartData={budgetData} />
        <PieChartComponent chartData={audienceData} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Digital Marketing Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Platforms:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Professional website with online application</li>
                  <li>Social media presence (Facebook, LinkedIn)</li>
                  <li>Email marketing campaigns</li>
                  <li>Search engine optimization</li>
                  <li>Content marketing and blog</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Partnerships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Partners:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Wisconsin Community Services (WCS)</li>
                  <li>Milwaukee Area Workforce Investment Board</li>
                  <li>UMOS</li>
                  <li>Local churches and community centers</li>
                  <li>Wisconsin Department of Corrections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Phases:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Phase 1: Foundation (Months 1-3)
                    <ul className="list-disc pl-4 mt-2">
                      <li>Website development</li>
                      <li>Social media setup</li>
                      <li>Initial partnerships</li>
                    </ul>
                  </li>
                  <li>Phase 2: Launch (Months 4-6)</li>
                  <li>Phase 3: Growth (Months 7-9)</li>
                  <li>Phase 4: Optimization (Months 10-12)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">5K+</p>
                  <p className="text-sm text-muted-foreground">Monthly Website Visitors</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">25%</p>
                  <p className="text-sm text-muted-foreground">Lead Conversion Rate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">10+</p>
                  <p className="text-sm text-muted-foreground">Active Partnerships</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-sm text-muted-foreground">Student Satisfaction</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
