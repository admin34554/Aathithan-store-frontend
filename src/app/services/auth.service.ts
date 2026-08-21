import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:9090/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(request: any) {
    return this.http.post<LoginResponse>(`${this.api}/login`, request);
  }
}