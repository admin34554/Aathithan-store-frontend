import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


export interface Supplier {
  id?: number;
  doorNo: string;
  street: string;
  city: string;
  state: string;
  pinCode: number;
  contact: string;
  mobile: string;
  phone: string;
  gstNo: string;
  panNo: string;
  aadhar: number;
  creditPeriod: number;
  type: string;
  active: boolean;

}
@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private baseUrl = `${environment.apiUrl}/api/v1/supplier-master`;

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/list-view`);
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.baseUrl, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }
  
}
