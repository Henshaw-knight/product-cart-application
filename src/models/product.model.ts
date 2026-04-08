export interface Property {
  id?: number;
  colour: string;
  weight: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  imageUrl: string;
  rating: number;
  properties?: Property[]
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  imageUrl: string;
  rating: number;
  properties?: { colour: string; weight: string }[]; 
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;  
}