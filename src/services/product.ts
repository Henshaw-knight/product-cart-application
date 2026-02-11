import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Product {
  apiURL = 'http://localhost:3000'
  private httpClient = inject(HttpClient);

  getAllProducts() {
    return this.httpClient.get(`${this.apiURL}/products`);
  }

  getProductsById(id: string) {

  }
  
  isInCart(id: string): boolean {
    return true
  }
}
