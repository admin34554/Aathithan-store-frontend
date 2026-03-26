import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']})
export class CustomerComponent implements OnInit {

customers: Customer[] = [];
customerform: FormGroup;
editMode: boolean = false;
editId: number | null = null;
activeTab: string = 'details';

constructor(
  private customerService: CustomerService,
  private fb: FormBuilder
)
{
  this.customerform = this.fb.group({
    id: [''],
    fullName: ['', Validators.required],
    doorNo: [''],
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
    type: ['', Validators.required]
  });
}
  ngOnInit(): void {
    this.loadCustomers();
  }

loadCustomers() {
  this.customerService.getCustomers().subscribe({
    next: (data) => {
      this.customers = data;
    },
    error: (err) => {
      console.error("Error loading customers", err);
    }
  });
}

submitForm() {

  if (this.customerform.invalid) {
    return;
  }

  const customerData : Customer ={ ...this.customerform.value,
  id : null};

  this.customerService.addCustomer(customerData).subscribe({
    next: (res) => {
      console.log("Customer Saved", res);
      alert("Customer Saved Successfully");
      this.resetForm();
    },
    error: (err) => {
      console.error("Error saving customer", err);
    }
  });

}

  editCustomer(customer: Customer) {
    this.editMode = true;
    this.editId = customer.id || null;
    this.customerform.patchValue(customer);
  }

  deleteCustomer(id: number) {
    if(confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id)
        .subscribe(() => this.loadCustomers());
    }
  }

  resetForm() {
    this.customerform.reset();
    this.editMode = false;
    this.editId = null;
  }

}
