import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../../shared/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { UploadCard } from '../upload/components/UploadCard';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardCharts';
import { RankingTable } from './components/RankingTable';
import type { UploadResponse } from '../upload/types/upload';

export default function Dashboard() {
  const { error, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  });

  const [dashboardData, setDashboardData] = useState<UploadResponse | null>(null);

  const handleUploadSuccess = (data: UploadResponse) => {
    setDashboardData(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
              S
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">SmartSchedule</span>
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
      <main className="flex-1 container mx-auto px-4 md:px-8 py-10 max-w-7xl space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Optimize Your Academic Sections with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span>
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
          className="mx-auto w-full max-w-4xl"
        >
          <UploadCard onUploadSuccess={handleUploadSuccess} />
        </motion.section>

        <AnimatePresence mode="wait">
          {dashboardData && (
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="space-y-12 pb-12"
            >
              {/* Stats Section */}
              <DashboardStats stats={dashboardData.statistics} />

              {/* Charts Section */}
              <DashboardCharts data={dashboardData} />

              {/* Ranking Table Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RankingTable rankings={dashboardData.rankings} />
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
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
