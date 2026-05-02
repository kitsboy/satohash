import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'; // Assume recharts installed or mock
import { AlertCircle, Activity, Database, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminThrottle() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // For expandable sections

  useEffect(() => {
    fetchMetrics();

    // Poll every 30s
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async (type = 'public') => {
    try {
      const response = await fetch(`${API_URL}/admin/throttle-metrics?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      toast.error('Failed to load throttling metrics');
    } finally {
      setLoading(false);
    }
  };

  const simulateLoad = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/throttle/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminKey') || 'admin123'}` },
        body: JSON.stringify({ iterations: 500, type: 'public' })
      });
      if (response.ok) {
        toast.success('Load simulation started!');
        setTimeout(fetchMetrics, 5000); // Refresh after sim
      } else {
        toast.error('Simulation failed');
      }
    } catch (err) {
      toast.error('Simulation error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return <div>Error loading metrics</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900">Throttling Dashboard</h1>
          </div>
          <button
            onClick={simulateLoad}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <TrendingUp className="h-4 w-4" />
            Simulate Load
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Total Hits</h3>
            <p className="text-2xl font-bold text-indigo-600">{metrics.metrics.hits}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Blocks</h3>
            <p className="text-2xl font-bold text-red-600">{metrics.metrics.blocks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Avg Hits/Hour</h3>
            <p className="text-2xl font-bold text-green-600">{metrics.avgHitsPerHour?.toFixed(0)}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Hits per hour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Hourly Hits
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.timeSeries.slice(0, 24)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="0" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="1" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line Chart: Peak Trends */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Peak Load Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.timeSeries.slice(0, 24).map(([ts, hit], i) => ({ ts: new Date(parseInt(ts)).toLocaleTimeString(), hit }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hit" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Expandable Analytics */}
        <div className="space-y-4">
          {['Redis Health', 'User Tiers', 'Error Logs'].map((section) => (
            <motion.button
              key={section}
              onClick={() => setExpanded(prev => ({ ...prev, [section]: !prev[section] }))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-5 w-5 ${expanded[section] ? 'text-green-500' : 'text-slate-400'}`} />
                <span className="font-medium text-slate-900">{section}</span>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform ${expanded[section] ? 'rotate-90' : ''}`} />
            </motion.button>
          ))}
        </div>

        {/* Note: For full viz, install recharts: npm i recharts */}
      </div>
    </div>
  );
}