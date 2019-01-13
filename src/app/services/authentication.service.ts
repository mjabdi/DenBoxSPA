import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable , Subject} from 'rxjs';
import {map , take} from 'rxjs/operators';
import { environment } from 'environments/environment';

const baseUrl :string = environment.apiUrl;

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json'
    })
  };

@Injectable()
export class AuthenticationService {

    loginUrl = baseUrl + '/api/auth/login';
    changePasswordlUrl = baseUrl + '/api/auth/changepassword';

    constructor(private http: HttpClient) {
    }

    login(username :string, password : string) {


        return this.http.post<any>(this.loginUrl, {username,password}).pipe(
            map(data => {
                if (data)
                {
                    sessionStorage.setItem('currentUser', username);
                    sessionStorage.setItem('userToken' , data.token);              
                }
            }
            )
        );
    }

    changePassword(username : string,_oldPassword : string,_newPassword : string)
    {
        var oldPassword =  _oldPassword;
        var newPassword =  _newPassword;

        return this.http.post<any>(this.changePasswordlUrl, {username,oldPassword,newPassword},httpOptions);
    }  


    logout() {
        sessionStorage.clear();
    }

    getUsername() {
        return sessionStorage.getItem('currentUser');

    }

    getUserToken() {
        return sessionStorage.getItem('userToken');

    }
    
    isLogin() {
        if (sessionStorage.getItem('currentUser')) {
            return true;
        }
        return false;
    }
    
    getAuthorizationToken() {
        return  'Bearer:' +  this.getUserToken();
      }

}