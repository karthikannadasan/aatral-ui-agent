import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { TaskViewComponent } from 'src/app/_teams/task-view/task-view.component';
import { LeadMailTemplate } from './LeadMailTemplate';

@Component({
  selector: 'app-lead-mail-template-create',
  templateUrl: './lead-mail-template-create.component.html',
  styleUrls: ['./lead-mail-template-create.component.css']
})
export class LeadMailTemplateCreateComponent implements OnInit {

  constructor(public dialog: MatDialog, private lms: LeadManagementService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  template: LeadMailTemplate = new LeadMailTemplate();

  saving = false;
  _mode: string = 'Create'
  _errors = {
    title: '',
    subject: '',
    message: '',
    status: '',
    sendingAt: ''
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '500',
    height: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Mail Message',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };

  ngOnInit() {
    console.log(this.data);
    if (this.data !== undefined) {
      if (this.data.template !== undefined)
        this.template = this.data.template;
    }
  }

  saveMailTemplate() {

    if (this.template.title == '') {
      this._errors.title = `Title Can't be empty`;
    } if (this.template.subject == '') {
      this._errors.subject = `Subject Can't be empty`;
    } if (this.template.message == '') {
      this._errors.message = `Message Can't be empty`;
    } if (this.template.status == '') {
      this._errors.status = `Status Can't be empty`;
    } 
    
    // if (!this.template.daily && !this.template.weekly && !this.template.biweekly && !this.template.monthly && !this.template.bimonthly && !this.template.quarterly) {
    //   this._errors.sendingAt = `Choose atleast one Frequency`;
    // }

    if (this._errors.title != '' || this._errors.subject != '' || this._errors.message != '' || this._errors.status != '' || this._errors.sendingAt != '') {
      this.snackbar.open('Please check errors');
      return false;
    }

    this.saving = true;
    this.lms.saveMailTemplate(this.template).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.template = resp['LeadMailTemplate'];
        this.snackbar.open('Saved Successfully');
        this.dialogRef.close({ action: 'LeadMailTemplate Updated', LeadMailTemplate: this.template });
      }
    }, error => this.saving = false)
  }

  deleteMailTemplate() {
    this.saving = true;
    this.lms.deleteMailTemplate(this.template).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Deleted Successfully');
        this.dialogRef.close({ action: 'LeadMailTemplate Deleted', LeadMailTemplate: this.template });
      }
    }, error => this.saving = false)
  }


}
