import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import type { UploadResponse } from '../../upload/types/upload';

interface DashboardChartsProps {
  data: UploadResponse;
}

const COLORS = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  white: '#cbd5e1'
};

export function DashboardCharts({ data }: DashboardChartsProps) {
  const { statistics, topSections, rankings } = data;

  // 1. Top 5 Sections Data
  const top5Data = topSections.map(s => ({
    name: s.section,
    score: s.score
  }));

  // 2. Color Distribution Data
  const colorData = [
    { name: 'Green', value: statistics.green_percentage, color: COLORS.green },
    { name: 'Yellow', value: statistics.yellow_percentage, color: COLORS.yellow },
    { name: 'White', value: statistics.white_percentage, color: COLORS.white },
    { name: 'Red', value: statistics.red_percentage, color: COLORS.red },
  ].filter(d => d.value > 0);

  // 3. Faculty Frequency Data
  const facultyCounts: Record<string, number> = {};
  rankings.forEach(r => {
    r.subjects.forEach(sub => {
      if (sub.faculty) {
        facultyCounts[sub.faculty] = (facultyCounts[sub.faculty] || 0) + 1;
      }
    });
  });
  const facultyData = Object.entries(facultyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 faculty

  // 4. Score Distribution Data
  const scoreCounts: Record<number, number> = {};
  rankings.forEach(r => {
    scoreCounts[r.score] = (scoreCounts[r.score] || 0) + 1;
  });
  const scoreData = Object.entries(scoreCounts)
    .map(([score, count]) => ({ score: Number(score), count }))
    .sort((a, b) => a.score - b.score);

  const ChartCard = ({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="flex-1 min-h-[280px]">
        {children}
      </div>
    </motion.div>
  );

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Top 5 Sections by Score" delay={0.2}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top5Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Color Distribution" delay={0.3}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={colorData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {colorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Score Distribution" delay={0.4}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="score" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              formatter={(value: number) => [value, 'Count']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Faculty Mentions" delay={0.5}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={facultyData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={100} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}
