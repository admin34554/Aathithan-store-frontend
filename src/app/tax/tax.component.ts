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
  isEditMode = false;

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

      id: [0],

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

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (id) {
        this.taxId = +id;
        this.isEditMode = true;
        this.loadTax(this.taxId);
      }

    });

  }

  loadTax(id: number): void {

    this.taxService.getTaxById(id).subscribe({

      next: (tax) => {

        this.taxForm.patchValue({

          id: tax.id,
          hsnCode: tax.hsnCode,
          hsnDescription: tax.hsnDescription,
          stateCode: tax.stateCode,
          stateGstCode: tax.stateGstCode,
          unit: tax.unit,
          unitText: tax.unitText,
          sgst: tax.sgst,
          cgst: tax.cgst,
          igst: tax.igst,
          active: tax.active

        });

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

    const taxData = this.taxForm.value;

    if (this.isEditMode) {

      this.taxService.updateTax(this.taxId, taxData).subscribe({

        next: () => {
          alert('Tax Updated Successfully');
          this.router.navigate(['/tax-list']);
        },

        error: err => console.error(err)

      });

    } else {

      this.taxService.addTax(taxData).subscribe({

        next: () => {
          alert('Tax Saved Successfully');
          this.router.navigate(['/tax-list']);
        },

        error: err => console.error(err)

      });

    }

  }

  cancelForm(): void {
    this.router.navigate(['/tax-list']);
  }

}