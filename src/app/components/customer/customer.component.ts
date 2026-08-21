import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Customer, CustomerService } from '../../services/customer.service';
import { CompanyContextService } from '../../services/company-context.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];

  customerform: FormGroup;

  editMode = false;
  viewMode = false;

  customerId!: number;
  editId: number | null = null;

  activeTab = 'details';

  constructor(
    private customerService: CustomerService,
    private companyContextService: CompanyContextService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    const lang = localStorage.getItem('lang') || 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(lang);

    this.customerform = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: [''],
      doorNumber: [''],
      area: [''],
      street: [''],
      city: [''],
      state: [''],
      pinCode: [''],
      contactPerson: [''],
      cell: [''],
      phone: [''],
      gstIn: [''],
      aadhar: [''],
      sugarLicense: [''],
      creditPeriod: [''],
      creditLimit: [''],
      companyMaster: this.fb.group({
        id: ['']
      }),
      type: ['', Validators.required],
      active: [false]
    });
  }

  ngOnInit(): void {

    const mode = this.route.snapshot.url[1]?.path;

    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    if (mode === 'view') {

      this.viewMode = true;
      this.loadCustomer(this.customerId);

    } else if (mode === 'edit') {

      this.editMode = true;
      this.loadCustomer(this.customerId);

    }

  }

  loadCustomer(id: number) {

    this.customerService.getCustomerById(id).subscribe({

      next: (res) => {

        this.customerform.patchValue({

          id: res.id,
          name: res.name,
          code: res.code,
          doorNumber: res.doorNumber,
          area: res.area,
          street: res.street,
          city: res.city,
          state: res.state,
          pinCode: res.pinCode,
          contactPerson: res.contactPerson,
          cell: res.cell,
          phone: res.phone,
          gstIn: res.gstIn,
          aadhar: res.aadhar,
          sugarLicense: res.sugarLicense,
          creditPeriod: res.creditPeriod,
          creditLimit: res.creditLimit,
          type: res.type,
          active: res.active

        });

        if (this.viewMode) {
          this.customerform.disable();
        }

      }

    });

  }

submitForm() {

  if (this.customerform.invalid) {
    return;
  }

  const form = this.customerform.getRawValue();

  const selectedCompany = this.companyContextService.getCompany();

  const customerData: Customer = {
    ...form,
    companyMaster: {
      id: selectedCompany?.id
    }
  };

  if (this.editMode) {

    this.customerService
      .updateCustomer(this.customerId, customerData)
      .subscribe({
        next: () => {
          alert('Customer Updated Successfully');
          this.router.navigate(['/customer-list']);
        }
      });

  } else {

    this.customerService
      .addCustomer(customerData)
      .subscribe({
        next: () => {
          alert('Customer Saved Successfully');
          this.resetForm();
        }
      });

  }

}

  editCustomer(customer: Customer) {

    this.editMode = true;
    this.editId = customer.id || null;
    this.customerform.patchValue(customer);

  }

  deleteCustomer(id: number) {

    if (confirm('Are you sure you want to delete this customer?')) {

      this.customerService
        .deleteCustomer(id)
        .subscribe(() => this.loadCustomer(this.customerId));

    }

  }

  resetForm() {

    this.customerform.reset();

    this.activeTab = 'details';

  }

}