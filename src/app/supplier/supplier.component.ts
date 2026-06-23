import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier, SupplierService } from '../services/supplier.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']})
export class SupplierComponent implements OnInit {

suppliers: Supplier[] = [];
supplierform: FormGroup;
editMode: boolean = false;
editId: number | null = null;
activeTab: string = 'details';

constructor(
  private supplierService: SupplierService,
  private fb: FormBuilder,
  private translate: TranslateService
)
{

    const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);

  this.supplierform = this.fb.group({
    id: [''],
    doorNo: [''],
    street: [''], 
    city: [''],
    state: [''],
    pinCode: [''],
    contact: [''],
    mobile: [''],
    phone: [''],
    gstIn: [''],
    aadhar: [''],
    creditPeriod: [''],
    type: ['', Validators.required],
    active: [false],
    accountNo: [''],
    bankName: [''],
    branch: [''],
    ifscCode: [''],
    remarks: ['']
  });
}
  ngOnInit(): void {
    this.loadSuppliers();
  }

loadSuppliers() {
  this.supplierService.getSuppliers().subscribe({
    next: (data) => {
      this.suppliers = data;
    },
    error: (err) => {
      console.error("Error loading suppliers", err);
    }
  });
}

submitForm() {

  if (this.supplierform.invalid) {
    return;
  }

  const formValue = this.supplierform.value;

  const supplierData = {
    id: null,

    contact: formValue.contact,
    aadharNo: formValue.aadhar,
    gstNo: formValue.gstIn,
    phone: formValue.phone,
    mobile: formValue.mobile,
    creditPeriod: formValue.creditPeriod,

    doorNo: formValue.doorNo,
    street: formValue.street,
    city: formValue.city,
    state: formValue.state,
    pinCode: formValue.pinCode,

    type: formValue.type,
    active: formValue.active,

    bankDetails: [
      {
        accountNo: formValue.accountNo,
        bankName: formValue.bankName,
        branch: formValue.branch,
        ifscCode: formValue.ifscCode,
        remarks: formValue.remarks
      }
    ]
  };

  console.log('Payload', supplierData);

  this.supplierService.addSupplier(supplierData as any).subscribe({
    next: (res) => {
      console.log("Supplier Saved", res);
      alert("Supplier Saved Successfully");
      this.resetForm();
      this.loadSuppliers();
    },
    error: (err) => {
      console.error("Error saving supplier", err);
    }
  });
}

  editSupplier(supplier: Supplier) {
    this.editMode = true;
    this.editId = supplier.id || null;
    this.supplierform.patchValue(supplier);
  }

  deleteSupplier(id: number) {
    if(confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id)
        .subscribe(() => this.loadSuppliers());
    }
  }

  resetForm() {
    this.supplierform.reset();
    this.editMode = false;
    this.editId = null;
  }

}
