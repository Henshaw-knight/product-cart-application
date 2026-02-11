import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../components/product-card/product-card';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = 'http://localhost:3000/products';
  private cartSubject = new BehaviorSubject<Product[]>(
    this.loadCartFromStorage()  
  );

  cart$ = this.cartSubject.asObservable();

  private httpClient = inject(HttpClient);

  private loadCartFromStorage(): Product[] {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}`);
  }

  getProductsById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiURL}/${id}`);
  }
  
  isInCart(productId: number): boolean {
    const cart = this.cartSubject.value;
    return cart.some(item => item.id === productId);
  }
}
