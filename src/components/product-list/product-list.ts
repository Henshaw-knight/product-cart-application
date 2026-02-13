import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductCard } from '../product-card/product-card';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { SearchInput } from '../search-input/search-input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, SearchInput],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    // console.log('Here here');
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (products) => {
        // console.log(products);
        this.products = products;
        this.filterProducts();
        this.loading = false;
        this.cdr.markForCheck(); 
      },
      error: (error) => {
        this.error = 'Failed to load products. Please  make sure JSON Server is running.';
        this.loading = false;
        console.error('Error loading products: ', error);
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filterProducts();
    this.cdr.markForCheck(); 
  }

  filterProducts(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  onProductClick(product: Product): void {
    this.router.navigate(['/products', product.id], {
      queryParams: { category: product.category }
    });
  }

  isProductInCart(productId: number): boolean {
    return this.productService.isInCart(productId);
  }
}
