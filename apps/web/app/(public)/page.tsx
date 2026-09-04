'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Terminal, HardDrive, Calendar, Tag, Activity } from 'lucide-react';

// Temporary mock data until backend is ready
const mockProducts = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    category: 'LAPTOP',
    brand: 'Apple',
    model: 'M3 Max',
    referenceImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    tags: ['work', 'daily-driver'],
    status: 'ACTIVE',
    ownedSinceYear: 2023,
    description: 'My primary work machine. Unbelievable performance and battery life.',
    specs: { 'RAM': '64GB', 'Storage': '2TB SSD' }
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    category: 'PHONE',
    brand: 'Apple',
    model: 'Titanium 512GB',
    referenceImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    tags: ['personal', 'mobile'],
    status: 'ACTIVE',
    ownedSinceYear: 2023,
    description: 'Great cameras, type-c is finally here.',
    specs: { 'Color': 'Natural Titanium', 'Storage': '512GB' }
  },
  {
    id: '3',
    name: 'Keychron K3 Pro',
    category: 'KEYBOARD',
    brand: 'Keychron',
    model: 'K3 Pro',
    referenceImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    tags: ['mechanical', 'wireless'],
    status: 'ACTIVE',
    ownedSinceYear: 2024,
    description: 'Low profile mechanical keyboard. Very comfortable for long typing sessions.',
    specs: { 'Switches': 'Gateron Brown', 'Profile': 'Low' }
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    category: 'HEADPHONE',
    brand: 'Sony',
    model: 'WH-1000XM5',
    referenceImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    tags: ['audio', 'noise-cancelling'],
    status: 'ACTIVE',
    ownedSinceYear: 2022,
    description: 'Incredible ANC for flights and focus work.',
    specs: { 'Battery': '30 Hours', 'Type': 'Over-ear' }
  },
  {
    id: '5',
    name: 'LG UltraFine 5K',
    category: 'MONITOR',
    brand: 'LG',
    model: '27MD5KL-B',
    referenceImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    tags: ['display', 'work'],
    status: 'ACTIVE',
    ownedSinceYear: 2021,
    description: 'Perfect companion for macOS.',
    specs: { 'Resolution': '5120x2880', 'Size': '27"' }
  },
];

export default function HackerDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);

  return (
    // STRICT 100vh CONTAINER, NO OUTER SCROLLING
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-slate-300 font-inter p-2 md:p-4 flex flex-col md:flex-row gap-4 relative selection:bg-indigo-500/30">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* LEFT PANEL: Header & Navigation (Width: 25%) */}
      <div className="w-full md:w-[300px] xl:w-[350px] flex flex-col gap-4 h-full shrink-0 z-10">
        {/* Brand Block */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shrink-0">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <Terminal size={24} />
            <span className="font-mono text-sm tracking-widest font-bold">SYS.INIT</span>
          </div>
          <h1 className="font-outfit text-3xl font-bold text-white leading-tight">
            Gadget Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-wider">
            All systems nominal
          </p>
        </div>

        {/* Stats / System Info Block */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
            Inventory Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <div className="text-2xl font-outfit font-bold text-indigo-400">12</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total Devices</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <div className="text-2xl font-outfit font-bold text-emerald-400">$8.4k</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total Value</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h3>
            <div className="space-y-2">
              {['Laptops', 'Phones', 'Keyboards', 'Monitors', 'Audio'].map(cat => (
                <div key={cat} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-700/50">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">2</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Main Grid (Width: Flexible/Auto) */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden z-10">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            Active Devices
          </h2>
          <span className="text-xs font-mono text-slate-500">SORT: RECENCY</span>
        </div>
        
        {/* INNER SCROLLING CONTAINER FOR GRID */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
            {mockProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 bg-slate-950/50 ${
                  selectedProduct?.id === product.id 
                    ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                <div className="relative h-40 w-full bg-black/50 overflow-hidden">
                  {product.referenceImage && (
                    <Image
                      src={product.referenceImage}
                      alt={product.name}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 mix-blend-luminosity group-hover:mix-blend-normal"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-900/40 backdrop-blur-md px-2 py-1 rounded border border-indigo-500/30">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-outfit text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium truncate">
                    {product.brand} {product.model}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Details (Width: 25%) */}
      <div className="w-full md:w-[350px] xl:w-[400px] h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl flex flex-col shrink-0 z-10 overflow-hidden">
        {selectedProduct ? (
          <div className="flex flex-col h-full">
            <div className="relative h-48 w-full shrink-0 bg-black">
              {selectedProduct.referenceImage && (
                <Image
                  src={selectedProduct.referenceImage}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1 block">
                  {selectedProduct.category}
                </span>
                <h2 className="font-outfit text-2xl font-bold text-white leading-tight">
                  {selectedProduct.name}
                </h2>
              </div>
            </div>

            {/* INNER SCROLLING CONTAINER FOR DETAILS */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              <p className="text-sm text-slate-400 border-l-2 border-slate-700 pl-3">
                {selectedProduct.description || "No description available."}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Owned</span>
                  </div>
                  <div className="text-sm font-medium text-slate-200">Since {selectedProduct.ownedSinceYear}</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Tag size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Status</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    {selectedProduct.status}
                  </div>
                </div>
              </div>

              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <HardDrive size={14} /> Hardware Specs
                  </h3>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-lg divide-y divide-slate-800/50">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center p-3">
                        <span className="text-xs text-slate-500">{key}</span>
                        <span className="text-sm font-mono text-slate-300">{val as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 flex flex-wrap gap-2">
                {selectedProduct.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-700/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 h-full">
            <Terminal size={48} className="mb-4 text-slate-700" />
            <p className="text-sm font-mono">AWAITING_SELECTION</p>
            <p className="text-xs mt-2 text-slate-600">Select an item from the main grid to view detailed telemetry.</p>
          </div>
        )}
      </div>

    </div>
  );
}
