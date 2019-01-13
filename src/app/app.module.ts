import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { HashLocationStrategy, LocationStrategy, CurrencyPipe } from '@angular/common';

import { HttpClientModule } from '@angular/common/http'; 


import { AppRoutingModule} from './app.routing';
import {AuthGuard} from './services/AuthGuard';

import { AppComponent } from './app.component';


import { AlertService} from './services/alert.service';
import  {UserService } from './services/user.service';


import { HttpErrorHandler }   from './http-error-handler.service';

import { MessageService } from './message.service';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './login/login.component';

import {MaterialModule} from './material/material.module'

import {AuthenticationService} from './services/authentication.service';

import { MomentModule } from 'angular2-moment';
import { ToastrModule } from 'ngx-toastr';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {AuthInterceptor} from './http-interceptors/auth-interceptor'
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { MAT_DATE_LOCALE } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from "@angular/flex-layout";

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import {NgxPaginationModule} from 'ngx-pagination'; 
import { ProductDetailDialog } from './product-detail-dialog/product-detail.dialog';
 
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};

// declare var require: any;

@NgModule({
   imports: [
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      HttpModule,
      RouterModule,
      AppRoutingModule,
      MaterialModule,
      MomentModule,
      CurrencyMaskModule,
      FlexLayoutModule,
      VirtualScrollerModule,
      NgxPaginationModule,
      ToastrModule.forRoot()
      ],
   declarations: [
      AppComponent,
      AdminLayoutComponent,
      LoginComponent,
      HomeComponent,
      ProductDetailDialog
  ],
  providers: [

    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CurrencyPipe,
    AuthGuard,
    UserService,
    HttpErrorHandler,
    MessageService,
    AuthenticationService,
    ],
    entryComponents: [ProductDetailDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
