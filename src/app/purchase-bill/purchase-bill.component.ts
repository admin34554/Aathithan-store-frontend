import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseBillService } from '../services/purchaseBill.service';

@Component({
  selector: 'app-purchase-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css']
})
export class PurchaseBillComponent implements OnInit {

  purchaseBillForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private purchaseBillService: PurchaseBillService
  ) {
    this.purchaseBillForm = this.fb.group({
      name: [''],
      taxType: [''],
      brokerId: [null],
      purchaseType: [''],
      poNo: [''],
      purchaseBillDate: [''],
      custBillDate: [''],
      remarks: [''],
      items: this.fb.array([]) // ✅ IMPORTANT
    });
  }

  ngOnInit(): void {
    this.addRow(); // ✅ ADD ONE ROW BY DEFAULT
  }

  // ✅ GET FORM ARRAY
  get items(): FormArray {
    return this.purchaseBillForm.get('items') as FormArray;
  }

  // ✅ CREATE ROW
  createItem(): FormGroup {
    return this.fb.group({
      productCode: [''],
      itemName: [''],
      pRate: [''],
      balanceQuantity: [''],
      quantity: [''],
      rate: [''],
      brComm: [''],
      brTotal: ['']
    });
  }

  // ✅ ADD ROW
  addRow() {
    this.items.push(this.createItem());
  }

  // ✅ REMOVE ROW
  removeRow(index: number) {
    this.items.removeAt(index);
  }

  // SAVE
  savePurchaseBill() {

  if (this.purchaseBillForm.invalid) {
    return;
  }

  const formValue = this.purchaseBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    brokerId: formValue.brokerId ? { id: Number(formValue.brokerId) } : null
  };

  console.log("FINAL PAYLOAD", payload);

  this.purchaseBillService.addPurchaseBill(payload).subscribe({

    next: (res) => {
      console.log("Purchase Bill Saved", res);
      alert("Purchase Bill Saved Successfully");
      this.purchaseBillForm.reset();
    },

    error: (err) => {
      console.error("Error saving purchase bill", err);
    }

  });

}

  cancelForm() {
    this.purchaseBillForm.reset();
    this.items.clear();
    this.addRow();
  }
}