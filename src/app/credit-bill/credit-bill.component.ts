import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrokerService } from '../services/broker.service';
import { LorryService } from '../services/lorry.service';
import { CreditBillService } from '../services/creditBill.service';

@Component({
  selector: 'app-credit-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credit-bill.component.html',
  styleUrls: ['./credit-bill.component.css']
})
export class CreditBillComponent implements OnInit {

  creditBillForm: FormGroup;
  lorries: any[] = [];
  brokers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private creditBillService: CreditBillService,
    private lorryService: LorryService,
    private brokerService: BrokerService
  ) {
    this.creditBillForm = this.fb.group({
      name: [''],
      lorry: [''],
      broker: [''],
      billNo: [''],
      billDate: [''],
      remarks: [''],
      items: this.fb.array([]) // ✅ IMPORTANT
    });
  }

  ngOnInit(): void {
    this.addRow(); // ✅ ADD ONE ROW BY DEFAULT
    this.loadLorries();
    this.loadBrokers();
  }

  loadLorries() {
    this.lorryService.getLorry().subscribe(res => {
      this.lorries = res;
    });
  }

  loadBrokers() {
    this.brokerService.getBroker().subscribe(res => {
      this.brokers = res;
    });
  }

  // ✅ GET FORM ARRAY
  get items(): FormArray {
    return this.creditBillForm.get('items') as FormArray;
  }

  // ✅ CREATE ROW
  createItem(): FormGroup {
    return this.fb.group({
      productCode: [''],
      itemName: [''],
      taxType: [''],
      rate: [''],
      quantity: [''],
      tax: [''],
      total: [''],
      brNo: [''],
      surCh: ['']
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
  saveCreditBill() {

  if (this.creditBillForm.invalid) {
    return;
  }

  const formValue = this.creditBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    lorry: formValue.lorry ? { id: Number(formValue.lorry) } : null,
    broker: formValue.broker ? { id: Number(formValue.broker) } : null
  };

  console.log("FINAL PAYLOAD", payload);

  this.creditBillService.addCreditBill(payload).subscribe({

    next: (res) => {
      console.log("Credit Bill Saved", res);
      alert("Credit Bill Saved Successfully");
      this.creditBillForm.reset();
    },

    error: (err) => {
      console.error("Error saving credit bill", err);
    }

  });

}

  cancelForm() {
    this.creditBillForm.reset();
    this.items.clear();
    this.addRow();
  }
}