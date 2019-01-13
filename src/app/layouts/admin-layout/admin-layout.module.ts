import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import {MaterialModule} from '../../material/material.module';

import {AuthenticationService} from '../../services/authentication.service';

import { MomentModule } from 'angular2-moment';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter'



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MaterialModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  declarations: [

  ],
  providers: [AuthenticationService,{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }],
  entryComponents: []
})

export class AdminLayoutModule {}
