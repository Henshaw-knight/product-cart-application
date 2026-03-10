import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SearchInput } from '../search-input/search-input';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { filter } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { State } from '../../services/state';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private stateService = inject(State);
  private authService = inject(AuthService);

  // Use of async pipe - no manual subscription needed
  cartCounts$ = this.stateService.cartCount$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  // Get current user email
  get currentUser(): string | null {
    return this.authService.getCurrentUser();
  }


  // Logout
  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
    }
  }
}
