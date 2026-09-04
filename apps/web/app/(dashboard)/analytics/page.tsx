'use client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { DollarSign, PieChart, TrendingUp } from 'lucide-react';

const categoryData = [
  { name: 'LAPTOP', value: 3499 },
  { name: 'PHONE', value: 1199 },
  { name: 'KEYBOARD', value: 119 },
  { name: 'HEADPHONE', value: 398 },
];

const monthlyData = [
  { month: 'Jan', spend: 119 },
  { month: 'Feb', spend: 0 },
  { month: 'Mar', spend: 0 },
  { month: 'Apr', spend: 0 },
  { month: 'May', spend: 0 },
  { month: 'Jun', spend: 398 },
  { month: 'Jul', spend: 0 },
  { month: 'Aug', spend: 0 },
  { month: 'Sep', spend: 1199 },
  { month: 'Oct', spend: 0 },
  { month: 'Nov', spend: 3499 },
  { month: 'Dec', spend: 0 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-outfit font-bold text-white">Telemetry Analytics</h1>
        <p className="text-slate-400 mt-1">Financial breakdown of your hardware assets.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Spend</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">$5,215</h3>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <PieChart size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Avg Item Value</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">$1,303</h3>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Upcoming Renewals</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">1 <span className="text-sm font-medium text-slate-500">(next 30d)</span></h3>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden min-h-[400px]">
        {/* Category Spend */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col p-6 h-full">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2">
            Value by Category
          </h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `$${value}`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, 'Spend']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend over Time */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col p-6 h-full">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2">
            Investment Timeline
          </h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tickFormatter={(value) => `$${value}`} width={50} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, 'Spend']}
                />
                <Line type="monotone" dataKey="spend" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
