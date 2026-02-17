import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  properties?: Property[];
}

export interface Property {
  colour: string;
  weight: string;
}

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  @Input() isSelected: boolean = false;
  @Output() productClick = new EventEmitter<Product>();

  onCardClick(): void {
    this.productClick.emit(this.product);
  }

}
