import { FC } from 'react';
import { BarChart, Activity, Code, Database, Server } from 'lucide-react';

export const ModernDashboardPreview: FC = () => (
  <div className="w-full h-40 bg-slate-900 p-2 rounded-lg text-xs">
    {/* Top Stats */}
    <div className="grid grid-cols-4 gap-2 mb-2">
      {['Projects', 'Deployments', 'API Calls', 'Response'].map((stat, i) => (
        <div key={i} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div className="text-slate-400">{stat}</div>
            <div className="p-1 bg-blue-500/10 rounded">
              {i === 0 ? <Code className="w-3 h-3 text-blue-400" /> :
               i === 1 ? <Server className="w-3 h-3 text-purple-400" /> :
               i === 2 ? <Activity className="w-3 h-3 text-green-400" /> :
               <Database className="w-3 h-3 text-orange-400" />}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Chart Area */}
    <div className="h-20 bg-slate-800/50 rounded-lg border border-slate-700/50 p-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400">Performance</span>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded bg-slate-700/50 text-white">Day</span>
          <span className="px-2 py-0.5 text-slate-400">Week</span>
        </div>
      </div>
      <BarChart className="w-full h-10 text-slate-600" />
    </div>
  </div>
);
