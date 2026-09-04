'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.enum(['PHONE', 'LAPTOP', 'DESKTOP', 'MONITOR', 'HUB', 'CABLE', 'PENDRIVE', 'KEYBOARD', 'MOUSE', 'HEADPHONE', 'CHARGER', 'OTHER']),
  brand: z.string().optional(),
  model: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().default('USD'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  purchasedFrom: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  serialNumber: z.string().optional(),
  referenceImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm({ initialData }: { initialData?: Partial<FormValues> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'OTHER',
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      price: initialData?.price || 0,
      currency: initialData?.currency || 'USD',
      purchaseDate: initialData?.purchaseDate || new Date().toISOString().split('T')[0],
      purchasedFrom: initialData?.purchasedFrom || '',
      warrantyExpiry: initialData?.warrantyExpiry || '',
      serialNumber: initialData?.serialNumber || '',
      referenceImage: initialData?.referenceImage || '',
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call for static phase
    setTimeout(() => {
      console.log('Form Submitted:', data);
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-outfit font-bold text-xl text-white">
            {initialData ? 'Edit Asset Record' : 'Register New Asset'}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-2">
              Basic Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Asset Name *</label>
                <input {...register('name')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
                {errors.name && <p className="text-rose-400 text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Category *</label>
                <select {...register('category')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 appearance-none">
                  {['PHONE', 'LAPTOP', 'DESKTOP', 'MONITOR', 'KEYBOARD', 'MOUSE', 'HEADPHONE', 'OTHER'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-rose-400 text-xs">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Brand</label>
                <input {...register('brand')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Model</label>
                <input {...register('model')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-2">
              Acquisition & Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Price *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-800 bg-slate-900 text-slate-400">$</span>
                  <input type="number" step="0.01" {...register('price')} className="flex-1 bg-slate-950/50 border border-slate-800 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 font-mono" />
                </div>
                {errors.price && <p className="text-rose-400 text-xs">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Purchase Date *</label>
                <input type="date" {...register('purchaseDate')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 font-mono [&::-webkit-calendar-picker-indicator]:invert" />
                {errors.purchaseDate && <p className="text-rose-400 text-xs">{errors.purchaseDate.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Warranty Expiry</label>
                <input type="date" {...register('warrantyExpiry')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 font-mono [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Serial Number</label>
                <input {...register('serialNumber')} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 font-mono uppercase" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-2">
              Media & Notes
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Reference Image URL</label>
                <input type="url" {...register('referenceImage')} placeholder="https://..." className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50 font-mono text-sm" />
                {errors.referenceImage && <p className="text-rose-400 text-xs">{errors.referenceImage.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Internal Notes</label>
                <textarea {...register('notes')} rows={4} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 custom-scrollbar resize-none" placeholder="Add specs, reasons for purchase, or condition notes here..."></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-end gap-3 shrink-0">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
          Cancel
        </button>
        <button type="submit" form="product-form" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? 'SAVING...' : 'SAVE RECORD'}
        </button>
      </div>
    </div>
  );
}
