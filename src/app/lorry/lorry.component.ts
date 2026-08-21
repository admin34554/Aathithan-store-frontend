import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LorryService } from '../services/lorry.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lorry-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './lorry.component.html',
  styleUrls: ['./lorry.component.css']
})
export class LorryComponent implements OnInit {

  selectedRoutes: string[] = [];

  lorryForm: FormGroup;

  lorryCodes: any;
  groups: any;

  viewMode: boolean = false;
  editMode: boolean = false;

  lorryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private lorryService: LorryService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    const lang = localStorage.getItem('lang') || 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(lang);

    this.lorryForm = this.fb.group({
      code: [''],
      name: [''],
      phoneNumber: [''],
      mobileNumber: [''],
      contactPerson: [''],
      address: [''],
      areaCovering: [''],
      routeCovering: [[]],
      active: [false]
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      if (params['id']) {

        this.lorryId = Number(params['id']);

        const currentUrl = this.router.url;

        if (currentUrl.includes('/view/')) {

          this.viewMode = true;
          this.editMode = false;

          this.loadLorry(this.lorryId);

        } else if (currentUrl.includes('/edit/')) {

          this.viewMode = false;
          this.editMode = true;

          this.loadLorry(this.lorryId);
        }

      } else {

        // New lorry
        this.viewMode = false;
        this.editMode = false;

        this.lorryForm.enable();

      }

    });

  }

loadLorry(id: number): void {

  this.lorryService.getLorryById(id).subscribe({

    next: (lorry: any) => {

      console.log('Lorry loaded:', lorry);
      console.log('Area from API:', lorry.areaCovering);

      this.selectedRoutes = Array.isArray(lorry.routeCovering)
        ? [...lorry.routeCovering]
        : [];

      this.lorryForm.patchValue({
        code: lorry.code,
        name: lorry.name,
        phoneNumber: lorry.phoneNumber,
        mobileNumber: lorry.mobileNumber,
        contactPerson: lorry.contactPerson,
        address: lorry.address,
        areaCovering: lorry.areaCovering,
        routeCovering: this.selectedRoutes,
        active: lorry.active
      });

      console.log(
        'Area from FORM:',
        this.lorryForm.get('areaCovering')?.value
      );

      console.log(
        'Complete FORM:',
        this.lorryForm.getRawValue()
      );

      if (this.viewMode) {
        this.lorryForm.disable();
      }

      if (this.editMode) {
        this.lorryForm.enable();
      }
    },

    error: (err) => {
      console.error('Error loading lorry:', err);
    }

  });
}

  onRouteChange(event: any): void {

    // Don't allow changes in view mode
    if (this.viewMode) {
      return;
    }

    const value = event.target.value;

    if (event.target.checked) {

      if (!this.selectedRoutes.includes(value)) {
        this.selectedRoutes.push(value);
      }

    } else {

      const index = this.selectedRoutes.indexOf(value);

      if (index > -1) {
        this.selectedRoutes.splice(index, 1);
      }

    }

    this.lorryForm.patchValue({
      routeCovering: this.selectedRoutes
    });

  }

  // =========================================================
  // SAVE / UPDATE
  // =========================================================

  saveLorry(): void {

    if (this.lorryForm.invalid) {
      return;
    }

    const lorryData = this.lorryForm.getRawValue();

    // Make sure latest routes are included
    lorryData.routeCovering = this.selectedRoutes;

    // =====================================================
    // UPDATE EXISTING LORRY
    // =====================================================

    if (this.editMode && this.lorryId) {

      this.lorryService.updateLorry(
        this.lorryId,
        lorryData
      ).subscribe({

        next: (res) => {

          console.log('Lorry Updated', res);

          alert('Lorry Updated Successfully');

          this.router.navigate(['/lorry-master']);

        },

        error: (err) => {

          console.error('Error updating lorry', err);

        }

      });

      return;
    }

    // =====================================================
    // CREATE NEW LORRY
    // =====================================================

    this.lorryService.addLorry(lorryData).subscribe({

      next: (res) => {

        console.log('Lorry Saved', res);

        alert('Lorry Saved Successfully');

        this.lorryForm.reset({
          code: '',
          name: '',
          phoneNumber: '',
          mobileNumber: '',
          contactPerson: '',
          address: '',
          areaCovering: '',
          routeCovering: [],
          active: false
        });

        this.selectedRoutes = [];

      },

      error: (err) => {

        console.error('Error saving lorry', err);

      }

    });

  }


  enableEdit(): void {

    if (!this.lorryId) {
      return;
    }

    this.viewMode = false;
    this.editMode = true;

    this.lorryForm.enable();

  }

  cancelForm(): void {

    if (this.editMode && this.lorryId) {

      // Go back to view mode
      this.viewMode = true;
      this.editMode = false;

      this.loadLorry(this.lorryId);

      return;
    }

    // New form
    this.lorryForm.reset({
      code: '',
      name: '',
      phoneNumber: '',
      mobileNumber: '',
      contactPerson: '',
      address: '',
      areaCovering: '',
      routeCovering: [],
      active: false
    });

    this.selectedRoutes = [];

  }

}