import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';


/**
 * Auth Interceptor - Adds user email to all HTTP requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  // If user is logged in, email is added to request header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });

    return next(clonedRequest);
  }

  return next(req);
};
