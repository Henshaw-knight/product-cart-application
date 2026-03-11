import { Routes } from '@angular/router';
import { ProductList } from '../components/product-list/product-list';
import { ProductDetail } from '../components/product-detail/product-detail';
import { Cart } from '../components/cart/cart';
import { NotFound } from '../components/not-found/not-found';
import { ProductForm } from '../components/product-form/product-form';
import { Login } from '../components/login/login';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
    // Public route - no guard
    { path: 'login', component: Login},

    // Protected routes - require authentication
    { path: '', component: ProductList, canActivate: [authGuard] },
    { path: 'products', component: ProductList, canActivate: [authGuard] },
    { path: 'products/new', component: ProductForm, canActivate: [authGuard] },
    { path: 'products/:id', component: ProductDetail, canActivate: [authGuard] },
    { path: 'cart', component: Cart, canActivate: [authGuard] },

    // Public routes - no guard
    { path: '404', component: NotFound },
    { path: '**', redirectTo: '404' }
];
