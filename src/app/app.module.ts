import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillFormComponent } from './bill-form/bill-form.component';

@NgModule({
  declarations: [AppComponent, BillListComponent, BillFormComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
