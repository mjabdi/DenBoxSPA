import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Http } from '@angular/http';
import { jsonpCallbackContext } from '../../../node_modules/@angular/common/http/src/module';
import {Observable , Subject} from 'rxjs';
import {map , take} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import {AuthenticationService} from '../services/authentication.service';
import { elementStart } from '../../../node_modules/@angular/core/src/render3/instructions';
import {MatSnackBar} from '@angular/material';

const baseUrl :string = environment.apiUrl;

const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  test : Date = new Date();

  loginUrl = baseUrl + '/api/auth/login';

  loginForm: FormGroup;
  isSubmit: boolean = false;
  hide:boolean;
  returnUrl: string;

  constructor(
    private snackbar : MatSnackBar,
    private toastrService: ToastrService,
     private router: Router, 
     private http: Http, 
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
   
    this.test = new Date();

    this.authenticationService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.hide = true;
    this.loginForm = new FormGroup({
      'username': new FormControl('', [
        Validators.required,
        Validators.maxLength(250)
       //, Validators.pattern(this.EMAIL_REGEX)
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]),
    });
  }

  private  username() : string { return this.loginForm.get('username').value; }
  private  password() :string { return this.loginForm.get('password').value; }




  onSubmit(username,password):boolean {

    username = username.toLowerCase();

    this.isSubmit = true;
    // if (this.loginForm.invalid) {
    //   this.toastrService.error('invalid data');
    //   return false;
    //}
    // else 
     {

      this.authenticationService.login(username,password)
      .subscribe(data => {
          this.snackbar.open('You have successfully logged in','Logged in',{
          duration: 5000,
          panelClass : 'my-snackbar-style'
        });

//          this.toastrService.success('You have successfully logged in','Logged in');
          if (username == 'admin')
            this.router.navigate(['/users']);
          else
            this.router.navigate(['/home']);
          this.isSubmit = false;  
          return true;  
        },
        error =>
        {
          let errormsg : string = error.message;
          if (errormsg.indexOf('404') > 0)
          {
            this.toastrService.error('Invalid username' ,'Login attempt failed');
          }
          else if (errormsg.indexOf('401') > 0)
          {
            this.toastrService.error('Password is wrong' ,'Login attempt failed');
          }
          else
          {
            this.toastrService.error('Server is unavailable' ,'Login attempt failed');
          }  
          this.isSubmit = false;
        }
      );
    }

    return false;
  }


  // onSubmit(formvalue):boolean
  // {
  
  //   this.isSubmit = true;

  //   if (this.loginForm.invalid) {
  //     return false;
  //   }
  //   else
  //   {
  //     this.authenticationService.login(this.loginForm.value)
  //     .subscribe((res) => {
  //       if (res.status == 'success') {
  //         this.toastrService.success('You have successfully login');
  //               if (this.username() == 'admin')
  //                 this.router.navigate(['/users']);
  //               else
  //                this.router.navigate(['/employees']);
  //       }
  //       return true;  
  //     }
  //   this.http.post(this.loginUrl, { '33' , '34324' } )
  //   .pipe(map(user => {
  //       // login successful if there's a jwt token in the response
  //       if (user) {
  //           // store user details and jwt token in local storage to keep user logged in between page refreshes
          
  //           sessionStorage.setItem('currentUser', this.username());
  //           sessionStorage.setItem('userToken' , user.json().token);
            
  //       }

  //   })).pipe(first()).subscribe( data => {
  //     if (this.username() == 'admin')
  //       this.router.navigate(['/users']);
  //     else
  //     this.router.navigate(['/employees']);

  // },
  // error => {
  //   console.error('error: ' + error);
  //   alert('Login attempt failed!');
  // });
  

  //}



  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
} 
  
}