import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';


/**
 * Auth Guard - Protects routes from unauthorized access
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (authService.isLoggedIn()) {
    console.log('Auth Guard: Access granted');
    return true;
  }

  // Not logged in - redirect to login
  console.log('Auth Guard: access denied, redirecting to login');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url} // Save where they wanted to go
  });
  return false;
};
