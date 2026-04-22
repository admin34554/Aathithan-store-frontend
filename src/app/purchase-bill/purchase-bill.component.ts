import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseBillService } from '../services/purchaseBill.service';
import { CustomerService } from '../services/customer.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductTypeService } from '../services/productType.service';
import { ProductService } from '../services/product.service';
import { TaxService } from '../services/tax.service';
import { BrokerService } from '../services/broker.service';

@Component({
  selector: 'app-purchase-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css']
})
export class PurchaseBillComponent implements OnInit {
  onKeyDown(event: KeyboardEvent) {

  if (!this.customers.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.customerSelectedIndex =
      this.customerSelectedIndex < this.customers.length - 1
        ? this.customerSelectedIndex + 1
        : 0;
  }

  else if (event.key === 'ArrowUp') {
    event.preventDefault();
    this.customerSelectedIndex =
      this.customerSelectedIndex > 0
        ? this.customerSelectedIndex - 1
        : this.customers.length - 1;
  }

  else if (event.key === 'Enter') {
    event.preventDefault();
    if (this.customerSelectedIndex >= 0) {
      this.selectCustomer(this.customers[this.customerSelectedIndex]);
    }
  }
}
selectCustomer(customer: any) {

  this.purchaseBillForm.get('name')?.setValue(customer.fullName, { emitEvent: false });

  this.customers = [];
  this.customerSelectedIndex = -1;

  setTimeout(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
}

  purchaseBillForm: FormGroup;
   customers: any[] = [];
  products: any[] = [];
  tax: any[] = [];
  brokers: any[] = [];
  filteredProducts: any[][] = []; 
  filteredTaxes: any[][] = [];
  taxSelectedIndex: number[] = [];
// ✅ Customer dropdown (single)
customerSelectedIndex: number = -1;

// ✅ Product dropdown (per row)
productSelectedIndex: number[] = [];  

  constructor(
    private fb: FormBuilder,
    private purchaseBillService: PurchaseBillService,
        private brokerService: BrokerService,
        private customerService: CustomerService,
        private productTypeService: ProductTypeService,
        private productService: ProductService,
        private taxService: TaxService
  ) {
    this.purchaseBillForm = this.fb.group({
      name: [''],
      taxType: [''],
      brokerId: [null],
      purchaseType: [''],
      poNo: [''],
      purchaseBillDate: [''],
      purchaseBillNo: [''],
      custBillDate: [''],
      remarks: [''],
      items: this.fb.array([]) // ✅ IMPORTANT
    });
  }

  ngOnInit(): void {
    this.addRow(); // ✅ ADD ONE ROW BY DEFAULT
    this.loadProducts();
    this.loadTaxes();
    this.loadBrokers();
    this.purchaseBillForm.get('name')?.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
         .subscribe(value => {
          this.searchCustomers(value);
        });
  }


  loadProducts() {
  this.productTypeService.getProductTypes().subscribe(res => {
    this.products = res;
  });
}

  loadBrokers() {
    this.brokerService.getBroker().subscribe(res => {
      this.brokers = res;
    });
  }

   loadTaxes() {
    this.taxService.getTaxes().subscribe(res => {
      this.tax = res;
    });
  }

    searchCustomers(name: string) {
  if (!name || name.trim().length < 2) {
    this.customers = [];
    return;
  }

  this.customerService.searchCustomers(name).subscribe(res => {
    this.customers = res;
  });
}

onProductSearch(event: any, rowIndex: number) {
  const value = event.target.value;

  if (!value || value.trim().length < 2) {
    this.filteredProducts[rowIndex] = [];
    return;
  }

  this.productService.searchProducts(value).subscribe(res => {
    this.filteredProducts[rowIndex] = res;
    this.productSelectedIndex[rowIndex] = -1;
  });
}

onProductKeyDown(event: KeyboardEvent, rowIndex: number) {

  const list = this.filteredProducts[rowIndex] || [];

  if (!list.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.productSelectedIndex[rowIndex] =
      (this.productSelectedIndex[rowIndex] + 1) % list.length;
  }

  else if (event.key === 'ArrowUp') {
    event.preventDefault();
    this.productSelectedIndex[rowIndex] =
      (this.productSelectedIndex[rowIndex] - 1 + list.length) % list.length;
  }

  else if (event.key === 'Enter') {
    event.preventDefault();
    if (this.productSelectedIndex[rowIndex] >= 0) {
      this.selectProduct(list[this.productSelectedIndex[rowIndex]], rowIndex);
    }
  }
}

selectProduct(product: any, rowIndex: number) {

  const row = this.items.at(rowIndex);

  row.patchValue({
    productCode: product.code,
    itemName: product.name,
    rate: product.retailRate
  });

  this.filteredProducts[rowIndex] = [];
}

onTaxSearch(event: any, rowIndex: number) {
  const value = event.target.value;

  if (!value || value.trim().length < 2) {
    this.filteredTaxes[rowIndex] = [];
    return;
  }

  this.taxService.searchTax(value).subscribe(res => {
    this.filteredTaxes[rowIndex] = res;
    this.taxSelectedIndex[rowIndex] = -1;
  });
}

onTaxKeyDown(event: KeyboardEvent, rowIndex: number) {

  const list = this.filteredTaxes[rowIndex] || [];

  if (!list.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.taxSelectedIndex[rowIndex] =
      (this.taxSelectedIndex[rowIndex] + 1) % list.length;
  }

  else if (event.key === 'ArrowUp') {
    event.preventDefault();
    this.taxSelectedIndex[rowIndex] =
      (this.taxSelectedIndex[rowIndex] - 1 + list.length) % list.length;
  }

  else if (event.key === 'Enter') {
    event.preventDefault();
    if (this.taxSelectedIndex[rowIndex] >= 0) {
      this.selectTax(list[this.taxSelectedIndex[rowIndex]], rowIndex);
    }
  }
}

selectTax(tax: any, rowIndex: number) {

  const row = this.items.at(rowIndex);

  row.patchValue({
    taxType: tax.name,
    tax: Number(tax.salestaxPercentage)
  }, { emitEvent: false });

  this.filteredTaxes[rowIndex] = [];
}

addRow() {
  const row = this.createItem();

  row.valueChanges.subscribe(val => {

    const rate = Number(val.rate) || 0;
    const qty = Number(val.quantity) || 0;
    const comm = Number(val.brComm) || 0;

    const amount = rate * qty;

    // Commission %
    const commission = amount * comm / 100;

    const brTotal = amount + commission;

    row.patchValue({
      brTotal: brTotal.toFixed(2)
    }, { emitEvent: false });

  });

  this.items.push(row);

  this.filteredProducts.push([]);
  this.productSelectedIndex.push(-1);
}

  // ✅ REMOVE ROW
 removeRow(index: number) {
  this.items.removeAt(index);

  // ✅ keep arrays in sync
  this.filteredProducts.splice(index, 1);
  this.productSelectedIndex.splice(index, 1);
}

onCustomerBlur() {
  setTimeout(() => {
    this.customers = [];
    this.customerSelectedIndex = -1;
  }, 200);
}

onTaxBlur(i: number) {
  setTimeout(() => {

    const row = this.items.at(i);
    const enteredValue = row.value.taxType;

    const matchedTax = this.tax.find(t => t.name === enteredValue);

    if (matchedTax) {
      row.patchValue({
        tax: Number(matchedTax.salestaxPercentage)
      }, { emitEvent: false });
    }

    this.filteredTaxes[i] = [];
    this.taxSelectedIndex[i] = -1;

  }, 200);
}

onProductBlur(i: number) {
  setTimeout(() => {
    this.filteredProducts[i] = [];
    this.productSelectedIndex[i] = -1;
  }, 200);
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


  // SAVE
  savePurchaseBill() {

  if (this.purchaseBillForm.invalid) {
    return;
  }

  const formValue = this.purchaseBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    purchaseBillNo: null, // Let backend generate the bill number
    brokerId: formValue.brokerId ? { id: Number(formValue.brokerId) } : null
  };

  console.log("FINAL PAYLOAD", payload);

  this.purchaseBillService.addPurchaseBill(payload).subscribe({

    next: (res) => {
      console.log("Purchase Bill Saved", res);
      alert("Purchase Bill Saved Successfully");
      this.purchaseBillForm.reset();
    this.purchaseBillForm.patchValue({
        purchaseBillNo: res.purchaseBillNo
      });

      alert("Saved: " + res.purchaseBillNo);

      setTimeout(() => {
        this.purchaseBillForm.reset();
        this.addRow();
      }, 5000);
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