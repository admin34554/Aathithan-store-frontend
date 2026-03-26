import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CashBillService } from '../services/cashBill.service';
import { BrokerService } from '../services/broker.service';
import { LorryService } from '../services/lorry.service';

@Component({
  selector: 'app-cash-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cash-bill.component.html',
  styleUrls: ['./cash-bill.component.css']
})
export class CashBillComponent implements OnInit {

  cashBillForm: FormGroup;
  lorries: any[] = [];
  brokers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cashBillService: CashBillService,
    private lorryService: LorryService,
    private brokerService: BrokerService
  ) {
    this.cashBillForm = this.fb.group({
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
    return this.cashBillForm.get('items') as FormArray;
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
  saveCashBill() {

  if (this.cashBillForm.invalid) {
    return;
  }

  const formValue = this.cashBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    lorry: formValue.lorry ? { id: Number(formValue.lorry) } : null,
    broker: formValue.broker ? { id: Number(formValue.broker) } : null
  };

  console.log("FINAL PAYLOAD", payload);

  this.cashBillService.addCashBill(payload).subscribe({

    next: (res) => {
      console.log("Cash Bill Saved", res);
      alert("Cash Bill Saved Successfully");
      this.cashBillForm.reset();
    },

    error: (err) => {
      console.error("Error saving cash bill", err);
    }

  });

}

  cancelForm() {
    this.cashBillForm.reset();
    this.items.clear();
    this.addRow();
  }
}