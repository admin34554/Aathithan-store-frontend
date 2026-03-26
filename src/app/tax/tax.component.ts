import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-tax-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {

  taxForm: FormGroup;
taxCodes: any;
groups: any;

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService
  ) {

    this.taxForm = this.fb.group({
      taxCode: [''],
      name: [''],
      salestaxPercentage: [''],
      chargePercentage: [''],
      groupName: [''],
      active: [false]
    });

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  saveTax() {

    if (this.taxForm.invalid) {
      return;
    }

    const taxData = this.taxForm.value;

    this.taxService.addTax(taxData).subscribe({

      next: (res) => {
        console.log("Tax Saved", res);
        alert("Tax Saved Successfully");
        this.taxForm.reset();
      },

      error: (err) => {
        console.error("Error saving tax", err);
      }

    });

  }

  cancelForm() {
    this.taxForm.reset();
  }

}