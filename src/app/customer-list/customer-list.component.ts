import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../services/customer.service';
import { CustomerRoutingModule } from "../modules/customer/customer-routing.module";
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CompanyContextService } from '../services/company-context.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerRoutingModule, RouterModule, TranslateModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})

export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private customerService: CustomerService, private translate: TranslateService, private companyContextService: CompanyContextService) {

      const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
  }

ngOnInit(): void {

  this.companyContextService.selectedCompany$
    .subscribe(company => {

      if (company?.id) {

        this.customerService
          .getCustomersByCompany(company.id)
          .subscribe(data => {

            this.customers = data;
            this.filteredCustomers = data;
            this.currentPage = 1;

          });

      }

    });

}

 loadCustomers() {

  const company =
    this.companyContextService.getCompany();

  if (!company) {
    return;
  }

  this.customerService
      .getCustomersByCompany(company.id!)
      .subscribe(data => {

        this.customers = data;
        this.filteredCustomers = data;

      });
}



  searchCustomer() {
    this.filteredCustomers = this.customers.filter(c =>
      c.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      c.type?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedCustomers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredCustomers.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}