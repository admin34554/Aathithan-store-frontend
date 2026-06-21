// company-context.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Company } from './company.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyContextService {

  private selectedCompanySubject =
    new BehaviorSubject<Company | null>(
      JSON.parse(localStorage.getItem('selectedCompany') || 'null')
    );

  selectedCompany$ = this.selectedCompanySubject.asObservable();

  setCompany(company: Company) {
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    this.selectedCompanySubject.next(company);
  }

  getCompany(): Company | null {
    return this.selectedCompanySubject.value;
  }
}