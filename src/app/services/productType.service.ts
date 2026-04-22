import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';


export interface ProductType {
  id?: number;
  code: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductTypeService {

  private apiUrl = `${environment.apiUrl}/api/v1/product-type`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.apiUrl}/list-view`);
  }

  // SAVE PRODUCT
  saveProductType(product: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, product);
  }

  // UPDATE
  updateProductType(id: number, product: ProductType): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.apiUrl}/${id}`, product);
  }

  // DELETE
  deleteProductType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}