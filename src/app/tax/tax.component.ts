import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-tax-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {

  taxForm!: FormGroup;

  taxId!: number;

  editMode = false;
  viewMode = false;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {

    const lang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(lang);

    this.taxForm = this.fb.group({


      hsnCode: ['', Validators.required],
      hsnDescription: ['', Validators.required],

      stateCode: [''],
      stateGstCode: [''],

      unit: [''],
      unitText: [''],

      cgst: [0],
      sgst: [0],
      igst: [0],

      active: [true]

    });

  }

 ngOnInit(): void {

    const mode = this.route.snapshot.url[1]?.path;

    this.taxId = Number(this.route.snapshot.paramMap.get('id'));

    if (mode === 'view') {

      this.viewMode = true;
      this.loadTax(this.taxId);

    } else if (mode === 'edit') {

      this.editMode = true;
      this.loadTax(this.taxId);

    }

  }

  loadTax(id: number): void {

    this.taxService.getTaxById(id).subscribe({

      next: (res) => {

        this.taxForm.patchValue({

          id: res.id,
          hsnCode: res.hsnCode,
          hsnDescription: res.hsnDescription,
          stateCode: res.stateCode,
          stateGstCode: res.stateGstCode,
          unit: res.unit,
          unitText: res.unitText,
          sgst: res.sgst,
          cgst: res.cgst,
          igst: res.igst,
          active: res.active

        });

           if (this.viewMode) {
          this.taxForm.disable();
        }

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

saveTax(): void {

  if (this.taxForm.invalid) {
    this.taxForm.markAllAsTouched();
    return;
  }

  const form = this.taxForm.getRawValue();

  if (this.editMode) {

    this.taxService.updateTax(this.taxId, form).subscribe({

      next: () => {
        alert('Tax Updated Successfully');
        this.router.navigate(['/tax-list']);
      },

      error: (err) => {
        console.error(err);
      }

    });

  } else {

    this.taxService.addTax(form).subscribe({

      next: () => {
        alert('Tax Saved Successfully');
        this.router.navigate(['/tax-list']);
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}

 resetForm() {

    this.taxForm.reset();

    this.activeTab = 'details';

  }

  cancelForm(): void {
    this.router.navigate(['/tax-list']);
  }

}