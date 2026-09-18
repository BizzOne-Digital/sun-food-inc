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
export function calculateBestDiscount(
  items: DiscountableItem[],
  discounts: Pick<
    IDiscount,
    "type" | "value" | "minQuantity" | "minSubtotal" | "applicableProducts" | "applicableCategories" | "active" | "startDate" | "endDate"
  >[]
): number {
  const now = new Date();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  let best = 0;

  for (const d of discounts) {
    if (!d.active) continue;
    if (d.startDate && new Date(d.startDate) > now) continue;
    if (d.endDate && new Date(d.endDate) < now) continue;

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

    if (scopedItems.length === 0) continue;
    if (d.minQuantity && (hasProductScope || hasCategoryScope ? scopedQty : totalQty) < d.minQuantity) {
      continue;
    }
    if (d.minSubtotal && (hasProductScope || hasCategoryScope ? scopedSubtotal : subtotal) < d.minSubtotal) {
      continue;
    }

    const base = hasProductScope || hasCategoryScope ? scopedSubtotal : subtotal;
    const amount = d.type === "percentage" ? (base * d.value) / 100 : Math.min(d.value, base);

    if (amount > best) best = amount;
  }

  return Math.round(best * 100) / 100;
}
