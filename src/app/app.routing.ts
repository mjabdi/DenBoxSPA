import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthGuard} from './services/AuthGuard'
import { HomeComponent } from './home/home.component';


const routes: Routes =[
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
 
  { 
    path: 'home',   
    component: HomeComponent
  },

  { 
    path: 'login',   
    component: LoginComponent
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],  
  exports: [
  ],
})
export class AppRoutingModule { }

