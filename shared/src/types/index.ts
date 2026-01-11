export type ApiResponse = {
  message: string;
  success: true;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}
