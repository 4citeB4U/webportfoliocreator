import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { Volume2, VolumeX } from "lucide-react";
import { BarChartComponent, LineChartComponent, PieChartComponent } from "../charts/DashboardCharts";

const overviewScript = `Pro Driver Academy's business plan focuses on providing comprehensive CDL training while maintaining financial sustainability through diverse revenue streams and strategic partnerships.`;

const financialData = {
  title: "Financial Projections",
  data: [
    { name: "Year 1", value: 150000 },
    { name: "Year 2", value: 300000 },
    { name: "Year 3", value: 450000 }
  ],
  explanation: "Our financial projections show steady growth from $150,000 in year one to $450,000 by year three."
};

const studentData = {
  title: "Student Enrollment",
  data: [
    { name: "Q1 2024", value: 5 },
    { name: "Q2 2024", value: 10 },
    { name: "Q3 2024", value: 15 },
    { name: "Q4 2024", value: 20 }
  ],
  explanation: "Student enrollment is projected to grow from 5 students in Q1 to 20 students by Q4 2024."
};

const revenueData = {
  title: "Revenue Sources",
  data: [
    { name: "Program Fees", value: 50 },
    { name: "Grants", value: 25 },
    { name: "Corporate Partnerships", value: 15 },
    { name: "Donations", value: 10 }
  ],
  explanation: "Revenue is diversified across program fees (50%), grants (25%), corporate partnerships (15%), and donations (10%)."
};

export default function BusinessPlan() {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Business Plan</h1>
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
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Pro Driver Academy is a nonprofit organization dedicated to providing comprehensive CDL training while addressing the critical driver shortage in Wisconsin.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Key Components:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>12-week comprehensive training program</li>
                  <li>Focus on safety and compliance</li>
                  <li>Job placement assistance</li>
                  <li>Industry partnerships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Training Phases:</h3>
                <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                  <li>Phase 1: Foundational Skills (1 week)</li>
                  <li>Phase 2: CDL Permit Preparation (2 weeks)</li>
                  <li>Phase 3: Behind-the-Wheel Training (6 weeks)</li>
                  <li>Phase 4: Advanced Skills (3 weeks)</li>
                  <li>Phase 5: Job Placement (Ongoing)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <LineChartComponent chartData={financialData} />
        <LineChartComponent chartData={studentData} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <PieChartComponent chartData={revenueData} />
        
        <Card>
          <CardHeader>
            <CardTitle>Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-sm text-muted-foreground">Job Placement Rate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">$65K</p>
                  <p className="text-sm text-muted-foreground">Average Starting Salary</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">60+</p>
                  <p className="text-sm text-muted-foreground">Students by Year 3</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">DOT Compliance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
