import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService } from 'src/app/_services/role-guard.service';


const routes: Routes = [
  { path: 'create', loadChildren: () => import('./lead-management-create/lead-management-create.module').then(m => m.LeadManagementCreateModule), canActivate: [RoleGuardService] },
  { path: 'overview', loadChildren: () => import('./lead-overview/lead-overview.module').then(m => m.LeadOverviewModule), canActivate: [RoleGuardService] },
  { path: 'reports', loadChildren: () => import('./lead-management-reports/lead-management-reports.module').then(m => m.LeadManagementReportsModule), canActivate: [RoleGuardService] },
  { path: 'mail', loadChildren: () => import('./lead-mail-templates/lead-mail-templates.module').then(m => m.LeadMailTemplatesModule), canActivate: [RoleGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadManagementRoutingModule { }
