import { Component, OnInit } from '@angular/core';

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
    TranslateService,
    TranslateModule
} from '@ngx-translate/core';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    StockMasterService,
    Stock
} from '../services/stock-master.service';


@Component({
    selector: 'app-stock',
    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule
    ],

    templateUrl: './stock.component.html',
    styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

    stockForm!: FormGroup;

    isEditMode = false;
    isViewMode = false;

    stockId?: number;


    constructor(
        private fb: FormBuilder,
        private stockService: StockMasterService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {

        const lang =
            localStorage.getItem('lang') || 'en';

        this.translate.setDefaultLang('en');
        this.translate.use(lang);
    }


    ngOnInit(): void {

        // Create form
        this.initializeForm();


        // Get ID from URL
        const id =
            this.route.snapshot.paramMap.get('id');


        console.log('Stock ID from URL:', id);


        // If ID exists, this is View/Edit
        if (id) {

            this.stockId = Number(id);


            // Check URL
            if (this.router.url.includes('/stock/view/')) {

                this.isViewMode = true;
                this.isEditMode = false;

            }
            else if (this.router.url.includes('/stock/edit/')) {

                this.isViewMode = false;
                this.isEditMode = true;

            }


            console.log('View Mode:', this.isViewMode);
            console.log('Edit Mode:', this.isEditMode);



            this.loadStock(this.stockId);
        }

    }


    initializeForm(): void {

        this.stockForm = this.fb.group({

            id: [null],

            itemName: [
                '',
                Validators.required
            ],

            hsnCode: [
                '',
                Validators.required
            ],

            mrp: [
                '',
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            msp: [
                '',
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            quantity: [
                '',
                [
                    Validators.required,
                    Validators.min(0)
                ]
            ],

            active: [
                true
            ]

        });

    }
    loadStock(id: number): void {

        console.log(
            'Loading stock with ID:',
            id
        );


        this.stockService
            .getStockById(id)
            .subscribe({

                next: (stock: Stock) => {

                    console.log(
                        'Stock received:',
                        stock
                    );


                    // PATCH FORM
                    this.stockForm.patchValue({

                        id: stock.id ?? null,

                        itemName:
                            stock.itemName ?? '',

                        hsnCode:
                            stock.hsnCode ?? '',

                        mrp:
                            stock.mrp ?? '',

                        msp:
                            stock.msp ?? '',

                        quantity:
                            stock.quantity ?? '',

                        active:
                            stock.active ?? true

                    });


                    // VIEW MODE
                    if (this.isViewMode) {

                        this.stockForm.disable();

                    }


                    console.log(
                        'Form after patch:',
                        this.stockForm.value
                    );

                },

                error: (error) => {

                    console.error(
                        'Error loading stock:',
                        error
                    );

                    alert(
                        'Failed to load stock'
                    );

                }

            });

    }

    saveStock(): void {

        // View mode should never save
        if (this.isViewMode) {
            return;
        }


        if (this.stockForm.invalid) {

            this.stockForm.markAllAsTouched();

            return;
        }


        const stockData: Stock =
            this.stockForm.getRawValue();


        console.log(
            'Stock data:',
            stockData
        );

        if (this.isEditMode && this.stockId) {

            console.log(
                'Updating stock:',
                this.stockId
            );


            this.stockService
                .updateStock(
                    this.stockId,
                    stockData
                )
                .subscribe({

                    next: (res) => {

                        console.log(
                            'Stock Updated:',
                            res
                        );

                        alert(
                            'Stock Updated Successfully'
                        );

                        this.router.navigate(
                            ['/stock-master']
                        );

                    },

                    error: (error) => {

                        console.error(
                            'Error updating stock:',
                            error
                        );

                        alert(
                            'Failed to update stock'
                        );

                    }

                });

            return;
        }

        this.stockService
            .addStock(stockData)
            .subscribe({

                next: (res) => {

                    console.log(
                        'Stock Saved:',
                        res
                    );

                    alert(
                        'Stock Saved Successfully'
                    );

                    this.router.navigate(
                        ['/stock-master']
                    );

                },

                error: (error) => {

                    console.error(
                        'Error saving stock:',
                        error
                    );

                    alert(
                        'Failed to save stock'
                    );

                }

            });

    }

    resetForm(): void {

        // Don't reset in view mode
        if (this.isViewMode) {
            return;
        }


        this.stockForm.reset({

            id: null,

            itemName: '',

            hsnCode: '',

            mrp: '',

            msp: '',

            quantity: '',

            active: true

        });

    }

    cancelForm(): void {

        this.router.navigate(
            ['/stock-master']
        );

    }

}