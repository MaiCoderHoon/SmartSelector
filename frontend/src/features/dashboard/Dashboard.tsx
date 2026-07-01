import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../../shared/services/api';
import { motion } from 'framer-motion';
import { BarChart3, Users, Star, CheckCircle2, XCircle } from 'lucide-react';
import { UploadCard } from '../upload/components/UploadCard';

export default function Dashboard() {
  const { error, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">SmartSchedule</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <span className="text-sm text-slate-500 animate-pulse">Connecting to backend...</span>
            ) : error ? (
              <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600 border border-red-200">
                <XCircle className="h-4 w-4" />
                <span>Backend Error</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Backend Connected</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-8 py-10 max-w-6xl space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Optimize Your Academic Sections with <span className="text-blue-600">AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            Upload your timetable and let our intelligent engine rank and recommend the best sections based on faculty quality.
          </motion.p>
        </section>

        {/* Upload Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-full"
        >
          <UploadCard />
        </motion.section>

        {/* Stats Placeholder */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Sections Analyzed', value: '1,284', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Faculty Rated', value: '432', icon: Users, color: 'text-violet-600', bg: 'bg-violet-100' },
            { label: 'Top Recommendations', value: '12', icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h4 className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</h4>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Charts & Ranking Placeholders */}
        <section className="grid gap-6 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Top Sections Distribution</h3>
            </div>
            <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-400">Chart Placeholder</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Ranking</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-sm text-slate-400">Ranking Table Placeholder</p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SmartSchedule. Built for academic excellence.
        </div>
      </footer>
    </div>
  );
}
