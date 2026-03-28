import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


export interface Customer {
  id?: number;
  code: string;
  fullName: string;
  doorNo: string;
  street: string;
  city: string;
  state: string;
  pinCode: number;
  contactPerson: string;
  cell: string;
  phone: string;
  gstIn: string;
  aadhar: number;
  sugarLicense: string;
  creditPeriod: number;
  creditLimit: number;
  type: string;
  active: boolean;


}
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = `${environment.apiUrl}/api/v1/customer-master`;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/list-view`);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }
  
}
