import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  errorMessage = '';
  isSubmitting = false;
  returnUrl: string = '/products';


  // Reactive form with validation
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/products';
    console.log(this.returnUrl);

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Helper to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper to get field errors
  getFieldErrors(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${fieldName === 'email' ? 'Email' : 'Password'} is required`;
    }

    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return `Password must be at least ${min} characters`;
    }

    return '';
  }


  // Form Submission
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;


    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        // Login successful - store email and navigate
        this.authService.login(email);
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = 'Invalid credentials. Please try again';
        this.isSubmitting = false;
      }
    }, 500); // Simulate API delay
  }

}
