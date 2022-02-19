import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MailService } from 'src/app/_services/mail.service';
import { UtilService } from 'src/app/_services/util.service';
import { MailProperties } from './MailProperties';

@Component({
  selector: 'app-mail-setting-properties',
  templateUrl: './mail-setting-properties.component.html',
  styleUrls: ['./mail-setting-properties.component.css']
})
export class MailSettingPropertiesComponent implements OnInit {

  constructor(private mailServ: MailService, private util: UtilService, private snackbar: MatSnackBar) { }

  @Input() configFor;
  property: MailProperties;

  loading = false;

  ngOnInit() {
    this.getMailSettingProperties();
  }

  getMailSettingProperties() {
    this.loading = true;
    this.mailServ.getMailSettingProperties(this.configFor).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.property = resp['MailProperties'];
      }
    }, error => this.loading = false)
  }

  saveSettings() {

    if (this.property.active) {
      if (!this.util.validateEmail(this.property.username)) {
        this.snackbar.open('Email Id is not Valid');
        return;
      } else if (this.property.password === undefined || this.property.password == null || this.property.password == '') {
        this.snackbar.open('Password is not Valid');
        return;
      }
    }

    this.mailServ.saveMailProperties(this.property).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.property = resp['MailProperties'];
        this.snackbar.open('Saved Successfully');
      } else {
        this.snackbar.open('Cannot save Settings, Try later.');
      }
    })

  }

}
