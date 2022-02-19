import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadOverviewRoutingModule } from './lead-overview-routing.module';
import { MatProgressBarModule, MatIconModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatDialogModule, MatExpansionModule, MatTableModule, MatSortModule, MatMenuModule } from '@angular/material';
import { LeadOverviewComponent } from 'src/app/_lead-management/lead-overview/lead-overview.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';
import { LeadTaskComponent } from '../../../_lead-management/lead-task/lead-task.component';
import { LeadMeetingComponent } from '../../../_lead-management/lead-meeting/lead-meeting.component';
import { LeadActivitiesComponent } from '../../../_lead-management/lead-activities/lead-activities.component';
import { FormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [LeadOverviewComponent, LeadTaskComponent, LeadMeetingComponent, LeadActivitiesComponent],
  imports: [
    CommonModule,
    LeadOverviewRoutingModule,
    NgxFileDropModule, NgxFilesizeModule,
    MatProgressBarModule, MatIconModule, MatTabsModule, FormsModule, MatDatepickerModule,
    MatInputModule, MatDialogModule, MatTableModule, MatSortModule, NgxMatDatetimePickerModule,
    MatMenuModule,
    NgxMatTimepickerModule, NgxMatNativeDateModule,
  ],
  entryComponents: [LeadTaskComponent, LeadMeetingComponent]
})
export class LeadOverviewModule { }
