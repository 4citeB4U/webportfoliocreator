import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpeech } from "@/hooks/use-speech";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

type ChartData = {
  title: string;
  data: any[];
  explanation: string;
}

export function BarChartComponent({ chartData, onChartClick }: { chartData: ChartData; onChartClick?: () => void }) {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <Card className="w-full" onClick={onChartClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{chartData.title}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            isSpeaking ? stop() : speak(chartData.explanation);
          }}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function LineChartComponent({ chartData, onChartClick }: { chartData: ChartData; onChartClick?: () => void }) {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <Card className="w-full" onClick={onChartClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{chartData.title}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            isSpeaking ? stop() : speak(chartData.explanation);
          }}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export function PieChartComponent({ chartData, onChartClick }: { chartData: ChartData; onChartClick?: () => void }) {
  const { speak, stop, isSpeaking } = useSpeech();

  return (
    <Card className="w-full" onClick={onChartClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{chartData.title}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            isSpeaking ? stop() : speak(chartData.explanation);
          }}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
