import { IDiscount } from "@/models/Discount";

export interface DiscountableItem {
  productId: string;
  categoryId?: string;
  price: number;
  qty: number;
}

/**
 * Computes the best applicable discount amount for a cart of items,
 * given a list of active Discount documents. General-purpose: works for
 * quantity-based promos ("buy 3 get 30% off") and future festival campaigns.
 */
type ScopedDiscount = Pick<
  IDiscount,
  | "type"
  | "value"
  | "minQuantity"
  | "minSubtotal"
  | "applicableProducts"
  | "applicableCategories"
  | "active"
  | "startDate"
  | "endDate"
>;

function discountAmountFor(items: DiscountableItem[], d: ScopedDiscount, now: Date): number {
  if (!d.active) return 0;
  if (d.startDate && new Date(d.startDate) > now) return 0;
  if (d.endDate && new Date(d.endDate) < now) return 0;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  const hasProductScope = d.applicableProducts && d.applicableProducts.length > 0;
  const hasCategoryScope = d.applicableCategories && d.applicableCategories.length > 0;

  let scopedItems = items;
  if (hasProductScope || hasCategoryScope) {
    const productIds = new Set((d.applicableProducts || []).map((p) => p.toString()));
    const categoryIds = new Set((d.applicableCategories || []).map((c) => c.toString()));
    scopedItems = items.filter(
      (i) => productIds.has(i.productId) || (i.categoryId && categoryIds.has(i.categoryId))
    );
  }

  const scopedSubtotal = scopedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const scopedQty = scopedItems.reduce((sum, i) => sum + i.qty, 0);

  if (scopedItems.length === 0) return 0;
  if (d.minQuantity && (hasProductScope || hasCategoryScope ? scopedQty : totalQty) < d.minQuantity) {
    return 0;
  }
  if (d.minSubtotal && (hasProductScope || hasCategoryScope ? scopedSubtotal : subtotal) < d.minSubtotal) {
    return 0;
  }

  const base = hasProductScope || hasCategoryScope ? scopedSubtotal : subtotal;
  const amount = d.type === "percentage" ? (base * d.value) / 100 : Math.min(d.value, base);
  return amount;
}

/**
 * Computes the best applicable discount amount for a cart of items,
 * given a list of active Discount documents. General-purpose: works for
 * quantity-based promos ("buy 3 get 30% off") and future festival campaigns.
 */
export function calculateBestDiscount(items: DiscountableItem[], discounts: ScopedDiscount[]): number {
  const now = new Date();
  let best = 0;
  for (const d of discounts) {
    const amount = discountAmountFor(items, d, now);
    if (amount > best) best = amount;
  }
  return Math.round(best * 100) / 100;
}

/** Computes the discount amount for a single promo-code discount, or 0 if not applicable. */
export function calculateCodeDiscount(items: DiscountableItem[], discount: ScopedDiscount): number {
  const amount = discountAmountFor(items, discount, new Date());
  return Math.round(amount * 100) / 100;
}
