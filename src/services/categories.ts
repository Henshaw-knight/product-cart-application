import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/product.model';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = `${environment.apiUrl}/categories`;
  private http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this.http
    .get<ApiResponse<Category[]>>(this.baseUrl)
    .pipe(map((response) => response.data ?? []));
  }  
}
