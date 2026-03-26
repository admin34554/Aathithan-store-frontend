import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier, SupplierService } from '../services/supplier.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  private fb: FormBuilder
)
{
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
    type: ['', Validators.required]
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

  const supplierData : Supplier ={ ...this.supplierform.value,
  id : null};

  this.supplierService.addSupplier(supplierData).subscribe({
    next: (res) => {
      console.log("Supplier Saved", res);
      alert("Supplier Saved Successfully");
      this.resetForm();
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
