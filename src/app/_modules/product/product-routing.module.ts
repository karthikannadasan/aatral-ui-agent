import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from 'src/app/_product/add-product/add-product.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { ViewProductsComponent } from 'src/app/_product/view-products/view-products.component';
import { RequestRawMaterialsComponent } from 'src/app/_product/request-raw-materials/request-raw-materials.component';
import { StockReportComponent } from 'src/app/_product/stock-report/stock-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'view-product', pathMatch: 'full' },
  { path: 'add-product', component: AddProductComponent, data: {}, canActivate: [RoleGuardService] },
  { path: 'view-product', component: ViewProductsComponent, canActivate: [RoleGuardService] },
  { path: 'stock-report', component: StockReportComponent, canActivate: [RoleGuardService] },
  { path: 'fabrication', loadChildren: () => import('./fabrication.module').then(m => m.FabricationModule) },
  { path: '**', redirectTo: 'view-product', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
