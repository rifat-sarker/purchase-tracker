'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  PackageSearch, 
  Activity, 
  ArrowUpRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockProducts = [
  {
    id: '1', name: 'MacBook Pro 16"', category: 'LAPTOP', brand: 'Apple', price: 3499,
    status: 'ACTIVE', purchaseDate: '2023-11-01', warrantyExpiry: '2026-11-01'
  },
  {
    id: '2', name: 'iPhone 15 Pro Max', category: 'PHONE', brand: 'Apple', price: 1199,
    status: 'ACTIVE', purchaseDate: '2023-09-22', warrantyExpiry: '2024-09-22'
  },
  {
    id: '3', name: 'Keychron K3 Pro', category: 'KEYBOARD', brand: 'Keychron', price: 119,
    status: 'ACTIVE', purchaseDate: '2024-01-15', warrantyExpiry: '2025-01-15'
  },
  {
    id: '4', name: 'Sony WH-1000XM5', category: 'HEADPHONE', brand: 'Sony', price: 398,
    status: 'ACTIVE', purchaseDate: '2022-06-10', warrantyExpiry: '2023-06-10'
  },
];

export default function DashboardOverview() {
  const [products] = useState(mockProducts);
  
  const totalSpend = products.reduce((sum, p) => sum + p.price, 0);
  const activeItems = products.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-white">System Overview</h1>
          <p className="text-slate-400 mt-1">High-level telemetry of your gadget inventory.</p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <ArrowUpRight size={16} /> Log New Gadget
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Investment</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">${totalSpend.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <PackageSearch size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tracked Items</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">{products.length}</h3>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Devices</p>
            <h3 className="text-2xl font-outfit font-bold text-white mt-1">{activeItems}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-5 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center shrink-0">
          <h2 className="font-outfit font-bold text-lg text-white">Recent Logs</h2>
        </div>
        
        <div className="flex-1 overflow-auto custom-scrollbar p-0">
          <Table>
            <TableHeader className="bg-slate-950/50 border-b border-slate-800">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-10">Asset</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-10">Category</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-10">Purchase Date</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-10">Value</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-10">Status</TableHead>
                <TableHead className="text-right h-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="font-medium text-slate-200">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.brand}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm font-mono">{product.purchaseDate}</TableCell>
                  <TableCell className="text-slate-300 font-medium font-mono">${product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                      {product.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors outline-none">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 shadow-xl">
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2">
                          <Eye size={14} /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2">
                          <Edit2 size={14} /> Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-rose-500/20 focus:text-rose-400 text-rose-400 cursor-pointer gap-2">
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
