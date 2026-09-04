'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/features/authSlice';
import { 
  Terminal, 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  LogOut, 
  Package
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/dashboard/products', icon: Package },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Add Gadget', href: '/dashboard/products/new', icon: PlusCircle },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-slate-300 font-inter flex relative selection:bg-indigo-500/30">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-[20%] w-1/2 h-1/2 bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <div className="w-[280px] shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col z-10 relative">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors">
            <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/30 text-indigo-400">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="font-outfit font-bold tracking-wide">Owner Console</h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">System Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-3 mt-4">Main Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col z-10 relative">
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
