import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../product-card/product-card';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.cart$.subscribe(cart => {
      this.cartItems = cart;
    });
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId)
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.productService.clearCart();
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }


}
