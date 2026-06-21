import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Company {
  id?: number;
  name: string;
  gstIn: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = `${environment.apiUrl}/api/v1/company-master`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE COMPANY
  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, company);
  }

  // UPDATE
  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/${id}`, company);
  }

  // DELETE
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  

}