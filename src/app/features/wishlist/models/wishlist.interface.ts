import { Product } from "../../../core/models/product.interface";

export interface Wishlist {
  status: string;
  count: number;
  data: Product[];
}
