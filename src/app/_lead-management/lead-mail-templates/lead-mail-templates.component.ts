import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { LeadMailTemplateCreateComponent } from '../lead-mail-template-create/lead-mail-template-create.component';
import { LeadMailTemplate } from '../lead-mail-template-create/LeadMailTemplate';

@Component({
  selector: 'app-lead-mail-templates',
  templateUrl: './lead-mail-templates.component.html',
  styleUrls: ['./lead-mail-templates.component.css']
})
export class LeadMailTemplatesComponent implements OnInit {

  constructor(public dialog: MatDialog, private lms: LeadManagementService, private datePipe: DatePipe) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  loading = false;
  showFilterScreen = true;
  templates: Array<LeadMailTemplate> = [];
  frameworkComponents: any;

  _filters = {
    title: '',
    subject: '',
    message: '',
    status: [],
    sendingAt: [],
  }

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openEditTemplateDialog.bind(this),
        label: null
      }
    },
    { headerName: 'Id', field: 'id', hide: true },
    { headerName: 'Title', field: 'title', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Frequency', field: 'frequency', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Enabled', field: 'enabled', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == true)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Updated Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    }
  ];

  ngOnInit() {
    this.searchLeadMailTemplates();
  }

  openEditTemplateDialog(data) {
    if (data.rowData) {
      this.openMailTemplateCreate(data.rowData);
    }
  }

  openMailTemplateCreate(template?: LeadMailTemplate) {
    const dialogRef = this.dialog.open(LeadMailTemplateCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { template: template }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['action'] == 'LeadMailTemplate Updated') {
        this.searchLeadMailTemplates();
      } else if (result !== undefined && result['action'] == 'LeadMailTemplate Deleted') {
        this.searchLeadMailTemplates();
      }
    });
  }

  searchLeadMailTemplates() {
    this.loading = true;
    this.lms.searchLeadMailTemplates(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.templates = resp['LeadMailTemplates'];
      }
    }, error => this.loading = false)
  }

  clearFilters() {
    this._filters = {
      title: '',
      subject: '',
      message: '',
      status: [],
      sendingAt: [],
    }
  }
}
