import { Component, OnInit } from '@angular/core';
import { LatterpadDeal } from './LetterpadDeal';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-create-letterpad',
  templateUrl: './create-letterpad.component.html',
  styleUrls: ['./create-letterpad.component.css']
})
export class CreateLetterpadComponent implements OnInit {

  constructor(private ss: SalesService) { }

  _institutes: Array<Institute> = [];
  _selectedInstitute = [];

  ngOnInit() {
  }

  deal: LatterpadDeal = new LatterpadDeal();

  copyBillingAddressFromInstitute() {
    this.deal.billingTo = '';
    this.deal.billingStreet1 = this.deal.institute.street1;
    this.deal.billingStreet2 = this.deal.institute.street2;
    this.deal.billingCity = this.deal.institute.city;
    this.deal.billingState = this.deal.institute.state;
    this.deal.billingCountry = this.deal.institute.country;
    this.deal.billingZIPCode = this.deal.institute.zipcode;
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadAllInstituteContacts(inst) {

    this._institutes
      .filter(institute => institute.instituteId == inst.instituteId)
      .forEach(institute => { this.deal.institute = institute; console.log(institute) });
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products']).subscribe(res => {
      this._institutes = res['Institutes'];
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.deal.institute = inst;
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('Institute Id::::::', inst.instituteId);
          });
      };
    })
  }


  clear()
  {}

  save()
  {}

}
