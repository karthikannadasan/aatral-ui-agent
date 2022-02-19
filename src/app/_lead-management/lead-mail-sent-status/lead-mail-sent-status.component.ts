import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { LeadMailSentStatus } from './LeadMailSentStatus';

@Component({
  selector: 'app-lead-mail-sent-status',
  templateUrl: './lead-mail-sent-status.component.html',
  styleUrls: ['./lead-mail-sent-status.component.css']
})
export class LeadMailSentStatusComponent implements OnInit {


  constructor(public dialog: MatDialog, private lms: LeadManagementService, private datePipe: DatePipe) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  loading = false;
  showFilterScreen = true;
  status: Array<LeadMailSentStatus> = [];
  frameworkComponents: any;

  _filters = {
    leadId: '',
    templateId: '',
    mailId: '',
    mailCC: '',
    leadCompany: '',//
    leadTitle: '',//
    leadSubject: '',///
    leadMessage: '',//
    leadStatus: '',//
    sendDateObject: null,
    sendDateFrom: null,
    sendDateTo: null,
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openViewStatusDialog.bind(this),
        label: null
      }
    },
    { headerName: 'Company', field: 'lead.company', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Subject', field: 'status.subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'To', field: 'status.mailTo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'CC', field: 'status.mailCC', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Lead Status', field: 'lead.status', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Sent Status', field: 'status.status', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Sent Date', field: 'status.createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }
  ];

  ngOnInit() {
    this.openViewStatusDialog();
  }

  openViewStatusDialog() {

  }

  searchLeadMailSentStatus() {
    this.loading = true;
    this.lms.searchLeadMailSentStatus(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.status = resp['LeadMailSentStatus'];
      }
    }, error => this.loading = false)
  }

  clearFilters() {
    this._filters = {
      leadId: '',
      templateId: '',
      mailId: '',
      mailCC: '',
      leadCompany: '',
      leadTitle: '',
      leadSubject: '',
      leadMessage: '',
      leadStatus: '',
      sendDateObject: null,
      sendDateFrom: null,
      sendDateTo: null,
    }
  }

}
