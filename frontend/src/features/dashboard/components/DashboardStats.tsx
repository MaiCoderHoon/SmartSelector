import { motion } from 'framer-motion';
import { Trophy, Activity, Target, Layers } from 'lucide-react';
import type { AnalyticsData } from '../../upload/types/upload';

interface DashboardStatsProps {
  stats: AnalyticsData | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) return null;

  const cards = [
    { 
      label: 'Highest Score', 
      value: stats.highest_score, 
      icon: Trophy, 
      color: 'text-amber-600', 
      bg: 'bg-amber-100' 
    },
    { 
      label: 'Average Score', 
      value: stats.average_score.toFixed(1), 
      icon: Activity, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      label: 'Lowest Score', 
      value: stats.lowest_score, 
      icon: Target, 
      color: 'text-rose-600', 
      bg: 'bg-rose-100' 
    },
    { 
      label: 'Total Sections', 
      value: stats.total_sections, 
      icon: Layers, 
      color: 'text-violet-600', 
      bg: 'bg-violet-100' 
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <motion.h4 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + (0.1 * i), type: "spring" }}
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              {stat.value}
            </motion.h4>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
