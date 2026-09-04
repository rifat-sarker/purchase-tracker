import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  referenceImage?: string;
  tags: string[];
  status: string;
  ownedSinceYear: number;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block h-full outline-none">
      <Card className="overflow-hidden h-full flex flex-col group cursor-pointer border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-500 shadow-xl shadow-black/40 hover:shadow-indigo-500/10">
        
        {/* Image Container */}
        <div className="relative h-56 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          {product.referenceImage ? (
            <Image
              src={product.referenceImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="text-slate-600 font-medium">No Image Available</div>
          )}
          
          <Badge className="absolute top-4 right-4 z-20 bg-indigo-500/90 text-white hover:bg-indigo-400 border-none backdrop-blur-md shadow-lg font-medium px-3 py-1">
            {product.category}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-6 flex-grow relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <h3 className="font-outfit font-bold text-xl text-slate-100 line-clamp-1 group-hover:text-indigo-300 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            {product.brand} <span className="text-slate-500">{product.model}</span>
          </p>
          
          <div className="flex flex-wrap gap-2 mt-5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 group-hover:border-slate-600 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0 text-sm text-slate-500 flex justify-between items-center relative z-10">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Since {product.ownedSinceYear}
          </span>
          <span className="capitalize tracking-wider text-xs font-semibold px-2 py-1 rounded-md bg-slate-800/50 text-slate-400">
            {product.status.toLowerCase()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
