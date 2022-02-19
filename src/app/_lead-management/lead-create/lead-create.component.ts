import { Component, OnInit } from '@angular/core';
import { LeadManagementService } from '../../_services/lead-management.service';
import { NeededService } from '../../_services/needed.service';
import { Agent } from '../../_profile/agent-profile/Agent';
import { Lead } from './Lead';
import { Product } from '../../_product/Product';
import { TeamsService } from '../../_services/teams.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { MatSnackBar } from '@angular/material';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

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
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class LeadCreateComponent implements OnInit {

  constructor(private lms: LeadManagementService, private needed: NeededService, private ts: TeamsService,
    private snackbar: MatSnackBar, private route: Router, private actRoute: ActivatedRoute) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);

      if (params['edit']) {
        if (params['edit'] == 1 && params['lid']) {
          this._mode = 'Edit';
          this.loadLeadForEdit(params['lid']);
        }
      }
    })

  }

  saving = false;
  loading = false;
  _mode = 'Create';
  _agents: Array<Agent> = [];
  _lead_sources: Array<string> = ['Advertisement', 'Trade Show', 'Sales Emails', 'Online Store', 'Referral', 'Partner', 'Cold Call', 'Seminar', 'Social Media'];
  _industry_types: Array<string> = [];
  _products: Array<Product> = [];
  _selected_products: Array<string> = [];

  directoryName = 'temp-files/' + this.ts.getRandomString(10);
  _productSTR: string = '';
  filesUploaded = 0;

  lead: Lead = new Lead();

  files: Array<fileUpload> = [];

  _errors = {
    owner: '',
    company: '',
    phone: '',
    altPhone: '',
    email: '',
    altEmail: '',
    website: ''
  }

  ngOnInit() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min', 'products_min']).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this._agents = resp['agents_min'];
        this._products = resp['products_min'];
      }
    }, error => this.loading = false)
  }

  loadLeadForEdit(leadId) {

    this.loading = true;
    this.lms.getLead(leadId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == "00") {
        if (resp['Lead'] != null) {
          this.lead = resp['Lead'];
        } else {
          this.snackbar.open('Lead not found for id #' + leadId);
        }
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.loading = false)
  }

  saveLead() {

    this.checkOwner(); this.checkCompany(); this.checkPhone(); this.checkEmail(); this.checkURL();

    if (this._errors.owner || this._errors.company || this._errors.phone || this._errors.email || this._errors.website) {
      this.snackbar.open('Please Check Errors');
      return;
    }

    let fileNames = '';
    if (this.files.length > 0) {
      this.files.forEach(file => {
        fileNames = fileNames + file.file.name + ';';
      });
      this.lead.files = fileNames;
    }

    this.lms.createLead(this.lead, this.directoryName).subscribe(resp => {
      if (resp['StatusCode'] == "00") {
        this.snackbar.open('Saved Successfully');
        this.route.navigateByUrl('/lead-management/overview/' + resp['Lead']['id']);
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    })
  }

  clear() {
    window.location.href = './lead-management/create';
  }

  productSelected(_event?: string) {
    console.log(_event);
    if (_event !== undefined && _event != null && _event.trim() != '') {

      let prods: Array<string> = this.lead.products.split(';');

      if (prods.find(_prd => _prd == _event) === undefined) {
        if (this.lead.products.length > 0)
          this.lead.products = this.lead.products + ';';

        this.lead.products = this.lead.products + _event;
      }

      this._productSTR = '';
      console.log(":::" + this.lead.products, this._productSTR);
    }
    console.log(this.lead.products);
  }

  removeProduct(_event) {
    let prods: Array<string> = this.lead.products.split(';');
    let _new_prods = [];

    prods.forEach(_prod => {
      if (_prod != _event) {
        _new_prods.push(_prod);
      }
    })

    this.lead.products = '';

    _new_prods.forEach(_prod => {
      if (this.lead.products.length > 0)
        this.lead.products = this.lead.products + ';';

      this.lead.products = this.lead.products + _prod;
    })

    console.log(this.lead.products);
  }

  getProductsAsArray() {
    if (this.lead.products !== undefined && this.lead.products != null && this.lead.products != '')
      return this.lead.products.split(';');
    else
      return [];
  }

  displayNull() {
    this._productSTR = '';
    return null;
  }

  checkOwner() {
    let _owner = this._agents.find(agent => agent.firstName.toLowerCase() == this.lead.ownerName.toLowerCase());
    if (_owner === undefined) {
      this._errors.owner = 'Lead Owner is not valid';
    } else {
      this._errors.owner = '';
      this.lead.ownerEmailId = _owner.emailId;
    }
  }

  checkCompany() {
    if (this.lead.company == '') {
      this._errors.company = 'Company is not valid';
    } else {
      this._errors.company = '';
    }
  }

  checkPhone() {
    if (this.lead.phone != '') {
      if (!this.lms.util.validatePhoneNumber(this.lead.phone))
        this._errors.phone = 'Phone No. is not valid (i.e, 9876543210)';
      else
        this._errors.phone = '';
    } else {
      this._errors.phone = '';
    }
  }

  checkEmail() {
    if (this.lead.email != '') {
      if (!this.lms.util.validateEmail(this.lead.email))
        this._errors.email = 'Email is not valid (e.g. someone@domain.com)';
      else
        this._errors.email = '';
    } else {
      this._errors.email = '';
    }
  }

  checkAltEmail() {
    if (this.lead.alternateEmail != '') {
      if (!this.lms.util.validateEmail(this.lead.alternateEmail))
        this._errors.altEmail = 'Alt. Email is not valid (e.g. someone@domain.com)';
      else
        this._errors.altEmail = '';
    } else {
      this._errors.altEmail = '';
    }
  }

  checkURL() {
    if (this.lead.website != '') {
      if (!this.lms.util.validateWebsiteURL(this.lead.website))
        this._errors.website = 'Website URL is not valid. (e.g. http://www.google.com)';
      else
        this._errors.website = '';
    } else {
      this._errors.website = '';
    }
  }

  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    console.log(files);

    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (file.size > 26214400) {
            this.snackbar.open(`File is exceeds limit 25MB`);
          } else {

            console.log(droppedFile.relativePath, file);

            let _file_upload: fileUpload = {
              file: file,
              progress: 0,
              status: 'uploading'
            }

            this.files.push(_file_upload);

            this.lms.uploadLeadAttachment(file, this.directoryName)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);
                }
                if (resp.type === HttpEventType.Response) {
                  console.log('Upload complete');
                  _file_upload.status = 'Uploaded';
                  this.filesUploaded = this.filesUploaded + 1;
                }
              });
          }
        });
      }
    }
  }

}
