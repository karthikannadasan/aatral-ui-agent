import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesDashboardComponent } from '../../_sales/sales-dashboard/sales-dashboard.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgGridModule } from 'ag-grid-angular';
import { ProductDetailsDealsComponent } from '../../_sales/_entity/product-details-deals/product-details-deals.component';
import { MaterialModule } from 'src/app/_modules/material.module';
import { QuotationsReportComponent } from 'src/app/_sales/_reports/quotations-report/quotations-report.component';
import { PurchaseOrdersReportComponent } from 'src/app/_sales/_reports/purchase-orders-report/purchase-orders-report.component';
import { SalesOrdersReportComponent } from 'src/app/_sales/_reports/sales-orders-report/sales-orders-report.component';
import { ProformaInvoicesReportComponent } from 'src/app/_sales/_reports/proforma-invoices-report/proforma-invoices-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MomentModule } from 'ngx-moment';
import { ProjectImplementationsReportsComponent } from 'src/app/_sales/_reports/project-implementations-reports/project-implementations-reports.component';
import { AmcDashboardComponent } from 'src/app/_institute/amc-dashboard/amc-dashboard.component';
import { PaymentsReportComponent } from 'src/app/_sales/_reports/payments-report/payments-report.component';
import { DealsDeliveryChallanReportComponent } from 'src/app/_sales/_entity/deals-delivery-challan-report/deals-delivery-challan-report.component';
import { CreateLetterpadComponent } from 'src/app/_admin/create-letterpad/create-letterpad.component';
import { LetterPadComponent } from 'src/app/_admin/letter-pad/letter-pad/letter-pad.component';

@NgModule({
  declarations: [SalesDashboardComponent, ProductDetailsDealsComponent, QuotationsReportComponent,
    PurchaseOrdersReportComponent, SalesOrdersReportComponent, PaymentsReportComponent,
    ProformaInvoicesReportComponent, AmcDashboardComponent, ProjectImplementationsReportsComponent,
    DealsDeliveryChallanReportComponent, 
    CreateLetterpadComponent, LetterPadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule,
    SalesRoutingModule,
    MaterialModule,
    NgxChartsModule,
    NgMultiSelectDropDownModule,
    NgxSkeletonLoaderModule,
    AgGridModule,
    MomentModule
  ]
})
export class SalesModule { }
