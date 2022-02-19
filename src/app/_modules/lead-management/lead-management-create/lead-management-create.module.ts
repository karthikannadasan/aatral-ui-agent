import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadManagementCreateRoutingModule } from './lead-management-create-routing.module';
import { LeadCreateComponent } from '../../../_lead-management/lead-create/lead-create.component';
import { MatAutocompleteModule, MatButtonToggleModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatSnackBarModule, MatChipsModule, MatButtonModule, MatDatepickerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';


@NgModule({
  declarations: [LeadCreateComponent],
  imports: [
    CommonModule,
    LeadManagementCreateRoutingModule,
    FormsModule,
    MatSnackBarModule, MatFormFieldModule, MatProgressBarModule, MatInputModule, MatCheckboxModule,
    MatButtonToggleModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatChipsModule,
    MatButtonModule, MatDatepickerModule,
    NgxFileDropModule,
    NgxFilesizeModule
  ]
})
export class LeadManagementCreateModule { }
