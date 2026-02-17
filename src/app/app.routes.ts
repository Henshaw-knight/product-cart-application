import { Routes } from '@angular/router';
import { ProductList } from '../components/product-list/product-list';
import { ProductDetail } from '../components/product-detail/product-detail';
import { Cart } from '../components/cart/cart';
import { NotFound } from '../components/not-found/not-found';
import { ProductForm } from '../components/product-form/product-form';

export const routes: Routes = [
    { path: '', component: ProductList },
    { path: 'products', component: ProductList },
    { path: 'products/new', component: ProductForm },
    { path: 'products/:id', component: ProductDetail },
    { path: 'cart', component: Cart },
    { path: '404', component: NotFound },
    { path: '**', redirectTo: '404' }
];
