import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs';
import { Product } from '../components/product-card/product-card';
import { ErrorHandler } from './error-handler';
import { State } from './state';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = 'http://localhost:3000/products';
  private cartSubject = new BehaviorSubject<Product[]>([]);

  cart$ = this.cartSubject.asObservable();

  private httpClient = inject(HttpClient);
  private errorHandler = inject(ErrorHandler);
  private stateService = inject(State);

  getAllProducts(): Observable<Product[]> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.httpClient.get<Product[]>(this.apiURL).pipe(
      tap(products => {
        this.stateService.setProducts(products);
        this.stateService.setLoading(false);
      }),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.httpClient.get<Product>(`${this.apiURL}/${id}`).pipe(
      tap(() => {
        this.stateService.setLoading(false);
      }),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    );
  }

  
  // Create product via POST
  createProduct(product: Product): Observable<Product> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.httpClient.post<Product>(this.apiURL, product).pipe(
      tap(newProduct => {
        this.stateService.addProduct(newProduct);
        this.stateService.setLoading(false);
      }),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    )
  }
  
  // isInCart(productId: number): boolean {
  //   const cart = this.cartSubject.value;
  //   return cart.some(item => item.id === productId);
  // }

  // // Add product to cart
  // addToCart(product: Product): void {
  //   const cart = this.cartSubject.value;
  //   if (!this.isInCart(product.id!)) {
  //     const updatedCart = [...cart, product];
  //     this.cartSubject.next(updatedCart);
  //     this.saveCart(updatedCart);
  //   }
  // }

  // // Remove product from cart
  // removeFromCart(productId: number): void {
  //   const cart = this.cartSubject.value;
  //   const updatedCart = cart.filter(item => item.id !== productId);
  //   this.cartSubject.next(updatedCart);
  //   this.saveCart(updatedCart);
  // }

  // // Get current cart
  // getCart(): Product[] {
  //   return this.cartSubject.value;
  // }

  // // Get cart count
  // getCartCount(): number {
  //   return this.cartSubject.value.length;
  // }

  // // Save cart to localStorage
  // private saveCart(cart: Product[]): void {
  //   // localStorage.setItem('cart', JSON.stringify(cart));
  // }

  // // Clear cart
  // clearCart(): void {
  //   this.cartSubject.next([]);
  //   // localStorage.removeItem('cart');
  // }

  // Create product via POST
  // createProduct(product: Product): Observable<Product> {
  //   return this.httpClient.post<Product>(this.apiURL, product);
  // }
}
