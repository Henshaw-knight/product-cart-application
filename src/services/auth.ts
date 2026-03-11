import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser!: boolean;

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Exposed as observable for components
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly USER_EMAIL_KEY = 'userEmail';

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const email = this.getCurrentUser();
      if (email) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  /**
   * Login user - store email in localStorage and update state
   */
  login(email: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.USER_EMAIL_KEY, email);
      this.isAuthenticatedSubject.next(true);
      console.log('User logged in: ', email);
    } catch (error) {
      console.error('Error storing user email: ', error);
    }
  }


  /**
   * Logout user - clear localStorage and update state
   */
  logout(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(this.USER_EMAIL_KEY);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  }


  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getCurrentUser();
  }


  /**
   * Get current user email
   */
  getCurrentUser(): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem(this.USER_EMAIL_KEY);
    } catch (error) {
      console.error('Error reading user email: ', error);
      return null;
    }
  }


  /**
   * Get authentication state
   */
  getAuthState(): boolean {
    return this.isAuthenticatedSubject.value;
  }






  
}
