import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillFormComponent } from './bill-form/bill-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'bills', pathMatch: 'full' },
  { path: 'bills', component: BillListComponent },
  { path: 'bills/new', component: BillFormComponent },
  { path: 'bills/edit/:id', component: BillFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
