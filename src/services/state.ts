import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product.model';

// Global app state shape
export interface AppState {
  products: Product[];
  cart: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppState = {
  products: [],
  cart: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root',
})
export class State {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  private stateSubject = new BehaviorSubject<AppState>(initialState);

  public state$ = this.stateSubject.asObservable();

  // Selectors - slice specific parts of state
  public products$ = this.state$.pipe(
    map(state => state.products)
  );

  public cart$ = this.state$.pipe(
    map(state => state.cart)
  );

  public cartCount$ = this.state$.pipe(
    map(state => state.cart.length)
  );

  public loading$ = this.state$.pipe(
    map(state => state.loading)
  );

  public error$ = this.state$.pipe(
    map(state => state.error)
  );


  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Only load from localStorage if in browser
    if (this.isBrowser){
      const savedCart = this.loadCartFromStorage();
      if (savedCart.length > 0) {
        this.updateState({ cart: savedCart });
      }
    }
  }

  private get state(): AppState {
    return this.stateSubject.value;
  }

  private updateState(partialState: Partial<AppState>): void {
    const newState = {
      ...this.state,
      ...partialState
    };
    this.stateSubject.next(newState);
  }


  setProducts(products: Product[]): void {
    this.updateState({ products, error: null });
  }

  addProduct(product: Product): void {
    const updatedProducts = [...this.state.products, product];
    this.updateState({ products: updatedProducts });
  }
  

  addToCart(product: Product): void {
    if (!this.isInCart(product.id!)) {
      const updatedCart = [...this.state.cart, product];
      this.updateState({ cart: updatedCart });
      this.saveCartToStorage(updatedCart);
    }
  }

  removeFromCart(productId: number): void {
    const updatedCart = this.state.cart.filter(item => item.id !== productId);
    this.updateState({ cart: updatedCart });
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    this.updateState({ cart: [] });
    // Only access localStorage if in broser
    if (this.isBrowser){
      localStorage.removeItem('cart');    }
  }

  isInCart(productId: number): boolean {
    return this.state.cart.some(item => item.id === productId);
  }
  

  getCartCount(): number {
    return this.state.cart.length;
  }


  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  clearError(): void {
    this.updateState({ error: null });
  }


  private loadCartFromStorage(): Product[] {
    // Only access localStorage if in browser
    if (!this.isBrowser) return [];

    try {
      const savedCart = localStorage.getItem('cart');
    return savedCart ? (JSON.parse(savedCart) as Product[]) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage: ', error);
      return [];
    }
  }

  private saveCartToStorage(cart: Product[]): void {
    // Only access localStorage if in browser
    if (!this.isBrowser) return;

    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage: ', error);
    }    
  }
}
