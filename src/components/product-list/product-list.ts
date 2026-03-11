import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductCard } from '../product-card/product-card';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { SearchInput } from '../search-input/search-input';
import { map, Subject, takeUntil } from 'rxjs';
import { State } from '../../services/state';
import { AppError } from '../../services/error-handler';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, SearchInput, RouterLink, AsyncPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private stateService = inject(State);
  private router = inject(Router);
  // private cdr = inject(ChangeDetectorRef);
  // private destroy$ = new Subject<void>();

  searchQuery: string = '';

  products$ = this.stateService.products$;
  loading$ = this.stateService.loading$;

  filteredProducts$ = this.products$.pipe(
    map(products => this.filterProducts(products))
  );

  errorMessage: string = '';

  ngOnInit(): void {
    this.loadProducts();
  }



  loadProducts(): void {
    this.errorMessage = '';
    this.productService.getAllProducts().subscribe({
      error: (error: AppError) => {
        this.errorMessage = error.message;
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  private filterProducts(products: Product[]): Product[] {
    if (!this.searchQuery.trim()) {
      return products;
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onProductClick(product: Product): void {
    this.router.navigate(['/products', product.id], {
      queryParams: { category: product.category }
    });
  }

  isProductInCart(productId: number): boolean {
    return this.stateService.isInCart(productId);
  }
}
