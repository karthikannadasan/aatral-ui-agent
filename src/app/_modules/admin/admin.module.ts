import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SendAmcInvoiceComponent } from '../../_admin/send-amc-invoice/send-amc-invoice.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AdminComponent } from '../../_admin/admin/admin.component';
import { GenerateWorkingDaysComponent } from '../../_admin/generate-working-days/generate-working-days.component';
import { ViewWorkingDaysComponent } from '../../_admin/view-working-days/view-working-days.component';
import { AttendanceComponent } from '../../_admin/attendance/attendance.component';
import { SiteAttendanceComponent } from '../../_admin/site-attendance/site-attendance.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AMCComponent } from '../../_admin/amc/amc.component';
import { InfoDetailsComponent } from '../../info-details/info-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MaterialModule } from '../material.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MailSettingsComponent } from '../../_admin/mail-settings/mail-settings.component';
import { MailSettingPropertiesComponent } from '../../_admin/mail-setting-properties/mail-setting-properties.component';
import { MatFormFieldModule } from '@angular/material';
import { AttendanceReportComponent } from '../../_admin/attendance-report/attendance-report.component';

@NgModule({
  declarations: [SendAmcInvoiceComponent, AdminComponent,
    ViewWorkingDaysComponent, GenerateWorkingDaysComponent, AttendanceComponent,
    SiteAttendanceComponent, AMCComponent, InfoDetailsComponent, MailSettingsComponent, MailSettingPropertiesComponent, AttendanceReportComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMyDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    AngularEditorModule,
    AutocompleteLibModule,
    MaterialModule,
    OwlDateTimeModule,
    NgxSkeletonLoaderModule,
    OwlNativeDateTimeModule,
    NgxSkeletonLoaderModule,
    AgGridModule,
  ], providers: [DatePipe]
})
export class AdminModule { }
