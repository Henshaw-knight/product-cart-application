import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';


function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const urlPattern = /^(https?:\/\/)([a-zA-z0-9-]+\.)+[a-zA-z]{2,}(\/\s*)?$/;
  return urlPattern.test(control.value) ? null : { invalidUrl: true };
}

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  // Available categories
  categories = ['Electronics', 'Accessories', 'Clothing', 'Books', 'Home & Garden'];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';


  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(50)]),
    category: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required, urlValidator]),
    inStock: new FormControl(true),
    rating: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(5)]),
    properties: new FormArray([this.createPropertyGroup()])
  });

  ngOnInit(): void { }

  // Create a FormGroup for each property
  createPropertyGroup(): FormGroup {
    return new FormGroup({
      color: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required])
    });
  }

  // Getter for easy access to FormArray
  get properties(): FormArray {
    return this.productForm.get('properties') as FormArray;
  }

  // Getter for each property group
  getPropertyGroup(index: number): FormGroup {
    return this.properties.at(index) as FormGroup;
  }

  // Add new property
  addProperty(): void {
    this.properties.push(this.createPropertyGroup());
  }

  // Remove property (at least 1 is kept)
  removeProperty(index: number): void {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  // Helper to check if a field has errors
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper to check if FormArray field has errors
  isPropertyFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.getPropertyGroup(index).get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper to get field errors
  getFieldErrors(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${min} characters`;
    }
    if (field.errors['min']) {
      const min = field.errors['min'].min;
      return `${this.getFieldLabel(fieldName)} must be at least ${min}`;
    }
    if (field.errors['max']) return `${this.getFieldLabel(fieldName)} cannot exceed 5`;
    if (field.errors['invalidUrl']) return 'Please enter a valid URL (e.g. https://example.com)';

    return '';
  }

  // Get property field errors
  getPropertyFieldErrors(index: number, fieldName: string): string {
    const field = this.getPropertyGroup(index).get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    return '';
  }

  // Helper for field labels
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      description: 'Description',
      price: 'Price',
      category: 'Category',
      imageUrl: 'Image URL',
      rating: 'Rating'
    };
    return labels[fieldName] || fieldName;
  }

  // Form submission
  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show errors
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.productForm.value;

    const newProduct = {
      name: formValue.name!,
      description: formValue.description!,
      price: Number(formValue.price),
      category: formValue.category!,
      imageUrl: formValue.imageUrl!,
      inStock: formValue.inStock ?? true,
      rating: Number(formValue.rating),
      properties: formValue.properties
    };

    this.productService.createProduct(newProduct).subscribe({
      next: (product) => {
        this.isSubmitting = false;
        this.successMessage = `"${product.name}" has been added successfully!`;
        this.productForm.reset();

        // Reset properties to one empty group
        while (this.properties.length > 1) {
          this.properties.removeAt(1);
        }
        this.getPropertyGroup(0).reset();

        // Navigate back to products after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create product. Please try again.';
        console.error('Error creating product:', error);
      }
    });
  }

  // Reset form
  onReset(): void {
    this.productForm.reset({ inStock: true });
    while (this.properties.length > 1) {
      this.properties.removeAt(1);
    }
    this.getPropertyGroup(0).reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

}
