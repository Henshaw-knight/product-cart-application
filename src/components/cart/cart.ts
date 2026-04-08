import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { Product } from '../product-card/product-card';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { AsyncPipe } from '@angular/common';
import { State } from '../../services/state';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private stateService = inject(State);

  cartItems$ = this.stateService.cart$;
  loading$ = this.stateService.loading$;

  removeFromCart(productId: number): void {
    this.stateService.removeFromCart(productId)
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.stateService.clearCart();
    }
  }

  getTotalPrice(items: any[]): number {
    return items.reduce((total, item) => total + item.price, 0);
  }


}
