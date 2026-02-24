import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SearchInput } from '../search-input/search-input';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { filter } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { State } from '../../services/state';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private stateService = inject(State);

  // Use of async pipe - no manual subscription needed
  cartCounts$ = this.stateService.cartCount$;


  // cartCount = 0;

  // private productService = inject(ProductService);
  // private router = inject(Router);

  // ngOnInit(): void {
  //   this.productService.cart$.subscribe(cart => {
  //     this.cartCount = cart.length;
  //   });
  // }
}
