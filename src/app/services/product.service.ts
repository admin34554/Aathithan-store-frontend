import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


export interface Product {
  id?: number;
  code: string;
  name: string;
  type: string;
  brandName: string;
  weight: number;
  retailRate: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private apiUrl = `${environment.apiUrl}/api/v1/product-master`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/list-view`);
  }

  // SAVE PRODUCT
  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // UPDATE
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // DELETE
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProducts(value: string) {
  return this.http.get<any[]>(`${this.apiUrl}/search?code=${value}`);
}

}