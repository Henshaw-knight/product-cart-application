import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse, LoginPayload, SignupPayload } from '../models/auth.model';
import { ApiResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private httpClient = inject(HttpClient);
  private isBrowser!: boolean;

  private baseUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Exposed as observable for components
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  signup(payload: SignupPayload): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${this.baseUrl}/signup`,
      payload,
    );
  }

  login(payload: LoginPayload): Observable<string> {
    return this.httpClient
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, payload)
      .pipe(
        map((response) => {
          const token = response.data?.access_token ?? '';
          this.storeToken(token);
          this.isAuthenticatedSubject.next(true);
          return token;
        }),
      );
    }


  /**
   * Logout user - clear localStorage and update state
   */
  logout(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(this.TOKEN_KEY);
      this.isAuthenticatedSubject.next(false);
      void this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  }


  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getToken();
  }


  getToken(): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error reading token', error);
      return null;
    }
  }


  getCurrentUser(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email as string;
    } catch {
      return null;
    }
  }
  

  /**
   * Get authentication state
   */
  getAuthState(): boolean {
    return this.isAuthenticatedSubject.value;
  }


  private storeToken(token: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token: ', error);
    }
  }  
}
