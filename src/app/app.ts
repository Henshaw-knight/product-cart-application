import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components/navbar/navbar';
import { Product, ProductCard } from '../components/product-card/product-card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ProductCard, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-product-cart-application');

  searchQuery: string = '';
  cart: Product[] = [];

  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with superior sound quality',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Advanced fitness tracking and notifications on your wrist',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for better posture',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description: 'RGB backlit gaming keyboard with tactile switches',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Wireless Mouse',
      description: 'Precision wireless mouse with ergonomic design',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'USB-C Hub',
      description: 'Multi-port USB-C hub with HDMI and card reader',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Webcam HD',
      description: '1080p HD webcam with auto-focus and built-in microphone',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Phone Stand',
      description: 'Adjustable phone stand for desk and bedside use',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=400&h=300&fit=crop'
    }
  ];

  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }

    return this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get cartCount(): number {
    return this.cart.length;
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
  }

  onProductClick(product: Product): void {
    const index = this.cart.findIndex(item => item.id === product.id);

    if (index > -1) {
      // Product already in cart, remove it
      this.cart.splice(index, 1);
    } else {
      // Add product to cart
      this.cart.push(product);
    }
  }

  isProductInCart(productId: number): boolean {
    return this.cart.some(item => item.id === productId);
  }
}
