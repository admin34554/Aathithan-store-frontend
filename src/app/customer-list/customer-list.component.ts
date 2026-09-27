import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../services/customer.service';
import { CustomerRoutingModule } from "../modules/customer/customer-routing.module";
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CompanyContextService } from '../services/company-context.service';
import { Router } from '@angular/router';

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
  selectedCustomer: Customer | null = null;
  selectedIndex = 0;

  currentPage = 1;
  pageSize = 5;

  constructor(private customerService: CustomerService, private translate: TranslateService, private companyContextService: CompanyContextService, private router: Router) {

      const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
  }

  selectCustomer(customer: Customer) {
  this.selectedCustomer = customer;
}


@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {

  const target = event.target as HTMLElement;

  // Allow normal typing inside search/input fields
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  ) {
    return;
  }

  const customers = this.paginatedCustomers;

  if (!customers || customers.length === 0) {
    return;
  }

  // DOWN ARROW
  if (event.key === 'ArrowDown') {

    event.preventDefault();

    if (this.selectedIndex < customers.length - 1) {
      this.selectedIndex++;
    } 
    else if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.selectedIndex = 0;
    }

    return;
  }

  // UP ARROW
  if (event.key === 'ArrowUp') {

    event.preventDefault();

    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } 
    else if (this.currentPage > 1) {
      this.currentPage--;
      this.selectedIndex = this.pageSize - 1;

      // Make sure index is valid on the previous page
      if (this.selectedIndex >= this.paginatedCustomers.length) {
        this.selectedIndex = this.paginatedCustomers.length - 1;
      }
    }

    return;
  }

      // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/customer']);

  return;
}

  // E = EDIT
  if (event.key.toLowerCase() === 'e') {

    event.preventDefault();

    const customer = customers[this.selectedIndex];

    if (customer?.id) {
      this.editCustomer(customer.id);
    }

    return;
  }

  // V = VIEW
  if (event.key.toLowerCase() === 'v') {

    event.preventDefault();

    const customer = customers[this.selectedIndex];

    if (customer?.id) {
      this.viewCustomer(customer.id);
    }

    return;
  }

  // ENTER = VIEW
  if (event.key === 'Enter') {

    event.preventDefault();

    const customer = customers[this.selectedIndex];

    if (customer?.id) {
      this.viewCustomer(customer.id);
    }

    return;
  }
}

get totalPages(): number {
  return Math.ceil(this.filteredCustomers.length / this.pageSize);
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


  viewCustomer(id:number){
    this.router.navigate(['/customer/view', id]);
  }

  editCustomer(id:number){
    this.router.navigate(['/customer/edit', id]);
  }


searchCustomer() {

  this.filteredCustomers = this.customers.filter(c =>
    c.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    c.type?.toLowerCase().includes(this.searchText.toLowerCase())
  );

  this.currentPage = 1;
  this.selectedIndex = 0;
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