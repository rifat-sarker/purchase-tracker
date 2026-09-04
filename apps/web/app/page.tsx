'use client';

import { useMemo, useState } from 'react';

// ─── Domain types (mirrors the Prisma schema in the spec) ───

type Category =
  | 'PHONE' | 'LAPTOP' | 'DESKTOP' | 'MONITOR' | 'HUB' | 'CABLE'
  | 'PENDRIVE' | 'KEYBOARD' | 'MOUSE' | 'HEADPHONE' | 'CHARGER' | 'OTHER';

type Status = 'ACTIVE' | 'SOLD' | 'GIFTED' | 'BROKEN' | 'LOST';

type Screen = 'catalog' | 'detail' | 'login' | 'dashboard' | 'form' | 'analytics' | 'warranty';

interface Product {
  id: string;
  name: string;
  category: Category;
  brand?: string;
  model?: string;
  specs: Record<string, string>;
  price: number;
  currency: string;
  purchaseDate: string; // ISO date
  purchasedFrom?: string;
  warrantyExpiry?: string | null;
  serialNumber?: string | null;
  status: Status;
  tags: string[];
  notified: boolean;
  receipts: number;
  notes?: string;
  referenceImage?: string;
}

const CATEGORIES: Category[] = ['PHONE', 'LAPTOP', 'DESKTOP', 'MONITOR', 'HUB', 'CABLE', 'PENDRIVE', 'KEYBOARD', 'MOUSE', 'HEADPHONE', 'CHARGER', 'OTHER'];
const STATUSES: Status[] = ['ACTIVE', 'SOLD', 'GIFTED', 'BROKEN', 'LOST'];

const SEED: Product[] = [
  { id: 'ckq1', name: 'Samsung Galaxy S23', category: 'PHONE', brand: 'Samsung', model: 'SM-S911B', price: 89500, currency: 'BDT', purchaseDate: '2025-09-05', warrantyExpiry: '2026-09-05', purchasedFrom: 'Star Tech, Dhaka', serialNumber: '354812097654321', status: 'ACTIVE', tags: ['daily-driver', '5g'], notified: true, receipts: 2, notes: 'Traded in the S21 at the counter; official warranty card in the folder.', specs: { Storage: '256 GB', RAM: '8 GB', Display: '6.1" 120Hz', Color: 'Phantom Black' }, referenceImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq2', name: 'MacBook Air M2', category: 'LAPTOP', brand: 'Apple', model: 'A2681', price: 142000, currency: 'BDT', purchaseDate: '2025-11-02', warrantyExpiry: '2026-11-02', purchasedFrom: 'Apple Gadget Store, Bashundhara', serialNumber: 'C02H4KJ9Q6L4', status: 'ACTIVE', tags: ['work', 'primary'], notified: false, receipts: 3, notes: 'Midnight, 16GB/512GB config ordered in.', specs: { RAM: '16 GB', Storage: '512 GB SSD', Chip: 'Apple M2', Color: 'Midnight' }, referenceImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq3', name: 'Mac Mini M2', category: 'DESKTOP', brand: 'Apple', model: 'A2686', price: 78000, currency: 'BDT', purchaseDate: '2026-03-20', warrantyExpiry: '2027-03-20', purchasedFrom: 'Apple Gadget Store, Bashundhara', serialNumber: 'C07J2LMQ1P8T', status: 'ACTIVE', tags: ['home-server'], notified: false, receipts: 1, notes: 'Runs the local Postgres + Redis containers.', specs: { RAM: '8 GB', Storage: '256 GB SSD', Chip: 'Apple M2' }, referenceImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq4', name: 'LG 27UP850 Monitor', category: 'MONITOR', brand: 'LG', model: '27UP850-W', price: 62000, currency: 'BDT', purchaseDate: '2026-04-05', warrantyExpiry: '2029-04-05', purchasedFrom: 'Ryans Computers, Farmgate', serialNumber: '204NTQK8L212', status: 'ACTIVE', tags: ['4k', 'usb-c'], notified: false, receipts: 2, notes: '96W USB-C passthrough — one cable to the Air.', specs: { Size: '27"', Resolution: '3840 × 2160', Panel: 'IPS', Power: '96W USB-C' }, referenceImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq5', name: 'Anker 7-in-1 USB-C Hub', category: 'HUB', brand: 'Anker', model: 'A8346', price: 4200, currency: 'BDT', purchaseDate: '2026-05-11', warrantyExpiry: '2028-05-11', purchasedFrom: 'Gadget & Gear', serialNumber: 'AK7H29LX', status: 'ACTIVE', tags: ['travel'], notified: false, receipts: 1, notes: 'Bought with the cable below on the same memo.', specs: { Ports: '7', HDMI: '4K@30Hz', 'Card reader': 'SD + microSD' }, referenceImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq6', name: 'Anker USB-C to USB-C Cable', category: 'CABLE', brand: 'Anker', model: 'PowerLine III', price: 1150, currency: 'BDT', purchaseDate: '2026-05-11', warrantyExpiry: null, purchasedFrom: 'Gadget & Gear', serialNumber: null, status: 'BROKEN', tags: ['100w'], notified: false, receipts: 1, notes: 'Frayed at the connector after three months.', specs: { Length: '1.8 m', Rating: '100 W', Braid: 'Nylon' }, referenceImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq7', name: 'SanDisk Extreme 64GB Pendrive', category: 'PENDRIVE', brand: 'SanDisk', model: 'SDCZ880-064G', price: 1450, currency: 'BDT', purchaseDate: '2026-02-08', warrantyExpiry: '2031-02-08', purchasedFrom: 'Computer Source', serialNumber: null, status: 'LOST', tags: ['bootable'], notified: false, receipts: 1, notes: 'Held the Ubuntu installer. Last seen in a laptop bag.', specs: { Capacity: '64 GB', Read: '420 MB/s', Interface: 'USB 3.2' }, referenceImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq8', name: 'Logitech MX Keys', category: 'KEYBOARD', brand: 'Logitech', model: '920-009415', price: 12800, currency: 'BDT', purchaseDate: '2026-06-01', warrantyExpiry: '2027-06-01', purchasedFrom: 'Star Tech, Dhaka', serialNumber: '2213LZ0A4BC8', status: 'ACTIVE', tags: ['desk'], notified: false, receipts: 1, notes: 'Bought together with the MX Master 3S.', specs: { Layout: 'Full size', Backlight: 'Yes', Connectivity: 'Bolt + Bluetooth' }, referenceImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq9', name: 'Logitech MX Master 3S', category: 'MOUSE', brand: 'Logitech', model: '910-006559', price: 11500, currency: 'BDT', purchaseDate: '2025-09-10', warrantyExpiry: '2026-09-10', purchasedFrom: 'Star Tech, Dhaka', serialNumber: '2213MX3S0091', status: 'ACTIVE', tags: ['desk', 'quiet-click'], notified: true, receipts: 1, notes: 'Graphite. Silent switches.', specs: { DPI: '8000', Buttons: '7', Connectivity: 'Bolt + Bluetooth' }, referenceImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq10', name: 'Sony WH-1000XM4 Headphones', category: 'HEADPHONE', brand: 'Sony', model: 'WH-1000XM4', price: 28900, currency: 'BDT', purchaseDate: '2025-09-22', warrantyExpiry: '2026-09-22', purchasedFrom: 'Sony Center, Gulshan', serialNumber: '4901780291234', status: 'ACTIVE', tags: ['anc', 'commute'], notified: false, receipts: 2, notes: 'Earpads replaced once out of pocket.', specs: { ANC: 'Yes', Battery: '30 h', Codec: 'LDAC' }, referenceImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80' },
  { id: 'ckq11', name: 'Anker 20W USB-C Charger', category: 'CHARGER', brand: 'Anker', model: 'A2633', price: 1890, currency: 'BDT', purchaseDate: '2026-07-19', warrantyExpiry: '2027-07-19', purchasedFrom: 'Gadget & Gear', serialNumber: null, status: 'ACTIVE', tags: ['travel'], notified: false, receipts: 1, notes: 'Spare for the go-bag.', specs: { Output: '20 W', Ports: '1 × USB-C' }, referenceImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80' },
];

// ─── formatting helpers ───

function money(n: number, currency = 'BDT') {
  const symbol = currency === 'BDT' ? '৳' : currency + ' ';
  return symbol + Math.round(n).toLocaleString('en-US');
}
function mask() { return '••••••'; }
function fdate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysUntil(iso?: string | null) {
  if (!iso) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000);
}
function blankForm() {
  return { name: '', category: 'PHONE' as Category, status: 'ACTIVE' as Status, brand: '', model: '', tags: '', price: '', currency: 'BDT', purchaseDate: new Date().toISOString().slice(0, 10), warrantyExpiry: '', purchasedFrom: '', serialNumber: '', notes: '', referenceImage: '' };
}
type FormState = ReturnType<typeof blankForm>;
function formFor(p: Product): FormState {
  return { name: p.name, category: p.category, status: p.status, brand: p.brand || '', model: p.model || '', tags: p.tags.join(', '), price: String(p.price), currency: p.currency, purchaseDate: p.purchaseDate, warrantyExpiry: p.warrantyExpiry || '', purchasedFrom: p.purchasedFrom || '', serialNumber: p.serialNumber || '', notes: p.notes || '', referenceImage: p.referenceImage || '' };
}

// ─── small presentational bits ───

function PlaceholderBox({ label, className = '', style }: { label: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`ph grayscale-img flex items-center justify-center text-center border [border-color:var(--color-divider)] ${className}`}
      style={style}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider px-2" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{label}</span>
    </div>
  );
}

function StatCell({ label, value, sub, borderRight }: { label: string; value: React.ReactNode; sub?: string; borderRight?: boolean }) {
  return (
    <div className={`p-5 ${borderRight ? 'border-r-2' : ''} [border-color:var(--color-divider)]`}>
      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{label}</div>
      <div className="font-[var(--font-heading)] font-extrabold text-[38px] leading-tight mt-1.5">{value}</div>
      {sub && <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{sub}</div>}
    </div>
  );
}

// ─── the app ───

export default function GadgetTracker() {
  const [screen, setScreen] = useState<Screen>('catalog');
  const [owner, setOwner] = useState(false);
  const [products, setProducts] = useState<Product[]>(SEED);
  const [detailId, setDetailId] = useState('ckq2');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState<'purchaseDate' | 'price' | 'name'>('purchaseDate');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [loginEmail, setLoginEmail] = useState('rifat@example.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const go = (s: Screen) => setScreen(s);

  const openForm = (id: string | null) => {
    const p = id ? products.find((x) => x.id === id) : null;
    setEditingId(id);
    setForm(p ? formFor(p) : blankForm());
    setSpecRows(p ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
    go('form');
  };

  const setF = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const saveEntry = () => {
    if (!form.name.trim() || !form.purchaseDate || !(Number(form.price) > 0)) return;
    const specs: Record<string, string> = {};
    specRows.forEach((r) => { if (r.key.trim()) specs[r.key.trim()] = r.value; });
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (editingId) {
      setProducts((prev) => prev.map((p) => p.id === editingId ? {
        ...p, name: form.name, category: form.category, status: form.status, brand: form.brand || undefined,
        model: form.model || undefined, tags, price: Number(form.price), currency: form.currency || 'BDT',
        purchaseDate: form.purchaseDate, warrantyExpiry: form.warrantyExpiry || null,
        purchasedFrom: form.purchasedFrom || undefined, serialNumber: form.serialNumber || null,
        notes: form.notes || undefined, referenceImage: form.referenceImage || undefined, specs,
        notified: p.warrantyExpiry !== (form.warrantyExpiry || null) ? false : p.notified,
      } : p));
    } else {
      const id = 'p' + Math.random().toString(36).slice(2, 9);
      setProducts((prev) => [{
        id, name: form.name, category: form.category, status: form.status, brand: form.brand || undefined,
        model: form.model || undefined, tags, price: Number(form.price), currency: form.currency || 'BDT',
        purchaseDate: form.purchaseDate, warrantyExpiry: form.warrantyExpiry || null,
        purchasedFrom: form.purchasedFrom || undefined, serialNumber: form.serialNumber || null,
        notes: form.notes || undefined, referenceImage: form.referenceImage || undefined, specs,
        notified: false, receipts: 0,
      }, ...prev]);
    }
    go('dashboard');
  };

  const markSold = (id: string) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'SOLD' } : p));

  const exportCsv = () => {
    const header = ['name', 'category', 'brand', 'model', 'price', 'currency', 'purchaseDate', 'purchasedFrom', 'warrantyExpiry', 'serialNumber', 'status', 'notes'];
    const rows = products.map((p) => [p.name, p.category, p.brand || '', p.model || '', p.price, p.currency, p.purchaseDate, p.purchasedFrom || '', p.warrantyExpiry || '', p.serialNumber || '', p.status, (p.notes || '').replace(/\n/g, ' ')]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'gadget-purchases.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const doLogin = () => {
    if (loginEmail.trim() && loginPassword.trim()) { setOwner(true); setLoginError(''); go('dashboard'); }
    else setLoginError('Email and password are required.');
  };

  // ─── derived render values ───

  const total = useMemo(() => products.reduce((a, p) => a + p.price, 0), [products]);
  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const soonCount = useMemo(() => products.filter((p) => { const d = daysUntil(p.warrantyExpiry); return d !== null && d >= 0 && d <= 30; }).length, [products]);

  const filteredCatalog = useMemo(() => {
    let list = products.slice();
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => (p.name + ' ' + (p.brand || '') + ' ' + (p.model || '') + ' ' + p.tags.join(' ')).toLowerCase().includes(q));
    }
    if (category !== 'ALL') list = list.filter((p) => p.category === category);
    list.sort((a, b) => sort === 'price' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : b.purchaseDate.localeCompare(a.purchaseDate));
    return list;
  }, [products, search, category, sort]);

  const detailP = products.find((p) => p.id === detailId) || products[0];

  const navItems: [string, Screen][] = owner
    ? [['Catalog', 'catalog'], ['Dashboard', 'dashboard'], ['Analytics', 'analytics'], ['Warranty', 'warranty']]
    : [['Catalog', 'catalog'], ['Sign in', 'login']];

  const dividerColor = { borderColor: 'var(--color-divider)' } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* ── header / nav (persists across every screen — this is the single page) ── */}
      <header className="flex flex-col sm:flex-row sm:items-stretch border-b-2 sticky top-0 z-10" style={{ ...dividerColor, background: 'var(--color-bg)' }}>
        <div className="flex items-baseline gap-2.5 px-5 py-3.5 sm:border-r-2 sm:min-w-[240px]" style={dividerColor}>
          <span className="font-[var(--font-heading)] font-extrabold text-lg tracking-tight">GADGET&nbsp;TRACKER</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--color-accent)' }}>v1.1</span>
        </div>
        <nav className="flex items-center gap-1 px-3 flex-1 overflow-x-auto">
          {navItems.map(([label, s]) => (
            <button
              key={label}
              onClick={() => go(s)}
              className="border-0 bg-transparent cursor-pointer font-[var(--font-heading)] font-extrabold text-xs tracking-wider uppercase px-3 py-2.5 hover:[color:var(--color-accent)]"
              style={{ color: screen === s ? 'var(--color-accent)' : 'var(--color-text)' }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-4 sm:border-l-2 py-2 sm:py-0" style={dividerColor}>
          <span className="font-mono text-[10px] tracking-wider uppercase hidden sm:inline" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {owner ? 'owner session' : 'public visitor'}
          </span>
          <button
            className="btn btn-secondary text-xs"
            onClick={() => { setOwner((o) => !o); go(owner ? 'catalog' : 'dashboard'); }}
          >
            {owner ? 'Sign out' : 'View as owner'}
          </button>
        </div>
      </header>

      {/* ── CATALOG ── */}
      {screen === 'catalog' && (
        <main>
          <section className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] border-b-2" style={dividerColor}>
            <div className="px-5 pt-14 pb-10 md:border-r-2" style={dividerColor}>
              <div className="font-mono text-[11px] tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Public catalog / read only</div>
              <h1 className="text-[40px] md:text-[58px] leading-[1.02] mb-4 max-w-[15ch]">Every gadget I buy, logged the day I buy it.</h1>
              <p className="text-base max-w-[54ch]" style={{ color: 'color-mix(in srgb, var(--color-text) 75%, transparent)' }}>
                A single-owner inventory of phones, laptops, displays and the pile of cables between them. Specs, brand and ownership year are public. Price, receipts, serials and seller stay with the owner.
              </p>
            </div>
            <div className="grid grid-rows-2">
              <div className="grid grid-cols-2">
                <StatCell label="Items logged" value={products.length} borderRight />
                <div className="p-5 border-b-2" style={dividerColor}>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Categories</div>
                  <div className="font-[var(--font-heading)] font-extrabold text-[38px] leading-tight mt-1.5">{cats.length}</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-5 border-r-2" style={dividerColor}>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Tracking since</div>
                  <div className="font-[var(--font-heading)] font-extrabold text-[38px] leading-tight mt-1.5">2025</div>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Total spend</div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-[var(--font-heading)] font-extrabold text-[38px] leading-tight mt-1.5">{owner ? money(total) : mask()}</div>
                    {!owner && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-wrap items-center gap-4 px-5 py-3.5 border-b-2" style={dividerColor}>
            <div className="flex items-center gap-2 border px-2.5 min-w-[260px]" style={{ borderColor: 'var(--color-divider)', background: 'var(--color-surface)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input className="input border-0 !bg-transparent pl-0" placeholder="Search name, brand, model" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {['ALL', ...cats].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="font-mono text-[10px] tracking-wider px-2.5 py-1 border cursor-pointer"
                  style={{
                    borderColor: category === c ? 'var(--color-accent)' : 'var(--color-divider)',
                    background: category === c ? 'var(--color-accent)' : 'transparent',
                    color: category === c ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  {c}<span className="opacity-60 ml-1.5">{c === 'ALL' ? products.length : products.filter((p) => p.category === c).length}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Sort</span>
              <div className="seg">
                {([['Recent', 'purchaseDate'], ['Price', 'price'], ['Name', 'name']] as const).map(([label, key]) => (
                  <label key={key} className="seg-opt">
                    <input type="radio" name="sort" checked={sort === key} onChange={() => setSort(key)} />{label}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-b-2" style={dividerColor}>
            {filteredCatalog.map((p, i) => {
              const specList = Object.entries(p.specs).slice(0, 3).map(([k, v]) => `${k} ${v}`);
              const lastCol = (i + 1) % 3 === 0;
              return (
                <article
                  key={p.id}
                  onClick={() => { setDetailId(p.id); go('detail'); }}
                  className={`p-5 cursor-pointer border-b-2 flex flex-col hover:[background:var(--color-neutral-100)] ${lastCol ? '' : 'lg:border-r-2'}`}
                  style={dividerColor}
                >
                  {p.referenceImage ? (
                    <img src={p.referenceImage} alt={p.name} className="h-[168px] w-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 rounded border" style={{ borderColor: 'var(--color-divider)' }} />
                  ) : (
                    <PlaceholderBox label="Product photo" className="h-42 h-[168px]" />
                  )}
                  <div className="flex items-baseline justify-between gap-2.5 mt-4">
                    <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--color-accent)' }}>{p.category}</span>
                    <span className="tag tag-neutral">{p.status}</span>
                  </div>
                  <h3 className="text-xl mt-2 mb-1">{p.name}</h3>
                  <div className="text-[13px]" style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{[p.brand, p.model].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {specList.map((s) => <span key={s} className="tag tag-outline">{s}</span>)}
                  </div>
                  <div className="flex items-center justify-between gap-2.5 mt-4 pt-3 border-t" style={dividerColor}>
                    <span className="font-[var(--font-heading)] font-extrabold text-[17px]">{owner ? money(p.price, p.currency) : mask()}</span>
                    <span className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{owner ? fdate(p.purchaseDate) : 'owned since ' + p.purchaseDate.slice(0, 4)}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="flex items-center justify-between gap-5 px-5 py-4 border-b-2" style={dividerColor}>
            <span className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>Showing {filteredCatalog.length} of {products.length} items · page 1 · limit 10</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary" disabled>Previous</button>
              <button className="btn btn-secondary" disabled>Next</button>
            </div>
          </section>

          {!owner && (
            <section className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-end px-5 py-12" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              <h2 className="text-3xl md:text-[44px] leading-[1.05] max-w-[24ch]">Prices, receipts, serials and sellers are stripped at the serialization layer — not hidden in the browser.</h2>
              <div>
                <p className="text-sm opacity-90 max-w-[40ch] mb-4">One dataset, one set of routes. The response DTO decides what a visitor gets. Sign in to see the same catalog with the financial fields attached.</p>
                <button className="btn justify-start w-[200px]" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }} onClick={() => go('login')}>Owner sign in</button>
              </div>
            </section>
          )}
        </main>
      )}

      {/* ── DETAIL ── */}
      {screen === 'detail' && detailP && (
        <main>
          <div className="flex items-center gap-3 px-5 py-3 border-b-2" style={dividerColor}>
            <button className="btn btn-ghost" onClick={() => go('catalog')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Catalog
            </button>
            <span className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>{detailP.id}</span>
          </div>
          <section className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] border-b-2" style={dividerColor}>
            <div className="p-5 md:border-r-2" style={dividerColor}>
              {detailP.referenceImage ? (
                <img src={detailP.referenceImage} alt={detailP.name} className="aspect-[4/3] w-full object-cover grayscale opacity-90 rounded border" style={{ borderColor: 'var(--color-divider)' }} />
              ) : (
                <PlaceholderBox label="Drop reference photo — press or stock image" className="aspect-[4/3]" />
              )}
              <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                {(owner
                  ? Array.from({ length: detailP.receipts }, (_, i) => `receipt ${i + 1}`)
                  : ['receipts — owner only']
                ).map((label, i) => (
                  <PlaceholderBox key={i} label={label} className={`h-[74px] ${!owner ? 'col-span-3 opacity-45 pointer-events-none' : ''}`} />
                ))}
              </div>
            </div>
            <div className="p-8 px-5">
              <div className="font-mono text-[11px] tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>{detailP.category}</div>
              <h1 className="text-[32px] md:text-[44px] leading-[1.04] mb-1.5">{detailP.name}</h1>
              <div className="text-[15px] mb-5" style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{[detailP.brand, detailP.model].filter(Boolean).join(' · ')}</div>
              <div className="flex gap-1.5 flex-wrap mb-6">
                <span className="tag tag-accent">{detailP.status}</span>
                {detailP.tags.map((t) => <span key={t} className="tag tag-neutral">{t}</span>)}
              </div>
              <hr className="hr" />
              <table className="table">
                <tbody>
                  {[
                    { label: 'Category', value: detailP.category },
                    { label: 'Brand', value: detailP.brand || '—' },
                    { label: 'Model', value: detailP.model || '—' },
                    { label: 'Status', value: detailP.status },
                    { label: 'Tags', value: detailP.tags.join(', ') || '—' },
                    ...Object.entries(detailP.specs).map(([k, v]) => ({ label: 'Spec · ' + k, value: v })),
                    ...(owner
                      ? [
                          { label: 'Price', value: money(detailP.price, detailP.currency) },
                          { label: 'Purchase date', value: fdate(detailP.purchaseDate) || '—' },
                          { label: 'Purchased from', value: detailP.purchasedFrom || '—' },
                          { label: 'Warranty expiry', value: fdate(detailP.warrantyExpiry) || 'none' },
                          { label: 'Serial / IMEI', value: detailP.serialNumber || '—' },
                          { label: 'Receipt images', value: detailP.receipts + ' file(s)' },
                          { label: 'Notes', value: detailP.notes || '—' },
                        ]
                      : [
                          { label: 'Owned since', value: detailP.purchaseDate.slice(0, 4) },
                          { label: 'Price', value: mask(), locked: true },
                          { label: 'Purchase date', value: mask(), locked: true },
                          { label: 'Purchased from', value: mask(), locked: true },
                          { label: 'Warranty expiry', value: mask(), locked: true },
                          { label: 'Serial / IMEI', value: mask(), locked: true },
                          { label: 'Receipt images', value: mask(), locked: true },
                          { label: 'Notes', value: mask(), locked: true },
                        ]),
                  ].map((row, i) => (
                    <tr key={i}>
                      <th className="w-2/5 align-top">{row.label}</th>
                      <td className="font-mono text-[13px]">
                        <span style={row.locked ? { color: 'var(--color-accent)', letterSpacing: '0.1em' } : undefined}>{row.value}</span>
                        {row.locked && (
                          <span className="inline-flex items-center gap-1 ml-2 text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>owner only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {owner && (
                <div className="flex gap-2 mt-6">
                  <button className="btn btn-primary justify-start w-[160px]" onClick={() => openForm(detailP.id)}>Edit entry</button>
                  <button className="btn btn-secondary" onClick={() => markSold(detailP.id)}>Mark as sold</button>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ── LOGIN ── */}
      {screen === 'login' && (
        <main className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 'calc(100vh - 57px)' }}>
          <div className="px-5 py-16 md:border-r-2" style={dividerColor}>
            <div className="font-mono text-[11px] tracking-widest uppercase mb-5" style={{ color: 'var(--color-accent)' }}>Owner access</div>
            <h1 className="text-[32px] md:text-[46px] leading-[1.04] mb-4 max-w-[16ch]">Single account. No registration.</h1>
            <p className="max-w-[44ch] text-[15px]" style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>
              Credentials are seeded from environment variables. A short-lived access token is held in memory; the refresh token lives in an httpOnly cookie. Five attempts per fifteen minutes.
            </p>
          </div>
          <div className="px-5 py-16 max-w-[460px]">
            <h2 className="text-2xl mb-6">Sign in</h2>
            <div className="field mb-4">
              <label>Email</label>
              <input className="input" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="field mb-2">
              <label>Password</label>
              <input className="input" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            {loginError && <div className="text-xs mb-3" style={{ color: 'var(--color-accent)' }}>{loginError}</div>}
            <div className="font-mono text-[11px] mb-5" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Attempts remaining: 5 / 5</div>
            <button className="btn btn-primary btn-block" onClick={doLogin}>Sign in as owner</button>
            <button className="btn btn-secondary btn-block" onClick={() => go('catalog')}>Back to public catalog</button>
          </div>
        </main>
      )}

      {/* ── DASHBOARD ── */}
      {screen === 'dashboard' && (
        <main>
          <section className="grid grid-cols-2 md:grid-cols-4 border-b-2" style={dividerColor}>
            <StatCell label="Total spend" value={money(total)} sub="BDT · all statuses" borderRight />
            <StatCell label="Items" value={products.length} sub={`${cats.length} categories`} borderRight />
            <StatCell label="Average price" value={money(Math.round(total / (products.length || 1)))} sub="per item" borderRight />
            <StatCell label="Warranty ≤ 30 days" value={soonCount} sub="cron notifies daily" />
          </section>
          <section className="flex items-center justify-between gap-4 px-5 py-3.5 border-b-2" style={dividerColor}>
            <h2 className="text-[22px] m-0">Purchase log</h2>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={exportCsv}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>Export CSV
              </button>
              <button className="btn btn-primary" onClick={() => openForm(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Log a purchase
              </button>
            </div>
          </section>
          <section>
            {products.slice().sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate)).map((p) => {
              const d = daysUntil(p.warrantyExpiry);
              return (
                <div key={p.id} className="grid grid-cols-2 md:grid-cols-[88px_2.2fr_1fr_1fr_1fr_auto] items-center gap-5 px-5 py-3.5 border-b hover:[background:color-mix(in_srgb,var(--color-text)_4%,transparent)]" style={dividerColor}>
                  {p.referenceImage ? (
                    <img src={p.referenceImage} alt={p.name} className="h-[60px] w-[88px] object-cover grayscale hidden md:block rounded border" style={{ borderColor: 'var(--color-divider)' }} />
                  ) : (
                    <PlaceholderBox label="photo" className="h-[60px] hidden md:flex" />
                  )}
                  <div>
                    <div className="font-[var(--font-heading)] font-extrabold text-[16px]">{p.name}</div>
                    <div className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{p.category} · {[p.brand, p.model].filter(Boolean).join(' ')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Price</div>
                    <div className="font-[var(--font-heading)] font-extrabold text-[15px]">{money(p.price, p.currency)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Purchased</div>
                    <div className="font-mono text-[13px]">{p.purchaseDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Warranty</div>
                    <div className="font-mono text-[13px]" style={{ color: d !== null && d >= 0 && d <= 30 ? 'var(--color-accent)' : 'inherit' }}>{d === null ? 'none' : d < 0 ? 'expired' : d + ' days left'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tag tag-neutral">{p.status}</span>
                    <button className="btn btn-ghost" onClick={() => openForm(p.id)}>Edit</button>
                    <button className="btn btn-ghost" onClick={() => { setDetailId(p.id); go('detail'); }}>View</button>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      )}

      {/* ── FORM (create / edit) ── */}
      {screen === 'form' && (
        <main>
          <section className="flex items-baseline justify-between gap-5 px-5 py-7 border-b-2" style={dividerColor}>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase mb-2" style={{ color: 'var(--color-accent)' }}>{editingId ? `PATCH /products/${editingId}` : 'POST /products'}</div>
              <h1 className="text-[38px] m-0">{editingId ? 'Edit entry' : 'Log a purchase'}</h1>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={() => go(editingId ? 'detail' : 'dashboard')}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEntry}>Save entry</button>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] border-b-2" style={dividerColor}>
            <div className="p-5 md:border-r-2" style={dividerColor}>
              <h6 className="mb-4">Identity</h6>
              <div className="grid grid-cols-2 gap-4">
                <div className="field col-span-2"><label>Name *</label><input className="input" value={form.name} onChange={setF('name')} /></div>
                <div className="field"><label>Category *</label>
                  <select className="input" value={form.category} onChange={setF('category')}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label>Status</label>
                  <select className="input" value={form.status} onChange={setF('status')}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field"><label>Brand</label><input className="input" value={form.brand} onChange={setF('brand')} /></div>
                <div className="field"><label>Model</label><input className="input" value={form.model} onChange={setF('model')} /></div>
                <div className="field col-span-2"><label>Tags (comma separated)</label><input className="input" value={form.tags} onChange={setF('tags')} /></div>
              </div>
              <hr className="hr my-7" />
              <h6 className="mb-4">Specs — free-form JSON keys</h6>
              <div className="grid gap-2.5">
                {specRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2.5 items-center">
                    <input className="input" value={row.key} onChange={(e) => setSpecRows((r) => r.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} />
                    <input className="input" value={row.value} onChange={(e) => setSpecRows((r) => r.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                    <button className="btn btn-ghost" onClick={() => setSpecRows((r) => r.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-3" onClick={() => setSpecRows((r) => [...r, { key: '', value: '' }])}>Add spec row</button>
            </div>
            <div className="p-5">
              <h6 className="mb-4">Owner-only fields</h6>
              <div className="grid grid-cols-2 gap-4">
                <div className="field"><label>Price *</label><input className="input" type="number" value={form.price} onChange={setF('price')} /></div>
                <div className="field"><label>Currency</label><input className="input" value={form.currency} onChange={setF('currency')} /></div>
                <div className="field"><label>Purchase date *</label><input className="input" type="date" value={form.purchaseDate} onChange={setF('purchaseDate')} /></div>
                <div className="field"><label>Warranty expiry</label><input className="input" type="date" value={form.warrantyExpiry} onChange={setF('warrantyExpiry')} /></div>
                <div className="field col-span-2"><label>Purchased from</label><input className="input" value={form.purchasedFrom} onChange={setF('purchasedFrom')} /></div>
                <div className="field col-span-2"><label>Serial number / IMEI</label><input className="input" value={form.serialNumber} onChange={setF('serialNumber')} /></div>
                <div className="field col-span-2"><label>Notes</label><textarea className="input" value={form.notes} onChange={setF('notes')} /></div>
              </div>
              <div className="flex gap-2.5 items-start mt-4.5 p-3 text-xs" style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', borderLeft: '2px solid var(--color-accent)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none', marginTop: 1 }}><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                <span>Editing the warranty date resets <span className="font-mono">warrantyNotified</span> to false, so the reminder fires again.</span>
              </div>
              <hr className="hr my-7" />
              <h6 className="mb-3">Receipt / memo images — max 5, 5 MB each</h6>
              <div className="grid grid-cols-3 gap-2.5">
                <PlaceholderBox label="drop receipt" className="h-[74px]" />
                <PlaceholderBox label="drop receipt" className="h-[74px]" />
                <PlaceholderBox label="jpeg / png / webp" className="h-[74px]" />
              </div>
              <hr className="hr my-7" />
              <h6 className="mb-3">Reference image URL</h6>
              <input className="input" value={form.referenceImage} onChange={setF('referenceImage')} />
              <div className="text-xs mt-1.5" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Copyright-free press or stock photo. Public.</div>
            </div>
          </section>
        </main>
      )}

      {/* ── ANALYTICS ── */}
      {screen === 'analytics' && (
        <main>
          <section className="grid grid-cols-2 md:grid-cols-4 border-b-2" style={dividerColor}>
            <StatCell label="Total spend" value={money(total)} sub="_sum price" borderRight />
            <StatCell label="Items" value={products.length} sub="_count" borderRight />
            <StatCell label="Average" value={money(Math.round(total / (products.length || 1)))} sub="_avg price" borderRight />
            <StatCell label="Largest single" value={money(Math.max(...products.map((p) => p.price), 0))} sub={products.slice().sort((a, b) => b.price - a.price)[0]?.name || '—'} />
          </section>
          <section className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] border-b-2" style={dividerColor}>
            <div className="p-5 md:border-r-2" style={dividerColor}>
              <h3 className="mb-1">Spend by category</h3>
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>groupBy category · sum price · cached 5 min</p>
              <div className="grid gap-3.5 mt-5">
                {(() => {
                  const byCatMap: Record<string, number> = {};
                  products.forEach((p) => { byCatMap[p.category] = (byCatMap[p.category] || 0) + p.price; });
                  const maxCat = Math.max(...Object.values(byCatMap), 1);
                  return Object.keys(byCatMap).sort((a, b) => byCatMap[b] - byCatMap[a]).map((k) => (
                    <div key={k}>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-mono tracking-wider">{k}</span>
                        <span className="font-[var(--font-heading)] font-extrabold">{money(byCatMap[k])}</span>
                      </div>
                      <div className="h-3.5" style={{ background: 'var(--color-neutral-200)' }}>
                        <div className="h-full" style={{ width: Math.round((byCatMap[k] / maxCat) * 100) + '%', background: 'var(--color-accent)' }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="p-5">
              <h3 className="mb-1">Spend over time</h3>
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>DATE_TRUNC(&apos;month&apos;, &quot;purchaseDate&quot;) · raw query</p>
              {(() => {
                const now = new Date();
                const months: { key: string; label: string; short: string; amount: number }[] = [];
                for (let i = 11; i >= 0; i--) {
                  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                  const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                  months.push({ key, label: key.slice(2), short: '', amount: 0 });
                }
                products.forEach((p) => { const m = months.find((x) => x.key === p.purchaseDate.slice(0, 7)); if (m) m.amount += p.price; });
                const maxMonth = Math.max(...months.map((m) => m.amount), 1);
                return (
                  <>
                    <div className="grid grid-cols-12 gap-1.5 items-end h-[260px] mt-5 border-b-2 pb-0" style={dividerColor}>
                      {months.map((m) => (
                        <div key={m.key} className="flex flex-col justify-end h-full">
                          <span className="font-mono text-[9px] mb-1" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{m.amount ? Math.round(m.amount / 1000) + 'k' : ''}</span>
                          <div style={{ width: '100%', height: Math.max(2, Math.round((m.amount / maxMonth) * 210)) + 'px', background: m.amount ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-12 gap-1.5 mt-2">
                      {months.map((m) => <span key={m.key} className="font-mono text-[9px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{m.label}</span>)}
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
          <section className="p-5">
            <h3 className="mb-4">Largest purchases</h3>
            <table className="table">
              <thead><tr><th>Item</th><th>Category</th><th>Purchased</th><th>Price</th><th>Share of spend</th></tr></thead>
              <tbody>
                {products.slice().sort((a, b) => b.price - a.price).slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="font-[var(--font-heading)] font-extrabold">{p.name}</td>
                    <td className="font-mono text-xs">{p.category}</td>
                    <td className="font-mono text-xs">{p.purchaseDate}</td>
                    <td className="font-mono text-[13px]">{money(p.price, p.currency)}</td>
                    <td>{Math.round((p.price / (total || 1)) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {/* ── WARRANTY ── */}
      {screen === 'warranty' && (
        <main>
          <section className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] border-b-2" style={dividerColor}>
            <div className="p-8 px-5 md:border-r-2" style={dividerColor}>
              <div className="font-mono text-[11px] tracking-wider uppercase mb-3" style={{ color: 'var(--color-accent)' }}>Cron · daily 08:00</div>
              <h1 className="text-[28px] md:text-[40px] mb-3 max-w-[20ch]">Warranties expiring in the next 30 days</h1>
              <p className="max-w-[48ch] text-[15px]" style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>One email per item, sent once. The flag clears if the expiry date is edited.</p>
            </div>
            <div className="p-8 px-5">
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Last run</div>
              <div className="font-mono text-[15px] mb-4">{new Date().toISOString().slice(0, 10)} 08:00:03 +06</div>
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Notifications sent</div>
              <div className="font-[var(--font-heading)] font-extrabold text-[32px]">{products.filter((p) => p.notified).length}</div>
            </div>
          </section>
          <section>
            {products
              .filter((p) => { const d = daysUntil(p.warrantyExpiry); return d !== null && d >= 0 && d <= 30; })
              .sort((a, b) => (a.warrantyExpiry || '').localeCompare(b.warrantyExpiry || ''))
              .map((p) => {
                const d = daysUntil(p.warrantyExpiry)!;
                return (
                  <div key={p.id} className="grid grid-cols-2 md:grid-cols-[120px_2fr_1fr_1fr_auto] gap-5 items-center px-5 py-4.5 border-b" style={dividerColor}>
                    <div className="font-[var(--font-heading)] font-extrabold text-[22px] px-3 py-2 inline-block w-fit" style={{ color: d <= 14 ? 'var(--color-bg)' : 'var(--color-text)', background: d <= 14 ? 'var(--color-accent)' : 'var(--color-neutral-200)' }}>
                      {d}{d === 1 ? ' day' : ' days'}
                    </div>
                    <div>
                      <div className="font-[var(--font-heading)] font-extrabold text-[17px]">{p.name}</div>
                      <div className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{p.category} · bought {p.purchaseDate} · {p.purchasedFrom || 'unknown seller'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Expires</div>
                      <div className="font-mono text-[13px]">{p.warrantyExpiry}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Notified</div>
                      <span className={p.notified ? 'tag tag-neutral' : 'tag tag-outline'}>{p.notified ? 'sent' : 'queued'}</span>
                    </div>
                    <button className="btn btn-secondary" onClick={() => { setDetailId(p.id); go('detail'); }}>Open entry</button>
                  </div>
                );
              })}
          </section>
        </main>
      )}

      <footer className="flex items-center justify-between gap-5 px-5 py-5 border-t-2 font-mono text-[11px]" style={{ ...dividerColor, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
        <span>Gadget Purchase Tracker — Rifat Sarker</span>
        <span>GET /api/v1/products · {owner ? 'authenticated — full shape' : 'public — sanitized DTO'}</span>
      </footer>
    </div>
  );
}
