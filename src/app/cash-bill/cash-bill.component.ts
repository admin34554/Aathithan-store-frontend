import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CashBillService } from '../services/cashBill.service';
import { BrokerService } from '../services/broker.service';
import { LorryService } from '../services/lorry.service';
import { CustomerService } from '../services/customer.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductTypeService } from '../services/productType.service';
import { ProductService } from '../services/product.service';
import { TaxService } from '../services/tax.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cash-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './cash-bill.component.html',
  styleUrls: ['./cash-bill.component.css']
})
export class CashBillComponent implements OnInit {
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key.toLowerCase() === 'p') {

      const target = event.target as HTMLElement;

      // Don't print when typing inside input/textarea/select
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      event.preventDefault();

      this.printBill();
    }
  }
selectCustomer(customer: any) {

  this.cashBillForm.get('name')?.setValue(customer.name, { emitEvent: false });

  this.customers = [];
  this.customerSelectedIndex = -1;

  setTimeout(() => {
    const input = document.querySelector('input[formControlName="name"]') as HTMLElement;
    input.blur();
  }, 0);
}




  cashBillForm: FormGroup;
  lorries: any[] = [];
  brokers: any[] = [];
  customers: any[] = [];
  products: any[] = [];
  tax: any[] = [];
  filteredProducts: any[][] = []; 
  filteredTaxes: any[][] = [];
  taxSelectedIndex: number[] = [];
  productItems: any[][] = [];
selectedProducts: any[] = [];
// ✅ Customer dropdown (single)
customerSelectedIndex: number = -1;

showItemPopup = false;

selectedProductIndex = -1;

selectedProduct: any = null;

// ✅ Product dropdown (per row)
productSelectedIndex: number[] = [];  
  constructor(
    private fb: FormBuilder,
    private cashBillService: CashBillService,
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

 this.cashBillForm = this.fb.group({

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
     this.cashBillForm.get('name')?.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
         .subscribe(value => {
          this.searchCustomers(value, this.cashBillForm.get('companyId')?.value);
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

searchCustomers(name: string, companyId: number): void {

  if (!name || name.trim().length < 2) {
    this.customers = [];
    return;
  }

  const searchName = name.trim();

  const selectedCustomer = this.customers.find(
    c => c.name?.toLowerCase() === searchName.toLowerCase()
  );

  if (selectedCustomer) {
    this.customers = [];
    return;
  }

  this.customerService.searchCustomers(searchName).subscribe({
    next: (res) => {
      this.customers = res;
    },
    error: (err) => {
      console.error('Customer search failed:', err);
      this.customers = [];
    }
  });
}

onProductSearch(event: any, index: number): void {

  const searchText = event.target.value?.trim() || '';

  const row = this.items.at(index) as FormGroup;

  // User changed the product code.
  // It must be selected/validated again.
  row.patchValue({
    productSelected: false,
    productItemId: '',
    brNo: '',
    rate: 0,
    taxDetails: '',
    total: 0
  }, { emitEvent: false });

  // Remove previous invalidProduct error immediately
  const control = row.get('productCode');

  if (control?.hasError('invalidProduct')) {
    const errors = { ...(control.errors || {}) };
    delete errors['invalidProduct'];

    control.setErrors(
      Object.keys(errors).length > 0 ? errors : null
    );
  }

  if (!searchText) {
    this.filteredProducts[index] = [];
    return;
  }

  this.productService.searchProducts(searchText).subscribe({

    next: (products) => {
      this.filteredProducts[index] = products || [];
    },

    error: (error) => {
      console.error('Product search error:', error);
      this.filteredProducts[index] = [];
    }

  });
}

validateProducts(): boolean {

  let valid = true;

  this.items.controls.forEach((control, index) => {

    const row = control as FormGroup;

    const productCode =
      row.get('productCode')?.value?.trim();

    const productCodeControl =
      row.get('productCode');

    // Ignore empty rows
    if (!productCode) {
      return;
    }

    // Check actual selected product
    const selectedProduct =
      this.selectedProducts[index];

    console.log(
      'Row:',
      index,
      'Code:',
      productCode,
      'Selected:',
      selectedProduct
    );

    if (!selectedProduct) {

      valid = false;

      productCodeControl?.setErrors({
        ...(productCodeControl.errors || {}),
        invalidProduct: true
      });

      productCodeControl?.markAsTouched();

    } else {

      // Product is valid
      const errors = {
        ...(productCodeControl?.errors || {})
      };

      delete errors['invalidProduct'];

      productCodeControl?.setErrors(
        Object.keys(errors).length > 0
          ? errors
          : null
      );
    }

  });

  return valid;
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

  const billNo = this.cashBillForm.get('billNo')?.value;

  if (!billNo) return;

  this.cashBillService.getCashBillByCashBillId(billNo).subscribe({

    next: (res: any) => {

      console.log("Fetched Bill", res);

      // ✅ Clear existing rows
      this.items.clear();

      // ✅ Bind top fields
      this.cashBillForm.patchValue({
        name: res.name,
        billNo: res.billNo,
        billDate: res.billDate?.substring(0, 10),
        remarks: res.remarks,
        lorry: res.lorry?.id,
        broker: res.broker?.id
      });

      // ✅ Bind item rows
      if (res.items && res.items.length > 0) {

res.items.forEach((item: any, index: number) => {

  const row = this.createItem();
  this.items.push(row);

  this.filteredProducts.push([]);
  this.productSelectedIndex.push(-1);
  this.productItems.push([]);

  this.productService.searchProducts(item.productCode).subscribe(products => {

    const product = products[0];

    this.productItems[index] = product.productItems;

    row.patchValue({
      productCode: item.productCode,
      productItemId: item.productItemId,
      taxType: item.taxType,
      rate: item.rate,
      quantity: item.quantity,
      tax: item.tax,
        taxDetails:
      `CGST ${Number(item.tax) / 2}%\n` +
      `SGST ${Number(item.tax) / 2}%\n` +
      `IGST ${item.tax}%`,
      total: item.total,
      brNo: item.brNo,
      surCh: item.surCh
    });

  });

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

  // Store the actual selected product
  this.selectedProducts[rowIndex] = product;

  const row = this.items.at(rowIndex) as FormGroup;

  const cgst = Number(product.taxMasterNew?.cgst ?? 0);
  const sgst = Number(product.taxMasterNew?.sgst ?? 0);
  const igst = Number(product.taxMasterNew?.igst ?? 0);

  // Set product details
  row.patchValue({

    productCode: product.productCode,

    productSelected: true,

    itemName: '',

    rate: 0,

    quantity: 1,

    taxType: 'GST',

    tax: cgst + sgst,

    taxDetails:
      `CGST ${cgst}%\n` +
      `SGST ${sgst}%\n` +
      `IGST ${igst}%`,

    brNo: product.hsnCode,

    surCh: 0

  }, {
    emitEvent: false
  });


  // ==========================================
  // CLEAR INVALID PRODUCT ERROR
  // ==========================================

  const productCodeControl = row.get('productCode');

  if (productCodeControl) {

    const errors = {
      ...(productCodeControl.errors || {})
    };

    delete errors['invalidProduct'];

    productCodeControl.setErrors(
      Object.keys(errors).length > 0
        ? errors
        : null
    );

  }

  this.productItems[rowIndex] =
    product.productItems || [];

  this.filteredProducts[rowIndex] = [];
  this.productSelectedIndex[rowIndex] = -1;
  this.showItemPopup = true;


  console.log(
    'Selected product:',
    this.selectedProducts[rowIndex]
  );

}

onItemChange(event: any, rowIndex: number) {

    const itemId = Number(event.target.value);

    const item = this.productItems[rowIndex]
        .find((x: any) => x.id === itemId);

    if (!item) {
        return;
    }

    const row = this.items.at(rowIndex) as FormGroup;

    row.patchValue({
    productItemId: item.id,
    itemName: item.itemName,
    rate: item.productItemPrice[0]?.mrp ?? 0
});

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
    return this.cashBillForm.get('items') as FormArray;
  }

  // ✅ CREATE ROW
createItem(): FormGroup {

  const row = this.fb.group({

    productCode: [''],
    itemName: [''],        // display/save
    productItem: [null],   // backend
    productItemId: [null], // dropdown
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
addRow(): void {

  const row = this.createItem();

  row.valueChanges.subscribe(val => {

    const rate = Number(val.rate) || 0;
    const qty = Number(val.quantity) || 0;
    const taxPerc = Number(val.tax) || 0;

    const amount = rate * qty;

    const taxAmount = amount * taxPerc / 100;

    const total = amount + taxAmount;

    row.patchValue(
      {
        total: Number(total.toFixed(2))
      },
      {
        emitEvent: false
      }
    );

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

onProductBlur(i: number) {
  setTimeout(() => {
    this.filteredProducts[i] = [];
    this.productSelectedIndex[i] = -1;
  }, 200);
}

  // SAVE
errorMessage = '';

saveCashBill() {

  if (this.cashBillForm.invalid) {
    return;
  }

   if (!this.validateProducts()) {

    this.errorMessage =
      'Please select a valid product from the product list.';

    return;
  }

  const formValue = this.cashBillForm.value;

  // ✅ CONVERT ID → OBJECT
  const payload = {
    ...formValue,
    billNo: null,
    lorry: formValue.lorry ? { id: Number(formValue.lorry) } : null,
    broker: formValue.broker ? { id: Number(formValue.broker) } : null,

     items: formValue.items.map((item: any) => ({
    ...item,
    productItem: {
      id: item.productItemId
    }
  }))
  };

  console.log("FINAL PAYLOAD", payload);

 this.cashBillService.addCashBill(payload).subscribe({

    next: (res) => {

      this.errorMessage = '';

      this.cashBillForm.patchValue({
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
    this.cashBillForm.reset();
    this.items.clear();
    this.addRow();
  }
printBill() {

  const billNo = this.cashBillForm.get('billNo')?.value;

  if (!billNo) {
    alert("Save bill first");
    return;
  }

  const link = document.createElement('a');

  link.href =
    `https://aadhi-store-backend.onrender.com/api/v1/cash-bill/pdf/${billNo}`;

  link.download = `cashBill-${billNo}.pdf`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  }


getItemAmount(row: any): number {
  const rate = Number(row.get('rate')?.value) || 0;
  const quantity = Number(row.get('quantity')?.value) || 0;

  return rate * quantity;
}


getItemTaxPercentage(row: any): number {

  // Prefer the numeric tax field
  const tax = Number(row.get('tax')?.value);

  if (!isNaN(tax) && tax > 0) {
    return tax;
  }

  // Fallback: read from taxDetails
  const taxDetails = row.get('taxDetails')?.value || '';

  const match = taxDetails.match(/IGST\s+([\d.]+)%/i);

  if (match) {
    return Number(match[1]) || 0;
  }

  return 0;
}

getSubTotal(): number {

  return this.items.controls.reduce((total, row) => {

    return total + this.getItemAmount(row);

  }, 0);

}


getCgstAmount(): number {

  return this.items.controls.reduce((total, row) => {

    const itemAmount = this.getItemAmount(row);

    const taxPercentage = this.getItemTaxPercentage(row);

    const cgstPercentage = taxPercentage / 2;

    const cgstAmount =
      itemAmount * cgstPercentage / 100;

    return total + cgstAmount;

  }, 0);

}

getSgstAmount(): number {

  return this.items.controls.reduce((total, row) => {

    const itemAmount = this.getItemAmount(row);

    const taxPercentage = this.getItemTaxPercentage(row);

    const sgstPercentage = taxPercentage / 2;

    const sgstAmount =
      itemAmount * sgstPercentage / 100;

    return total + sgstAmount;

  }, 0);

}

getTotalTaxAmount(): number {

  return this.getCgstAmount() + this.getSgstAmount();

}

getGrandTotal(): number {

  const subTotal = this.getSubTotal();

  const cgst = this.getCgstAmount();

  const sgst = this.getSgstAmount();

  return subTotal + cgst + sgst;

}

getItemGrandTotal(row: any): number {

  const itemAmount = this.getItemAmount(row);

  const taxPercentage =
    this.getItemTaxPercentage(row);

  const taxAmount =
    itemAmount * taxPercentage / 100;

  return itemAmount + taxAmount;
}
}