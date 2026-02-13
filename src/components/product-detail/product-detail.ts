import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Product } from '../product-card/product-card';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  category = '';
  loading = true;
  error = '';
  isInCart = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     const id = +params['id'];

  //     this.route.queryParams.subscribe(queryParameters => {
  //       this.category = queryParameters['category'] || '';
  //     });

  //     this.loadProduct(id);
  //   });

  //   this.productService.cart$.subscribe(() => {
  //     if (this.product) {
  //       this.isInCart = this.productService.isInCart(this.product.id);
  //     }
  //   });
  // }

  // loadProduct(id: number): void {
  //   this.loading = true;
  //   this.productService.getProductById(id).subscribe({
  //     next: (product) => {
  //       this.product = product;
  //       this.isInCart = this.productService.isInCart(product.id);
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       this.error = 'Product not found';
  //       this.loading = false;
  //       console.error('Error loading product:', error);
  //     }
  //   })
  // }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = +params['id'];
        this.loadProduct(id);
      });

    // Get category from query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(queryParams => {
        this.category = queryParams['category'] || '';
      });

    // Subscribe to cart changes
    this.productService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.product) {
          this.isInCart = this.productService.isInCart(this.product.id);
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    console.log('Loading product with ID:', id);
    this.loading = true;
    this.error = '';
    this.product = null;
    
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          // console.log('Product loaded:', product);
          this.product = product;
          this.isInCart = this.productService.isInCart(product.id);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.error = 'Product not found';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  addToCart(): void {
    if (this.product) {
      this.productService.addToCart(this.product);
    }
  }

  removeFromCart(): void {
    if (this.product) {
      this.productService.removeFromCart(this.product.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
