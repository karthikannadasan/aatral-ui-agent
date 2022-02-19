import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PurchaseInputOrder, PurchaseInputOrderProduct } from './PurchaseInputOrder';
import { AuthService } from 'src/app/_services/auth.service';
declare var $: any;

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-purchase-input-order-create',
  templateUrl: './purchase-input-order-create.component.html',
  styleUrls: ['./purchase-input-order-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class PurchaseInputOrderCreateComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, public su: SalesUtilService,
    private pis: PurchaseInputService, private actRoute: ActivatedRoute, public route: Router,
    private auth: AuthService) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit']) {
        if (params['edit'] == 1 && params['pioid']) {
          this._mode = 'Edit';
          this.loadOrderForEdit(params['pioid']);
        }
      } else {
        this.loadOrderForEdit(0);
      }
    })
  }

  ngOnInit() {
    this.loadNeeded();
  }

  _productsShow = [];
  _vendors = [];
  _products = [];
  _selectedVendor = [];

  _mode = 'Add';
  productName = '';
  _is_products_loading = false;
  saving = false;
  order: PurchaseInputOrder = new PurchaseInputOrder();

  _vendorDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'vendorName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadNeeded() {
    this.ss.getSalesNeededData(['vendors', 'products']).subscribe(res => {
      console.log(res);
      this._vendors = res['Vendors'];
      this._products = res['Products'];
    })
  }

  openAddProductModal() {

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.order.products.forEach(pro => {
        if (prod.id == pro.productId)
          isAdded = false;
      })

      return isAdded;
    }).forEach(prod => {
      this._productsShow.push(prod);
    })

    $(function () {
      $('#productaddmodal').appendTo("body").modal('show');
    });
  }

  getdescription(prod): string {
    let desc = '';
    if (prod.hsn != '' && prod.hsn != null) {
      desc = desc + "HSN Code : " + prod.hsn + "\n";
    }
    return desc;
  }


  addProduct(prod) {

    let is_already_available = false;
    this.order.products.forEach(prd => {
      if (prd.productId == prod.id)
        is_already_available = true;
    });

    let product: PurchaseInputOrderProduct = {
      id: 0,
      billNo: 0,
      productId: prod.id,
      name: prod.name,
      description: this.getdescription(prod),
      price: prod.vendorAmount,
      quantity: 1,
      discount: 0,
      gstPercentage: prod.gst
    };

    if (!is_already_available) {
      this.order.products.push(product);
    }

    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  loadOrderForEdit(orderId) {
    this.pis.getPurchaseInputOrder(orderId).subscribe(res => {
      if (res['StatusCode'] == '00') {
        if (res['PurchaseInputOrder'] != null) {
          this.order = res['PurchaseInputOrder'];
          this.order.products = res['PurchaseInputOrderProducts'];

          this._selectedVendor = [{ id: this.order.id, vendorName: this.order.vendor.vendorName }];
        } else if (res['PurchaseInputOrder'] == null) {

          console.log("Inside else if");
          if (res['AutoGeneratedNo'] && res['AutoGeneratedNo'] != '' && res['AutoGeneratedNo'] != null) {
            this.order.orderNo = res['AutoGeneratedNo'];
            this.snackbar.open('Order No "' + this.order.orderNo + '" AutoIncremented from last order.');
          }
          if (res['LastTerms'] && res['LastTerms'] != '' && res['LastTerms'] != null) {
            this.order.terms = res['LastTerms'];
          }
        }
      }
    })
  }

  savePurchaseInputOrder() {

    if (this.order.vendor == null || this.order.vendor === undefined) {
      this.snackbar.open('Please Select Vendor');
      return;
    }
    if (this.order.orderNo == null || this.order.orderNo === undefined || this.order.orderNo == '') {
      this.snackbar.open('Order No cannot be empty');
      return;
    }
    if (this.order.orderDate == null || this.order.orderDate === undefined) {
      this.snackbar.open('Order Date cannot be empty');
      return;
    }

    this.order.subTotal = this.su.getSubTotal(this.order.products);
    this.order.adjustment = this.su.getAdjustment(this.order.products);
    this.order.discount = this.su.getDiscount(this.order.products);
    this.order.grandTotal = this.su.getGrandTotal(this.order.products);
    this.order.tax = this.su.getTaxAmount(this.order.products);

    this.saving = true;

    this.pis.savePurchaseInputOrder(this.order).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        this.route.navigateByUrl('/purchase-inputs/orders/overview/' + res['PurchaseInputOrder']['id']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.saving = false; })

  }

  changeAddress() {
    this._vendors
      .filter(vendor => vendor.id == this.order.vendor.id)
      .forEach(vendor => {
        let gstNo = '\nGSTIN : ';
        if (vendor.gstNo != null && vendor.gstNo != '') {
          gstNo = gstNo + vendor.gstNo;
        } else {
          gstNo = gstNo + "Unregistered";
        }
        let vendorAddress = vendor.vendorName + ',\n' + vendor.address1 + ',\n' + vendor.address2
          + ',\n' + vendor.city + ', ' + vendor.state + ',\n'
          + vendor.country + ' - ' + vendor.pincode + '.';

        this.order.billingTo = vendorAddress + gstNo;
        this.order.shippingTo = vendorAddress + gstNo;
      })
  }

  clear() {
    window.location.href = "./sales/purchase-inputs/orders/create";
  }

}
