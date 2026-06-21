import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-company-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent implements OnInit {

selectedRoutes: string[] = [];
companyForm: FormGroup;
companyCodes: any;
groups: any;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translate: TranslateService

  ) {
    const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);

    this.companyForm = this.fb.group({
      name: [''],
      gstIn: [''],
      pan: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      country: [''],
      email: [''],
      phone: ['']
    });

  }
  ngOnInit(): void {}

  // Handle route checkbox change
    onRouteChange(event: any) {

    const value = event.target.value;

    if (event.target.checked) {
      this.selectedRoutes.push(value);
    } else {
      const index = this.selectedRoutes.indexOf(value);
      if (index > -1) {
        this.selectedRoutes.splice(index, 1);
      }
    }

  }

  saveCompany() {

    if (this.companyForm.invalid) {
      return;
    }

    const companyData = this.companyForm.value;

    this.companyService.addCompany(companyData).subscribe({

      next: (res) => {
        console.log("Company Saved", res);
        alert("Company Saved Successfully");
        this.companyForm.reset();
      },

      error: (err) => {
        console.error("Error saving company", err);
      }

    });

  }

  cancelForm() {
    this.companyForm.reset();
  }

}