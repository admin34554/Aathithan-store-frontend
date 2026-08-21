import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BrokerService } from '../services/broker.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-broker-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  brokerForm: FormGroup;

  brokerCodes: any;
  groups: any;

  viewMode: boolean = false;
  editMode: boolean = false;

  brokerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private brokerService: BrokerService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    const lang = localStorage.getItem('lang') || 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(lang);

    this.brokerForm = this.fb.group({
      code: [''],
      brokerName: [''],
      phoneNo: [''],
      mobileNo: [''],
      localComm: [''],
      address: [''],
      outComm: [''],
      active: [false]
    });
  }

ngOnInit(): void {

  console.log('BrokerComponent initialized');

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    console.log('Route ID:', id);

    if (id) {

      this.brokerId = Number(id);

      const url = this.router.url;

      console.log('Current URL:', url);

      if (url.includes('/view/')) {

        this.viewMode = true;
        this.editMode = false;

        console.log('VIEW MODE');

      } else if (url.includes('/edit/')) {

        this.viewMode = false;
        this.editMode = true;

        console.log('EDIT MODE');

      }

      console.log('Calling loadBroker()');

      this.loadBroker();

    } else {

      console.log('CREATE MODE');

      this.viewMode = false;
      this.editMode = false;

      this.brokerForm.enable();

    }

  });

}

loadBroker(): void {

  if (this.brokerId === null) {
    console.error('brokerId is null');
    return;
  }

  console.log(
    'Calling getBrokerById with:',
    this.brokerId
  );

  this.brokerService
    .getBrokerById(this.brokerId)
    .subscribe({

      next: (broker: any) => {

        console.log(
          'GET BROKER RESPONSE:',
          broker
        );

        this.brokerForm.patchValue({

          code: broker.code ?? '',

          brokerName: broker.brokerName ?? '',

          phoneNo: broker.phoneNo ?? '',

          mobileNo: broker.mobileNo ?? '',

          localComm: broker.localComm ?? '',

          address: broker.address ?? '',

          outComm: broker.outComm ?? '',

          active: broker.active ?? false

        });

        if (this.viewMode) {
          this.brokerForm.disable();
        }

        if (this.editMode) {
          this.brokerForm.enable();
        }

      },

      error: (err) => {

        console.error(
          'GET BROKER ERROR:',
          err
        );

      }

    });

}


  saveBroker(): void {

    if (this.brokerForm.invalid) {
      return;
    }

    const brokerData = this.brokerForm.getRawValue();

    if (this.editMode && this.brokerId) {

      this.brokerService.updateBroker(
        this.brokerId,
        brokerData
      ).subscribe({

        next: (res) => {

          console.log('Broker Updated:', res);

          alert('Broker Updated Successfully');

          this.router.navigate(['/broker-master']);

        },

        error: (err) => {

          console.error('Error updating broker:', err);

        }

      });

      return;
    }

    // =====================================================
    // CREATE NEW BROKER
    // =====================================================

    this.brokerService.addBroker(brokerData).subscribe({

      next: (res) => {

        console.log('Broker Saved:', res);

        alert('Broker Saved Successfully');

        this.brokerForm.reset({
          code: '',
          brokerName: '',
          phoneNo: '',
          mobileNo: '',
          localComm: '',
          address: '',
          outComm: '',
          active: false
        });

      },

      error: (err) => {

        console.error('Error saving broker:', err);

      }

    });

  }

  // =========================================================
  // ENABLE EDIT
  // =========================================================

  enableEdit(): void {

    if (!this.brokerId) {
      return;
    }

    this.router.navigate([
      '/broker-master/edit',
      this.brokerId
    ]);

  }

  // =========================================================
  // CANCEL
  // =========================================================

  cancelForm(): void {

    // If editing existing broker
    if (this.editMode && this.brokerId) {

      this.router.navigate([
        '/broker-master/view',
        this.brokerId
      ]);

      return;
    }

    // New broker
    this.brokerForm.reset({
      code: '',
      brokerName: '',
      phoneNo: '',
      mobileNo: '',
      localComm: '',
      address: '',
      outComm: '',
      active: false
    });

  }

}