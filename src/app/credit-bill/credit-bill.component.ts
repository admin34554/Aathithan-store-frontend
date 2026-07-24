import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreditBillService } from '../services/creditBill.service';
import { BrokerService } from '../services/broker.service';
import { LorryService } from '../services/lorry.service';
import { CustomerService } from '../services/customer.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductTypeService } from '../services/productType.service';
import { ProductService } from '../services/product.service';
import { TaxService } from '../services/tax.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './credit-bill.component.html',
  styleUrls: ['./credit-bill.component.css']
})
export class CreditBillComponent implements OnInit {
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

  this.creditBillForm.get('name')?.setValue(customer.fullName, { emitEvent: false });

  this.customers = [];
  this.customerSelectedIndex = -1;

  setTimeout(() => {
    const input = document.querySelector('input[formControlName="name"]') as HTMLElement;
    input.blur();
  }, 0);
}

  creditBillForm: FormGroup;
  lorries: any[] = [];
  brokers: any[] = [];
  customers: any[] = [];
  products: any[] = [];
  tax: any[] = [];
  filteredProducts: any[][] = []; 
  filteredTaxes: any[][] = [];
  taxSelectedIndex: number[] = [];
// ✅ Customer dropdown (single)
customerSelectedIndex: number = -1;

// ✅ Product dropdown (per row)
productSelectedIndex: number[] = [];  
  constructor(
    private fb: FormBuilder,
    private creditBillService: CreditBillService,
    private lorryService: LorryService,
    private brokerService: BrokerService,
    private customerService: CustomerService,
    private productTypeService: ProductTypeService,
    private productService: ProductService,
    private taxService: TaxService,
    private translate: TranslateService
  ) {

      const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
    const today = new Date().toISOString().split('T')[0];

 this.creditBillForm = this.fb.group({

  name: [''],
  lorry: [''],
  broker: [''],
  billNo: [''],
  billDate: [today],
  remarks: [''],

  items: this.fb.array([])

});
  }

  ngOnInit(): void {
    this.addRow(); // ✅ ADD ONE ROW BY DEFAULT
    this.loadLorries();
    this.loadBrokers();
   this.loadProducts();
    this.loadTaxes();
     this.creditBillForm.get('name')?.valueChanges.pipe(
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

 const selectedCustomer = this.customers.find(
    c => c.fullName === name
  );

  if (selectedCustomer) {
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

loadBillByBillNo() {

  const billNo = this.creditBillForm.get('billNo')?.value;

  if (!billNo) return;

  this.creditBillService.getCreditBillByCreditBillId(billNo).subscribe({

    next: (res: any) => {

      console.log("Fetched Bill", res);

      // ✅ Clear existing rows
      this.items.clear();

      // ✅ Bind top fields
      this.creditBillForm.patchValue({
        name: res.name,
        billNo: res.billNo,
        billDate: res.billDate?.substring(0, 10),
        remarks: res.remarks,
        lorry: res.lorry?.id,
        broker: res.broker?.id
      });

      // ✅ Bind item rows
      if (res.items && res.items.length > 0) {

        res.items.forEach((item: any) => {

          const row = this.createItem();

          row.patchValue({
            productCode: item.productCode,
            itemName: item.itemName,
            taxType: item.tax,
            rate: item.rate,
            quantity: item.quantity,
            tax: item.tax,
            total: item.total,
            brNo: item.brNo,
            surCh: item.surCh
          });

          // ✅ Recalculate total on changes
          row.valueChanges.subscribe(val => {

            const rate = Number(val.rate) || 0;
            const qty = Number(val.quantity) || 0;
            const taxPerc = Number(val.tax) || 0;

            const amount = rate * qty;
            const taxAmount = amount * taxPerc / 100;

            row.patchValue({
              total: (amount + taxAmount).toFixed(2)
            }, { emitEvent: false });

          });

          this.items.push(row);

          this.filteredProducts.push([]);
          this.productSelectedIndex.push(-1);

        });

      } else {

        // ✅ If no items
        this.addRow();

      }

    },

    error: (err) => {
      console.error("Bill not found", err);
      alert("Bill not found");
    }

  });

}


selectProduct(product: any, rowIndex: number): void {

  const row = this.items.at(rowIndex) as FormGroup;

  const cgst = Number(product.taxMasterNew?.cgst ?? 0);
  const sgst = Number(product.taxMasterNew?.sgst ?? 0);
  const igst = Number(product.taxMasterNew?.igst ?? 0);

  const taxPercent = cgst + sgst;

  row.patchValue({

    productCode: product.productCode,
    itemName: product.productItems[0].itemName,

    taxType: 'GST',

    rate: product.productItems[0].productItemPrice[0].mrp,
      
    quantity: 1,

    // Numeric value used for calculation
    tax: taxPercent,

    // Display value
    taxDetails:
      `CGST ${cgst}%\n` +
      `SGST ${sgst}%\n` +
      `IGST ${igst}%`,

    brNo: product.hsnCode,

    surCh: 0

  });

  this.calculateRow(row);

  this.filteredProducts[rowIndex] = [];
  this.productSelectedIndex[rowIndex] = -1;
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
      // this.selectTax(list[this.taxSelectedIndex[rowIndex]], rowIndex);
    }
  }
}



// selectTax(tax: any, rowIndex: number) {

//   const row = this.items.at(rowIndex);

//   row.patchValue({
//     taxType: tax.name,
//     tax: Number(tax.salestaxPercentage),
//     brNo: tax.hsnCode
//   }, { emitEvent: false });

//   this.filteredTaxes[rowIndex] = [];
// }

  // ✅ GET FORM ARRAY
  get items(): FormArray {
    return this.creditBillForm.get('items') as FormArray;
  }

  // ✅ CREATE ROW
createItem(): FormGroup {

  const row = this.fb.group({

    productCode: [''],
    itemName: [''],
    taxType: ['GST'],
    rate: [0],
    quantity: [1],

    tax: [0],          // numeric tax %
    taxDetails: [''],  // display text

    total: [0],
    brNo: [''],
    surCh: [0]

  });

  row.get('rate')?.valueChanges.subscribe(() => this.calculateRow(row));
  row.get('quantity')?.valueChanges.subscribe(() => this.calculateRow(row));

  return row;
}

  // ✅ ADD ROW
addRow() {
  const row = this.createItem();
  row.valueChanges.subscribe(val => {

    const rate = Number(val.rate) || 0;
    const qty = Number(val.quantity) || 0;
    const taxPerc = Number(val.tax) || 0;

    const amount = rate * qty;
    const taxAmount = amount * taxPerc / 100;

    const total = amount + taxAmount;

    row.patchValue({
      total: total.toFixed(2)
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

getTotalRate(): number {
  return this.items.controls.reduce((sum, row) => {
    return sum + (Number(row.get('rate')?.value) || 0);
  }, 0);
}

getTotalQuantity(): number {
  return this.items.controls.reduce((sum, row) => {
    return sum + (Number(row.get('quantity')?.value) || 0);
  }, 0);
}

getTotalTax(): number {

    return this.items.controls.reduce((sum, row) => {

        const tax = +row.get('tax')?.value || 0;

        return sum + tax;

    }, 0);
}

calculateRow(row: FormGroup) {

    const qty  = +row.get('quantity')!.value || 0;
    const rate = +row.get('rate')!.value || 0;
    const tax  = +row.get('tax')!.value || 0;

    const amount = qty * rate;
    const total  = amount + (amount * tax / 100);

    row.patchValue(
        { total },
        { emitEvent: false }
    );
}

getGrandTotal(): number {
  return this.items.controls.reduce((sum, row) => {
    return sum + (Number(row.get('total')?.value) || 0);
  }, 0);
}

// onTaxBlur(i: number) {
//   setTimeout(() => {

//     const row = this.items.at(i);
//     const enteredValue = row.value.taxType;

//     const matchedTax = this.tax.find(t => t.name === enteredValue);

//     if (matchedTax) {
//       row.patchValue({
//         tax: Number(matchedTax.salestaxPercentage),
//         brNo: matchedTax.hsnCode
//       }, { emitEvent: false });
//     }

//     this.filteredTaxes[i] = [];
//     this.taxSelectedIndex[i] = -1;

//   }, 200);
// }

onProductBlur(i: number) {
  setTimeout(() => {
    this.filteredProducts[i] = [];
    this.productSelectedIndex[i] = -1;
  }, 200);
}

  // SAVE
errorMessage = '';

saveCreditBill() {

  if (this.creditBillForm.invalid) {
    return;
  }

  const formValue = this.creditBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    billNo: null,
    lorry: formValue.lorry ? { id: Number(formValue.lorry) } : null,
    broker: formValue.broker ? { id: Number(formValue.broker) } : null
  };

  console.log("FINAL PAYLOAD", payload);

 this.creditBillService.addCreditBill(payload).subscribe({

    next: (res) => {

      this.errorMessage = '';

      this.creditBillForm.patchValue({
        billNo: res.billNo
      });

      alert("Saved: " + res.billNo);
    },

    error: (err) => {

  const productName = err.error.replace(
    'Insufficient stock for product ',
    ''
  );

  this.translate.get('insufficientStock').subscribe(msg => {
    this.errorMessage = `${msg} ${productName}`;
  });

}

  });

}

  cancelForm() {
    this.creditBillForm.reset();
    this.items.clear();
    this.addRow();
  }
printCreditBill() {

  const billNo = this.creditBillForm.get('billNo')?.value;

  if (!billNo) {
    alert("Save bill first");
    return;
  }

  const link = document.createElement('a');

  link.href =
    `https://aadhi-store-backend.onrender.com/api/v1/credit-bill/pdf/${billNo}`;

  link.download = `creditBill-${billNo}.pdf`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
}