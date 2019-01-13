import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'environments/environment';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


const baseUrl :string = environment.apiUrl;

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json'
    })
  };


@Injectable()
export class UserService {

    userUrl = baseUrl + '/api/user';
    handleError: HandleError;
    
    constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandler) { 
        this.handleError = httpErrorHandler.createHandleError('HeroesService');
    }

    getAllUsers() : Observable<any[]> {
        return this.http.get<any[]>(this.userUrl)
      .pipe(
        catchError(this.handleError('getAllUsers', []))
      );
    }

    getById(id: string) {
        return this.http.get(this.userUrl + '/' + id);
    }

    create(user: any) {
        return this.http.post(this.userUrl, user);
    }

    update(user: any) {
        return this.http.put(this.userUrl + '/' + user.username, user);
    }

    delete(id: string) {
        return this.http.delete(this.userUrl + '/'+ id);
    }
}