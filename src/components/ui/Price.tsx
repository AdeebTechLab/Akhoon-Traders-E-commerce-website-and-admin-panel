import type { Product } from '../../types';
import { effectivePrice, formatPKR } from '../../utils/format';

interface Props {
  product: Pick<Product, 'price' | 'salePrice'>;
  size?: 'sm' | 'lg';
}

export function Price({ product, size = 'sm' }: Props) {
  const current = effectivePrice(product);
  const onSale = current < product.price;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold text-brand-800 ${size === 'lg' ? 'text-3xl' : 'text-base'}`}>{formatPKR(current)}</span>
      {onSale && (
        <span className={`text-stone-400 line-through ${size === 'lg' ? 'text-lg' : 'text-xs'}`}>
          {formatPKR(product.price)}
        </span>
      )}
    </div>
  );
}
