import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/_services/auth.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { environment } from 'src/environments/environment';
import { Letterpad } from './Letterpad';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';

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
  selector: 'app-letter-pad',
  templateUrl: './letter-pad.component.html',
  styleUrls: ['./letter-pad.component.css']
})
export class LetterPadComponent implements OnInit {

  letterpad: Letterpad = new Letterpad();
  letterpadAll: Array<Letterpad> = [];

  id ='';
  toAddress = '';
  content='';
  subject='';
  regardText='';
  letterPadDate='';
  fileName='';
  fileSize='';
  fileType='';
  showViewDiv = true;
  showAddNewDiv = false;
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  signatureBy ='';
  designation = this.auth.getLoginAgentDesignation();
  loading = false;
  saving = false;
  receiptContent = "";
  showReceiptTemplate = false;
  receiptTemplate = "";
  generatingCallReportPDF=false;
  generatingPDF = false;

  

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

 
  constructor(private route: Router, private snackbar: MatSnackBar, private ts: TicketService,
    private actRoute: ActivatedRoute, private auth: AuthService, private datePipe: DatePipe,private ss: SalesService) { }


    
  ngOnInit() {
    this.loadInstituteDetails();
    this.loadLetterpad();
  }

  onSelectInstitute(inst) {
   // this.ts.getCallreport(inst.instituteId).subscribe(res => {
    //   console.log(res);
      
    // })

  }

  rowData = [];
  showFilterScreen = true;
  showQuoteFilterScreen = false;
  //_institutes = [];
  _institutes: Array<Institute> = [];
  _selectedInstitute = [];

  columnDefs = [
    {
      headerName: 'id', field: 'letterpadAll.id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/create?edit=1&did=${this.letterpad.id}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.id}/deal" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    { headerName: 'Institute', field: 'institute.instituteName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Subject', field: 'subject', width: 120, sortable: true, filter: true, resizable: true },
    
    {
      headerName: 'Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }

  ];


  loadLetterpad()
  {
    this.ts.loadLetterpad().subscribe(res=>{

  if(res['StatusCode']='00'){

   this.letterpadAll =res['AllLetterpads'];

 }

    })
  }
  

  saveLetterpad()
{
this.ts.saveLetterpad(this.letterpad).subscribe(res=>{

  if(res['StatusCode']=='00')
  {
    this.snackbar.open('Saved Successfully');
    this.letterpad = res['letterpad'];
    window.location.href = "./reports/letterpad";

  }
},error=>{

})
}

  clear() {
    window.location.href = "./reports/reports/letterpad";
  }

  deleteLetterpad(id) {
    this.ts.deleteLetterpad(id).subscribe(res => {
      if (res['StatusCode'] == '00') {
              this.snackbar.open('Deleted');
              window.location.href = "./reports/letterpad";
      }
    },
    error=>{
      

    })
  }

  
  generateLetterpad(letterpadAll) {
    this.generatingPDF = true;
    this.ts.generateLetterPad(letterpadAll.id, this.addSign,this.addRoundSeal,this.addFullSeal).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.generatingPDF =false;
        this.letterpad = res['Letterpad'];
        this.snackbar.open('Generated Successfully', 'OK');
        window.location.href = "./reports/letterpad";
      }
    },
    error=>{
      this.generatingPDF =false;
    })
  }

  viewPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/view/' + id+ '/' + fileName;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }
  
  downloadPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/download/' + id + '/' + fileName;
    window.open(url, '_blank');
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  dateChanged(event) {
    console.log(event);
  }

  _search_filters = {
    institutes: [],
    quoteNo: '',
    quoteSubject: '',
    quoteDateObject: null,
    quoteDateFrom: null,
    quoteDateTo: null,
    quoteValidDateObject: null,
    quoteValidDateFrom: null,
    quoteValidDateTo: null,
    quoteStage: '',

   
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products']).subscribe(res => {
      this._institutes = res['Institutes'];
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.letterpad.institute = inst;
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('Institute Id::::::', inst.instituteId);
          });
      };
    })
  }


}
