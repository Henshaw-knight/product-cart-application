import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Product } from '../product-card/product-card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Subject, takeUntil } from 'rxjs';
import { State } from '../../services/state';
import { AppError } from '../../services/error-handler';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private stateService = inject(State);
  private destroy$ = new Subject<void>();

  product: Product | null = null;
  category = '';
  errorMessage = '';

  loading$ = this.stateService.loading$;



  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.category = this.route.snapshot.queryParams['category'] || '';
    this.loadProduct(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.errorMessage = '';
    
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error: AppError) => {
          this.errorMessage = error.message;
        }
      });
  }

  addToCart(): void {
    if (this.product) {
      this.stateService.addToCart(this.product);
    }
  }

  removeFromCart(): void {
    if (this.product) {
      this.stateService.removeFromCart(this.product.id!);
    }
  }

  isInCart(): boolean {
    return this.product ? this.stateService.isInCart(this.product.id!) : false;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
