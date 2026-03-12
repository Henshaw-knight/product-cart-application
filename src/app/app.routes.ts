import { Routes } from '@angular/router';
import { ProductList } from '../components/product-list/product-list';
import { ProductDetail } from '../components/product-detail/product-detail';
import { Cart } from '../components/cart/cart';
import { NotFound } from '../components/not-found/not-found';
import { ProductForm } from '../components/product-form/product-form';
import { Login } from '../components/login/login';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
    // Public route - no guard (Lazy loaded)
    { path: 'login',
      loadComponent: () => import('../components/login/login')
        .then(m => m.Login)
    },

    // Protected routes - require authentication (Lazy loaded)
    { path: '',
      loadComponent: () => import('../components/product-list/product-list')
        .then(m => m.ProductList), canActivate: [authGuard]
    },

    { path: 'products',
      loadComponent: () => import('../components/product-list/product-list')
        .then(m => m.ProductList), canActivate: [authGuard]
    },

    { path: 'products/new',
      loadComponent: () => import('../components/product-form/product-form')
        .then(m => m.ProductForm), canActivate: [authGuard]
    },

    { path: 'products/:id',
      loadComponent: () => import('../components/product-detail/product-detail')
        .then(m => m.ProductDetail), canActivate: [authGuard]
    },

    { path: 'cart',
      loadComponent: () => import('../components/cart/cart')
        .then(m => m.Cart), canActivate: [authGuard]
    },

    // Public routes - no guard
    { path: '404',
      loadComponent: () => import('../components/not-found/not-found')
        .then(m => m.NotFound)
    },

    { path: '**', redirectTo: '404' }
];
