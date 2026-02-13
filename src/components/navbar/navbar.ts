import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SearchInput } from '../search-input/search-input';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  cartCount = 0;
  // @Output() searchQueryChange = new EventEmitter<string>();
  // showSearch = true;


  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.productService.cart$.subscribe(cart => {
      this.cartCount = cart.length;
    });
  }

  // onSearchChange(query: string): void {
  //   this.searchQueryChange.emit(query);
  // }
}
