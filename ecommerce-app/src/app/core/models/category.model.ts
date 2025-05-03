export interface Category {
  id?: number;
  name: string;
  description?: string;
  parentId?: number | null; // null for top-level categories
}
