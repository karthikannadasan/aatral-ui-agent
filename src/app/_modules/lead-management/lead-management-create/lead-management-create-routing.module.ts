import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadCreateComponent } from 'src/app/_lead-management/lead-create/lead-create.component';


const routes: Routes = [
  { path: '', component: LeadCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadManagementCreateRoutingModule { }
