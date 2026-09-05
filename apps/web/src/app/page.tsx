'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setCredentials, logout as logoutAction } from '@/lib/features/authSlice';
import {
  productsApi,
  useLoginMutation,
  useLogoutMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsByCategoryQuery,
  useGetAnalyticsByMonthQuery,
  useGetUpcomingWarrantyQuery,
  downloadProductsCsv,
  resolveImageUrl,
  type Category,
  type Status,
  type ProductDTO,
} from '@/lib/api/productsApi';

type Screen = 'catalog' | 'detail' | 'login' | 'dashboard' | 'form' | 'analytics' | 'warranty';

const CATEGORIES: Category[] = ['PHONE', 'LAPTOP', 'DESKTOP', 'MONITOR', 'HUB', 'CABLE', 'PENDRIVE', 'KEYBOARD', 'MOUSE', 'HEADPHONE', 'CHARGER', 'OTHER'];
const STATUSES: Status[] = ['ACTIVE', 'SOLD', 'GIFTED', 'BROKEN', 'LOST'];

// ─── formatting helpers ───

function money(n: number, currency = 'BDT') {
  const symbol = currency === 'BDT' ? '৳' : currency + ' ';
  return symbol + Math.round(n).toLocaleString('en-US');
}
function mask() { return '••••••'; }
function fdate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysUntil(iso?: string | null) {
  if (!iso) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso).getTime() - today.getTime()) / 86400000);
}
function blankForm() {
  return { name: '', category: 'PHONE' as Category, status: 'ACTIVE' as Status, brand: '', model: '', tags: '', price: '', currency: 'BDT', purchaseDate: new Date().toISOString().slice(0, 10), warrantyExpiry: '', purchasedFrom: '', serialNumber: '', notes: '', referenceImage: '' };
}
type FormState = ReturnType<typeof blankForm>;
function formFor(p: ProductDTO): FormState {
  return {
    name: p.name, category: p.category, status: p.status, brand: p.brand || '', model: p.model || '',
    tags: p.tags.join(', '), price: p.price !== undefined ? String(p.price) : '', currency: p.currency || 'BDT',
    purchaseDate: p.purchaseDate ? p.purchaseDate.slice(0, 10) : '', warrantyExpiry: p.warrantyExpiry ? p.warrantyExpiry.slice(0, 10) : '',
    purchasedFrom: p.purchasedFrom || '', serialNumber: p.serialNumber || '', notes: p.notes || '', referenceImage: p.referenceImage || '',
  };
}
function buildProductFormData(form: FormState, specRows: { key: string; value: string }[], files: File[]): FormData {
  const fd = new FormData();
  const specs: Record<string, string> = {};
  specRows.forEach((r) => { if (r.key.trim()) specs[r.key.trim()] = r.value; });
  fd.append('name', form.name);
  fd.append('category', form.category);
  fd.append('status', form.status);
  if (form.brand) fd.append('brand', form.brand);
  if (form.model) fd.append('model', form.model);
  fd.append('tags', form.tags);
  fd.append('specs', JSON.stringify(specs));
  fd.append('price', form.price);
  fd.append('currency', form.currency || 'BDT');
  fd.append('purchaseDate', form.purchaseDate);
  if (form.warrantyExpiry) fd.append('warrantyExpiry', form.warrantyExpiry);
  if (form.purchasedFrom) fd.append('purchasedFrom', form.purchasedFrom);
  if (form.serialNumber) fd.append('serialNumber', form.serialNumber);
  if (form.notes) fd.append('notes', form.notes);
  if (form.referenceImage) fd.append('referenceImage', form.referenceImage);
  files.forEach((f) => fd.append('receiptImages', f));
  return fd;
}
function apiErrorMessage(err: unknown, fallback: string): string {
  const e = err as { data?: { message?: string } } | undefined;
  return e?.data?.message || fallback;
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

function StatusNote({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'accent' }) {
  return (
    <div className="p-10 text-center font-mono text-xs uppercase tracking-widest" style={{ color: tone === 'accent' ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>
      {children}
    </div>
  );
}

// ─── the app ───

export default function GadgetTracker() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const owner = isAuthenticated;

  const [screen, setScreen] = useState<Screen>('catalog');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState<'purchaseDate' | 'price' | 'name'>('purchaseDate');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, category, sort]);

  const go = (s: Screen) => { setScreen(s); setLoginError(''); setSaveError(''); };

  // ─── data: paginated + filtered catalog grid ───
  const catalogQuery = useGetProductsQuery({
    search: debouncedSearch.trim() || undefined,
    category: category !== 'ALL' ? category : undefined,
    sortBy: sort,
    sortOrder: 'desc',
    page: currentPage,
    limit: itemsPerPage,
  });

  // ─── data: the full (small) collection — powers header stats, category
  // chip counts, the owner dashboard table, and the analytics/warranty
  // screens' per-item detail. Fine at this app's personal-tracker scale
  // (backend caps limit at 50); a larger catalog would need the dashboard
  // and warranty screens to paginate too.
  const allProductsQuery = useGetProductsQuery({ limit: 50, sortBy: 'purchaseDate', sortOrder: 'desc' });
  const allProducts = useMemo(() => allProductsQuery.data?.data ?? [], [allProductsQuery.data]);

  const detailQuery = useGetProductQuery(detailId ?? '', { skip: !detailId });

  const summaryQuery = useGetAnalyticsSummaryQuery(undefined, { skip: !owner });
  const byCategoryQuery = useGetAnalyticsByCategoryQuery(undefined, { skip: !owner || screen !== 'analytics' });
  const byMonthQuery = useGetAnalyticsByMonthQuery(undefined, { skip: !owner || screen !== 'analytics' });
  const upcomingWarrantyQuery = useGetUpcomingWarrantyQuery(undefined, { skip: !owner || screen !== 'warranty' });

  const [loginMutation, { isLoading: loggingIn }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const saving = creating || updating || deleting;

  const openForm = (id: string | null) => {
    const p = id ? allProducts.find((x) => x.id === id) : null;
    setEditingId(id);
    setForm(p ? formFor(p) : blankForm());
    setSpecRows(p ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
    setUploadFiles([]);
    setSaveError('');
    go('form');
  };

  const setF = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const saveEntry = async () => {
    if (!form.name.trim() || !form.purchaseDate || !(Number(form.price) > 0)) {
      setSaveError('Name, category, a positive price, and a purchase date are required.');
      return;
    }
    try {
      const fd = buildProductFormData(form, specRows, uploadFiles);
      if (editingId) await updateProduct({ id: editingId, formData: fd }).unwrap();
      else await createProduct(fd).unwrap();
      go('dashboard');
    } catch (err) {
      setSaveError(apiErrorMessage(err, 'Could not save this entry — is the API running?'));
    }
  };

  const deleteEntry = async () => {
    if (!editingId || !window.confirm('Are you sure you want to completely delete this entry?')) return;
    try {
      await deleteProduct({ id: editingId, hard: true }).unwrap();
      go('dashboard');
    } catch (err) {
      setSaveError(apiErrorMessage(err, 'Could not delete this entry.'));
    }
  };

  const markSold = async (id: string) => {
    const fd = new FormData();
    fd.append('status', 'SOLD');
    try { await updateProduct({ id, formData: fd }).unwrap(); } catch { /* surfaced via query error state elsewhere */ }
  };

  const exportCsv = () => { downloadProductsCsv(accessToken).catch(() => setSaveError('CSV export failed.')); };

  const doLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) { setLoginError('Email and password are required.'); return; }
    try {
      const { accessToken: token } = await loginMutation({ email: loginEmail, password: loginPassword }).unwrap();
      dispatch(setCredentials({ accessToken: token }));
      // Product/analytics responses are cached by query args alone, which
      // don't change on login — without this, already-mounted queries would
      // keep serving their pre-login (public-shaped) cached data instead of
      // refetching with the new Authorization header.
      dispatch(productsApi.util.invalidateTags(['Product', 'Analytics']));
      setLoginError('');
      go('dashboard');
    } catch (err) {
      setLoginError(apiErrorMessage(err, 'Invalid email or password.'));
    }
  };

  const doLogout = async () => {
    try { await logoutMutation().unwrap(); } catch { /* best-effort */ }
    dispatch(logoutAction());
    dispatch(productsApi.util.invalidateTags(['Product', 'Analytics']));
    go('catalog');
  };

  // ─── derived render values ───

  const total = summaryQuery.data?.totalSpend ?? 0;
  const cats = useMemo(() => Array.from(new Set(allProducts.map((p) => p.category))), [allProducts]);

  const catalogItems = catalogQuery.data?.data ?? [];
  const meta = catalogQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const detailP = detailQuery.data;

  const navItems: [string, Screen][] = owner
    ? [['Catalog', 'catalog'], ['Dashboard', 'dashboard'], ['Analytics', 'analytics'], ['Warranty', 'warranty']]
    : [['Catalog', 'catalog'], ['Sign in', 'login']];

  const dividerColor = { borderColor: 'var(--color-divider)' } as React.CSSProperties;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="flex flex-col lg:flex-row lg:items-stretch border-b-2 sticky top-0 z-20 bg-[var(--color-bg)]" style={dividerColor}>
        <div className="flex items-baseline gap-2.5 px-5 py-3 lg:border-r-2 shrink-0" style={dividerColor}>
          <span className="font-[var(--font-heading)] font-extrabold text-lg tracking-tight">GADGET&nbsp;TRACKER</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--color-accent)' }}>v1.1</span>
        </div>
        <nav className="flex items-center gap-1 px-3 flex-1 overflow-x-auto">
          {navItems.map(([label, s]) => (
            <button
              key={label}
              onClick={() => go(s)}
              className="border-0 bg-transparent cursor-pointer font-[var(--font-heading)] font-extrabold text-xs tracking-wider uppercase px-3 py-2.5 hover:[color:var(--color-accent)] shrink-0"
              style={{ color: screen === s ? 'var(--color-accent)' : 'var(--color-text)' }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5 px-5 lg:border-l-2 shrink-0" style={dividerColor}>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Items</span>
            <span className="font-[var(--font-heading)] font-extrabold text-[14px]">{allProductsQuery.data?.meta.total ?? '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Cats</span>
            <span className="font-[var(--font-heading)] font-extrabold text-[14px]">{cats.length}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Spend</span>
            <div className="flex items-center gap-1">
              <span className="font-[var(--font-heading)] font-extrabold text-[14px]">{owner ? money(total) : mask()}</span>
              {!owner && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" className="shrink-0"><rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 lg:border-l-2 py-2 lg:py-0 shrink-0" style={dividerColor}>
          <span className="font-mono text-[9px] tracking-wider uppercase hidden xl:inline" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            {owner ? 'owner session' : 'public visitor'}
          </span>
          {owner && (
            <button className="btn btn-secondary text-[10px] px-2 py-1 h-auto min-h-0" onClick={doLogout}>Sign out</button>
          )}
        </div>
      </header>

      {/* ── CATALOG ── */}
      {screen === 'catalog' && (
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

          <section className="flex flex-wrap items-center gap-4 px-5 py-2.5 border-b-2 shrink-0 z-10 bg-[var(--color-bg)]" style={dividerColor}>
            <div className="flex items-center gap-2 border border-[color:var(--color-divider)] focus-within:border-[color:var(--color-text)] px-2.5 w-full md:w-auto md:min-w-[260px] transition-colors" style={{ background: 'var(--color-surface)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input className="bg-transparent !border-0 !outline-none focus:!outline-none focus:!ring-0 focus:!border-0 !shadow-none w-full text-[var(--color-text)] py-1.5 text-sm" placeholder="Search name, brand, model" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1.5 w-full md:w-auto md:flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  {c}<span className="opacity-60 ml-1.5">{c === 'ALL' ? (allProductsQuery.data?.meta.total ?? 0) : allProducts.filter((p) => p.category === c).length}</span>
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

          {catalogQuery.isLoading ? (
            <StatusNote>Loading catalog…</StatusNote>
          ) : catalogQuery.isError ? (
            <StatusNote tone="accent">Couldn&apos;t reach the API. <button className="underline cursor-pointer" onClick={() => catalogQuery.refetch()}>Retry</button></StatusNote>
          ) : (
            <section className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 z-10 bg-[var(--color-bg)] overflow-y-auto" style={dividerColor}>
              {catalogItems.map((p, i) => {
                const specList = Object.entries(p.specs).slice(0, 3).map(([k, v]) => `${k} ${v}`);
                const lastCol = (i + 1) % 3 === 0;
                const img = resolveImageUrl(p.referenceImage);
                return (
                  <article
                    key={p.id}
                    onClick={() => { setDetailId(p.id); go('detail'); }}
                    className={`p-4 md:p-5 cursor-pointer border-b-2 sm:border-b-0 flex flex-col hover:[background:var(--color-neutral-100)] transition-colors h-full ${lastCol ? '' : 'lg:border-r-2'} ${(i + 1) % 2 !== 0 ? 'sm:border-r-2 lg:border-r-2' : ''}`}
                    style={dividerColor}
                  >
                    {img ? (
                      <div className="relative h-[100px] md:h-[130px] w-full shrink-0 overflow-hidden rounded border border-[var(--color-divider)]">
                        <img src={img} alt={p.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500" />
                      </div>
                    ) : (
                      <PlaceholderBox label="Product photo" className="h-[100px] md:h-[130px] shrink-0" />
                    )}
                    <div className="flex items-baseline justify-between gap-2.5 mt-4">
                      <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--color-accent)' }}>{p.category}</span>
                      <span className="tag tag-neutral">{p.status}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mt-2 mb-1">
                      <h3 className="text-xl leading-none">{p.name}</h3>
                      {owner && p.price !== undefined && (
                        <span className="font-[var(--font-heading)] font-extrabold text-[15px] shrink-0 leading-none">
                          {money(p.price, p.currency)}
                        </span>
                      )}
                    </div>
                    <div className="text-[13px]" style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{[p.brand, p.model].filter(Boolean).join(' · ') || '—'}</div>
                    <div className="font-mono text-[10px] mt-1" style={{ color: 'color-mix(in srgb, var(--color-text) 45%, transparent)' }}>
                      {owner && p.purchaseDate ? `Purchased: ${fdate(p.purchaseDate)}` : `Owned since ${p.ownedSinceYear}`}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {specList.map((s) => <span key={s} className="tag tag-outline">{s}</span>)}
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <section className="flex items-center justify-between gap-5 px-5 py-1.5 border-t-2 shrink-0 z-10 bg-[var(--color-bg)]" style={dividerColor}>
            <span className="font-mono text-[10px]" style={{ color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>
              Showing {catalogItems.length} of {meta?.total ?? 0} items · page {currentPage} of {totalPages}
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase hidden sm:block" style={{ color: 'color-mix(in srgb, var(--color-text) 30%, transparent)' }}>
              &copy; {new Date().getFullYear()} Rifat Sarker
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-secondary cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-1 px-3 min-h-0 text-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-1 px-3 min-h-0 text-xs"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ── DETAIL ── */}
      {screen === 'detail' && (
        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 px-5 py-3 border-b-2" style={dividerColor}>
            <button className="btn btn-ghost" onClick={() => go('catalog')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Catalog
            </button>
            <span className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>{detailId}</span>
          </div>
          {detailQuery.isLoading ? (
            <StatusNote>Loading…</StatusNote>
          ) : detailQuery.isError || !detailP ? (
            <StatusNote tone="accent">Product not found.</StatusNote>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] border-b-2" style={dividerColor}>
              <div className="p-5 md:border-r-2" style={dividerColor}>
                {resolveImageUrl(detailP.referenceImage) ? (
                  <img src={resolveImageUrl(detailP.referenceImage)} alt={detailP.name} className="aspect-[4/3] w-full object-cover grayscale opacity-90 rounded border" style={{ borderColor: 'var(--color-divider)' }} />
                ) : (
                  <PlaceholderBox label="Drop reference photo — press or stock image" className="aspect-[4/3]" />
                )}
                <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                  {(owner && detailP.receiptImages?.length
                    ? detailP.receiptImages.map((url, i) => ({ url, label: `receipt ${i + 1}` }))
                    : owner
                      ? []
                      : [{ url: undefined, label: 'receipts — owner only' }]
                  ).map((r, i) => (
                    r.url ? (
                      <img key={i} src={resolveImageUrl(r.url)} alt={r.label} className="h-[74px] w-full object-cover grayscale border" style={{ borderColor: 'var(--color-divider)' }} />
                    ) : (
                      <PlaceholderBox key={i} label={r.label} className={`h-[74px] ${!owner ? 'col-span-3 opacity-45 pointer-events-none' : ''}`} />
                    )
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
                            { label: 'Price', value: money(detailP.price ?? 0, detailP.currency) },
                            { label: 'Purchase date', value: fdate(detailP.purchaseDate) || '—' },
                            { label: 'Purchased from', value: detailP.purchasedFrom || '—' },
                            { label: 'Warranty expiry', value: fdate(detailP.warrantyExpiry) || 'none' },
                            { label: 'Serial / IMEI', value: detailP.serialNumber || '—' },
                            { label: 'Receipt images', value: (detailP.receiptImages?.length ?? 0) + ' file(s)' },
                            { label: 'Notes', value: detailP.notes || '—' },
                          ]
                        : [
                            { label: 'Owned since', value: String(detailP.ownedSinceYear) },
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
          )}
        </main>
      )}

      {/* ── LOGIN ── */}
      {screen === 'login' && (
        <main className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto" style={{ minHeight: 'calc(100vh - 57px)' }}>
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
              <input className="input" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') doLogin(); }} />
            </div>
            {loginError && <div className="text-xs mb-3" style={{ color: 'var(--color-accent)' }}>{loginError}</div>}
            <button className="btn btn-primary btn-block" onClick={doLogin} disabled={loggingIn}>{loggingIn ? 'Signing in…' : 'Sign in as owner'}</button>
            <button className="btn btn-secondary btn-block" onClick={() => go('catalog')}>Back to public catalog</button>
          </div>
        </main>
      )}

      {/* ── DASHBOARD ── */}
      {screen === 'dashboard' && (
        <main className="flex-1 overflow-y-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-b-2" style={dividerColor}>
            <StatCell label="Total spend" value={money(summaryQuery.data?.totalSpend ?? 0)} sub="BDT · all statuses" borderRight />
            <StatCell label="Items" value={allProductsQuery.data?.meta.total ?? allProducts.length} sub={`${cats.length} categories`} borderRight />
            <StatCell label="Average price" value={money(summaryQuery.data?.averagePrice ?? 0)} sub="per item" borderRight />
            <StatCell label="Warranty ≤ 30 days" value={allProducts.filter((p) => { const d = daysUntil(p.warrantyExpiry); return d !== null && d >= 0 && d <= 30; }).length} sub="cron notifies daily" />
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
          {saveError && <div className="px-5 py-2 text-xs font-mono" style={{ color: 'var(--color-accent)' }}>{saveError}</div>}
          {allProductsQuery.isLoading ? (
            <StatusNote>Loading purchase log…</StatusNote>
          ) : (
            <section>
              <div className="hidden md:block px-5 py-2 border-b-2 font-mono text-[9px] tracking-widest uppercase" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)', ...dividerColor }}>
                <div className="grid grid-cols-[88px_2.2fr_1fr_1fr_1fr_auto] gap-5">
                  <div></div><div>Product</div><div>Price</div><div>Purchased</div><div>Warranty</div><div className="text-right">Action</div>
                </div>
              </div>
              {allProducts.map((p) => {
                const d = daysUntil(p.warrantyExpiry);
                const img = resolveImageUrl(p.referenceImage);
                return (
                  <div key={p.id} className="grid grid-cols-2 md:grid-cols-[88px_2.2fr_1fr_1fr_1fr_auto] items-center gap-y-4 gap-x-3 sm:gap-5 px-5 py-4 sm:py-3.5 border-b hover:[background:color-mix(in_srgb,var(--color-text)_4%,transparent)]" style={dividerColor}>
                    {img ? (
                      <img src={img} alt={p.name} className="h-[60px] w-[88px] object-cover grayscale hidden md:block rounded border" style={{ borderColor: 'var(--color-divider)' }} />
                    ) : (
                      <PlaceholderBox label="photo" className="h-[60px] hidden md:flex" />
                    )}
                    <div className="col-span-2 md:col-span-1">
                      <div className="font-[var(--font-heading)] font-extrabold text-[16px]">{p.name}</div>
                      <div className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{p.category} · {[p.brand, p.model].filter(Boolean).join(' ')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider md:hidden" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Price</div>
                      <div className="font-[var(--font-heading)] font-extrabold text-[15px]">{money(p.price ?? 0, p.currency)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider md:hidden" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Purchased</div>
                      <div className="font-mono text-[13px]">{p.purchaseDate?.slice(0, 10)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider md:hidden" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Warranty</div>
                      <div className="font-mono text-[13px]" style={{ color: d !== null && d >= 0 && d <= 30 ? 'var(--color-accent)' : 'inherit' }}>{d === null ? 'none' : d < 0 ? 'expired' : d + ' days left'}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2 col-span-2 md:col-span-1">
                      <span className="tag tag-neutral hidden md:inline-flex">{p.status}</span>
                      <button className="btn btn-ghost" onClick={() => openForm(p.id)}>Edit</button>
                      <button className="btn btn-ghost" onClick={() => { setDetailId(p.id); go('detail'); }}>View</button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      )}

      {/* ── FORM (create / edit) ── */}
      {screen === 'form' && (
        <main className="flex-1 overflow-y-auto">
          <section className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 sm:gap-5 px-5 py-5 sm:py-7 border-b-2" style={dividerColor}>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase mb-2" style={{ color: 'var(--color-accent)' }}>{editingId ? `PATCH /products/${editingId}` : 'POST /products'}</div>
              <h1 className="text-[38px] m-0">{editingId ? 'Edit entry' : 'Log a purchase'}</h1>
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button className="btn btn-ghost" style={{ color: 'var(--color-accent)' }} onClick={deleteEntry} disabled={saving}>Delete</button>
              )}
              <button className="btn btn-secondary" onClick={() => go(editingId ? 'detail' : 'dashboard')} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEntry} disabled={saving}>{saving ? 'Saving…' : 'Save entry'}</button>
            </div>
          </section>
          {saveError && <div className="px-5 py-2 text-xs font-mono border-b-2" style={{ color: 'var(--color-accent)', ...dividerColor }}>{saveError}</div>}
          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] border-b-2" style={dividerColor}>
            <div className="p-5 md:border-r-2" style={dividerColor}>
              <h6 className="mb-4">Identity</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-[1fr_1.4fr_auto] gap-2.5 items-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <h6 className="mb-3">Product Images & Receipts</h6>
              <div className="border-2 border-dashed rounded flex flex-col items-center justify-center p-8 cursor-pointer transition-colors hover:bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-divider)' }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="multi-upload"
                  onChange={(e) => { if (e.target.files) setUploadFiles(Array.from(e.target.files)); }}
                />
                <label htmlFor="multi-upload" className="cursor-pointer flex flex-col items-center w-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5, marginBottom: 8 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span className="text-[13px] font-bold">Click to upload multiple images</span>
                  <span className="text-[10px] mt-1" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Select receipts (max 5, 5MB each) — uploaded as `receiptImages`</span>
                </label>
              </div>

              {uploadFiles.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {uploadFiles.map((f, i) => (
                    <div key={i} className="relative w-[74px] h-[74px] border rounded overflow-hidden" style={{ borderColor: 'var(--color-divider)' }}>
                      <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                      <button
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        onClick={(e) => { e.preventDefault(); setUploadFiles((fs) => fs.filter((_, j) => j !== i)); }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t-2" style={dividerColor}>
                <h6 className="mb-3 text-[10px] uppercase opacity-70">Reference image URL (public press/stock photo)</h6>
                <input className="input" value={form.referenceImage} onChange={setF('referenceImage')} placeholder="https://..." />
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ── ANALYTICS ── */}
      {screen === 'analytics' && (
        <main className="flex-1 overflow-y-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-b-2" style={dividerColor}>
            <StatCell label="Total spend" value={money(summaryQuery.data?.totalSpend ?? 0)} sub="_sum price" borderRight />
            <StatCell label="Items" value={allProductsQuery.data?.meta.total ?? 0} sub="_count" borderRight />
            <StatCell label="Average" value={money(summaryQuery.data?.averagePrice ?? 0)} sub="_avg price" borderRight />
            <StatCell label="Largest single" value={money(Math.max(...allProducts.map((p) => p.price ?? 0), 0))} sub={allProducts.slice().sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0]?.name || '—'} />
          </section>
          <section className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] border-b-2" style={dividerColor}>
            <div className="p-5 md:border-r-2" style={dividerColor}>
              <h3 className="mb-1">Spend by category</h3>
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>groupBy category · sum price · cached 5 min</p>
              {byCategoryQuery.isLoading ? <StatusNote>Loading…</StatusNote> : (
                <div className="grid gap-3.5 mt-5">
                  {(() => {
                    const rows = byCategoryQuery.data ?? [];
                    const maxCat = Math.max(...rows.map((r) => r.totalSpend), 1);
                    return rows.map((r) => (
                      <div key={r.category}>
                        <div className="flex justify-between items-baseline text-xs mb-1">
                          <span className="font-mono tracking-wider">{r.category}</span>
                          <span className="font-[var(--font-heading)] font-extrabold">{money(r.totalSpend)}</span>
                        </div>
                        <div className="h-3.5" style={{ background: 'var(--color-neutral-200)' }}>
                          <div className="h-full" style={{ width: Math.round((r.totalSpend / maxCat) * 100) + '%', background: 'var(--color-accent)' }} />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="mb-1">Spend over time</h3>
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>DATE_TRUNC(&apos;month&apos;, &quot;purchaseDate&quot;) · raw query</p>
              {byMonthQuery.isLoading ? <StatusNote>Loading…</StatusNote> : (() => {
                const rows = byMonthQuery.data ?? [];
                const maxMonth = Math.max(...rows.map((r) => r.totalSpend), 1);
                return (
                  <>
                    <div className="grid gap-1.5 items-end h-[260px] mt-5 border-b-2 pb-0" style={{ ...dividerColor, gridTemplateColumns: `repeat(${rows.length || 1}, 1fr)` }}>
                      {rows.map((m) => (
                        <div key={m.month} className="flex flex-col justify-end h-full">
                          <span className="font-mono text-[9px] mb-1" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{m.totalSpend ? Math.round(m.totalSpend / 1000) + 'k' : ''}</span>
                          <div style={{ width: '100%', height: Math.max(2, Math.round((m.totalSpend / maxMonth) * 210)) + 'px', background: m.totalSpend ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-1.5 mt-2" style={{ gridTemplateColumns: `repeat(${rows.length || 1}, 1fr)` }}>
                      {rows.map((m) => <span key={m.month} className="font-mono text-[9px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>{m.month.slice(2)}</span>)}
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
                {allProducts.slice().sort((a, b) => (b.price ?? 0) - (a.price ?? 0)).slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="font-[var(--font-heading)] font-extrabold">{p.name}</td>
                    <td className="font-mono text-xs">{p.category}</td>
                    <td className="font-mono text-xs">{p.purchaseDate?.slice(0, 10)}</td>
                    <td className="font-mono text-[13px]">{money(p.price ?? 0, p.currency)}</td>
                    <td>{Math.round(((p.price ?? 0) / (total || 1)) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {/* ── WARRANTY ── */}
      {screen === 'warranty' && (
        <main className="flex-1 overflow-y-auto">
          <section className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] border-b-2" style={dividerColor}>
            <div className="p-8 px-5 md:border-r-2" style={dividerColor}>
              <div className="font-mono text-[11px] tracking-wider uppercase mb-3" style={{ color: 'var(--color-accent)' }}>Cron · daily 08:00</div>
              <h1 className="text-[28px] md:text-[40px] mb-3 max-w-[20ch]">Warranties expiring in the next 30 days</h1>
              <p className="max-w-[48ch] text-[15px]" style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>One email per item, sent once. The flag clears if the expiry date is edited.</p>
            </div>
            <div className="p-8 px-5">
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Server time</div>
              <div className="font-mono text-[15px] mb-4">{new Date().toISOString().slice(0, 10)}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>Notified (of the below)</div>
              <div className="font-[var(--font-heading)] font-extrabold text-[32px]">{(upcomingWarrantyQuery.data ?? []).filter((w) => w.warrantyNotified).length}</div>
            </div>
          </section>
          {upcomingWarrantyQuery.isLoading ? <StatusNote>Loading…</StatusNote> : (
            <section>
              <div className="hidden md:block px-5 py-2 border-b-2 font-mono text-[9px] tracking-widest uppercase" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)', ...dividerColor }}>
                <div className="grid grid-cols-[120px_2fr_1fr_1fr_auto] gap-5">
                  <div>Countdown</div><div>Product</div><div>Expires</div><div>Status</div><div className="text-right">Action</div>
                </div>
              </div>
              {(upcomingWarrantyQuery.data ?? [])
                .slice()
                .sort((a, b) => a.warrantyExpiry.localeCompare(b.warrantyExpiry))
                .map((w) => {
                  const d = daysUntil(w.warrantyExpiry)!;
                  const full = allProducts.find((p) => p.id === w.id);
                  return (
                    <div key={w.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[120px_2fr_1fr_1fr_auto] gap-y-4 gap-x-3 sm:gap-5 items-center px-5 py-4 sm:py-4.5 border-b" style={dividerColor}>
                      <div className="font-[var(--font-heading)] font-extrabold text-[22px] px-3 py-2 inline-block w-fit" style={{ color: d <= 14 ? 'var(--color-bg)' : 'var(--color-text)', background: d <= 14 ? 'var(--color-accent)' : 'var(--color-neutral-200)' }}>
                        {d}{d === 1 ? ' day' : ' days'}
                      </div>
                      <div>
                        <div className="font-[var(--font-heading)] font-extrabold text-[17px]">{w.name}</div>
                        <div className="font-mono text-[11px]" style={{ color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                          {w.category}{full ? ` · bought ${full.purchaseDate?.slice(0, 10)} · ${full.purchasedFrom || 'unknown seller'}` : ''}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Expires</div>
                        <div className="font-mono text-[13px]">{w.warrantyExpiry.slice(0, 10)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>Notified</div>
                        <span className={w.warrantyNotified ? 'tag tag-neutral' : 'tag tag-outline'}>{w.warrantyNotified ? 'sent' : 'queued'}</span>
                      </div>
                      <button className="btn btn-secondary" onClick={() => { setDetailId(w.id); go('detail'); }}>Open entry</button>
                    </div>
                  );
                })}
              {(upcomingWarrantyQuery.data ?? []).length === 0 && <StatusNote>Nothing expiring in the next 30 days.</StatusNote>}
            </section>
          )}
        </main>
      )}

      {screen !== 'catalog' && (
        <footer className="flex items-center justify-center px-5 py-1 shrink-0 z-10 bg-[var(--color-bg)]">
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>
            &copy; {new Date().getFullYear()} Rifat Sarker
          </span>
        </footer>
      )}
    </div>
  );
}
