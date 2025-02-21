import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { Volume2, VolumeX } from "lucide-react";
import { BarChartComponent, PieChartComponent } from "../charts/DashboardCharts";

const overviewScript = `Pro Driver Academy maintains a lean, efficient organizational structure that emphasizes accountability, professionalism, and mission focus.`;

const staffingData = {
  title: "Staff Growth Projections",
  data: [
    { name: "2024", value: 5 },
    { name: "2025", value: 7 },
    { name: "2026", value: 10 }
  ],
  explanation: "Our staffing plan shows growth from 5 team members in 2024 to 10 by 2026."
};

const salaryData = {
  title: "Salary Budget Distribution",
  data: [
    { name: "Executive Director", value: 75000 },
    { name: "Lead Instructor", value: 65000 },
    { name: "Operations Manager", value: 55000 },
    { name: "Marketing Coordinator", value: 45000 },
    { name: "Administrative Staff", value: 35000 }
  ],
  explanation: "Our salary budget is allocated based on role responsibilities and industry standards."
};

export default function TeamStructure() {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Team Structure</h1>
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

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Executive Director</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Responsibilities:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Strategic leadership</li>
                  <li>Financial management</li>
                  <li>Partnership development</li>
                  <li>Grant writing/management</li>
                  <li>Community relations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Director of Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Responsibilities:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Curriculum development</li>
                  <li>Instructor supervision</li>
                  <li>Training quality assurance</li>
                  <li>Safety program management</li>
                  <li>Student assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Responsibilities:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Daily operations management</li>
                  <li>Student services</li>
                  <li>Facility management</li>
                  <li>Schedule coordination</li>
                  <li>Administrative oversight</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <BarChartComponent chartData={staffingData} />
        <PieChartComponent chartData={salaryData} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Professional Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Programs:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Industry certifications</li>
                  <li>Professional memberships</li>
                  <li>Conference attendance</li>
                  <li>Skill development workshops</li>
                  <li>Leadership training</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advisory Committees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Structure:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Industry Advisory Committee
                    <ul className="list-disc pl-4 mt-2">
                      <li>Local trucking companies</li>
                      <li>Logistics providers</li>
                    </ul>
                  </li>
                  <li>Community Advisory Committee
                    <ul className="list-disc pl-4 mt-2">
                      <li>Community leaders</li>
                      <li>Partner organizations</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
