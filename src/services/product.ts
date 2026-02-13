import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../components/product-card/product-card';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = 'http://localhost:3000/products';
  private cartSubject = new BehaviorSubject<Product[]>([]);

  cart$ = this.cartSubject.asObservable();

  private httpClient = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}`);
  }

  getProductById(id: number): Observable<Product> {
    console.log(id)
    return this.httpClient.get<Product>(`${this.apiURL}/${id}`);
  }
  
  isInCart(productId: number): boolean {
    const cart = this.cartSubject.value;
    return cart.some(item => item.id === productId);
  }

  // Add product to cart
  addToCart(product: Product): void {
    const cart = this.cartSubject.value;
    if (!this.isInCart(product.id)) {
      const updatedCart = [...cart, product];
      this.cartSubject.next(updatedCart);
      this.saveCart(updatedCart);
    }
  }

  // Remove product from cart
  removeFromCart(productId: number): void {
    const cart = this.cartSubject.value;
    const updatedCart = cart.filter(item => item.id !== productId);
    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  // Get current cart
  getCart(): Product[] {
    return this.cartSubject.value;
  }

  // Get cart count
  getCartCount(): number {
    return this.cartSubject.value.length;
  }

  // Save cart to localStorage
  private saveCart(cart: Product[]): void {
    // localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Clear cart
  clearCart(): void {
    this.cartSubject.next([]);
    // localStorage.removeItem('cart');
  }
}
