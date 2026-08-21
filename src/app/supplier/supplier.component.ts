import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier, SupplierService } from '../services/supplier.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

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
viewMode=false;
supplierId!:number;

constructor(
  private supplierService: SupplierService,
  private fb: FormBuilder,
  private translate: TranslateService,
  private route: ActivatedRoute,
  private router: Router
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
    panNo: [''],
    area: [''],
    aadharNo: [''],
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


const mode=this.route.snapshot.url[1]?.path;

this.supplierId=Number(this.route.snapshot.paramMap.get('id'));

if(mode==="view"){

this.viewMode=true;

this.loadSupplier(this.supplierId);

}

else if(mode==="edit"){

this.editMode=true;

this.loadSupplier(this.supplierId);

}

}

loadSupplier(id: number) {

  this.supplierService.getSupplierById(id).subscribe({

    next: (res) => {

      this.supplierform.patchValue({

        id: res.id,
        contact: res.contact,
        aadharNo: res.aadharNo,
        panNo: res.panNo,
        gstIn: res.gstNo,

        doorNo: res.doorNo,
        street: res.street,
        area: res.area,
        city: res.city,
        state: res.state,
        pinCode: res.pinCode,

        phone: res.phone,
        mobile: res.mobile,
        creditPeriod: res.creditPeriod,

        type: res.type,
        active: res.active,

        accountNo: res.bankDetails?.[0]?.accountNo,
        bankName: res.bankDetails?.[0]?.bankName,
        branch: res.bankDetails?.[0]?.branch,
        ifscCode: res.bankDetails?.[0]?.ifscCode,
        remarks: res.bankDetails?.[0]?.remarks

      });

      if (this.viewMode) {
        this.supplierform.disable();
      }

    }

  });

}

submitForm() {

  if (this.supplierform.invalid) {
    return;
  }

  const form = this.supplierform.getRawValue();

  const supplierData: Supplier = {

    ...form,

    gstNo: form.gstIn,

    bankDetails: [
      {
        accountNo: form.accountNo,
        bankName: form.bankName,
        branch: form.branch,
        ifscCode: form.ifscCode,
        remarks: form.remarks
      }
    ]

  };

  if (this.editMode) {

    this.supplierService
      .updateSupplier(this.supplierId, supplierData)
      .subscribe({

        next: () => {

          alert('Supplier Updated Successfully');

          this.router.navigate(['/supplier-list']);

        }

      });

  } else {

    this.supplierService
      .addSupplier(supplierData)
      .subscribe({

        next: () => {

          alert('Supplier Saved Successfully');

          this.resetForm();

        }

      });

  }

}

  editSupplier(supplier: Supplier) {
    this.editMode = true;
    this.editId = supplier.id || null;
    this.supplierform.patchValue(supplier);
  }

  deleteSupplier(id: number) {
    if(confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id)
        .subscribe(() => this.loadSupplier(this.supplierId));
    }
  }

resetForm() {

  this.supplierform.reset();

  this.activeTab = 'details';

}

}
