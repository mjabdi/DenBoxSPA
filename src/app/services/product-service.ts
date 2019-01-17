import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError,map } from 'rxjs/operators';

import { environment } from 'environments/environment';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { Product } from 'app/models/product';


const baseUrl :string = environment.apiUrl;

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json'
    })
  };


//  const decompressResponse = require('decompress-response');

@Injectable()
export class ProductService {

    private searchUrl = baseUrl + '/product/search/';
    private getAllUrl = baseUrl + '/product/';

    private getAllUrl3 = "https://api.talktoleadsnow.com/api/js/download.json";
    // private getAllUrlZip = baseUrl + '/product/';

    private searchUrl2 = 'https://denboxqueryfunction.azurewebsites.net/api/DenboxQueryFunction?code=Idek5RhnpWBJDSa6ydknmcoI7Csag8J0KMGkSNpQWsN6m2ztAiLqWg==';


    handleError: HandleError;
    
    constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandler) { 
        this.handleError = httpErrorHandler.createHandleError('SearchService');
    }

    findProducts(search : string) : Observable<Product[]> {
        return this.http.get<Product[]>(this.searchUrl + search).pipe(
            map((data : Product[]) => {
                if (data.length > 0)
                    data[0].searchString = search;
                else
                {
                    var product = new Product();
                    product.name = 'No Records';
                    product.searchString = search;
                    data.push(product)    
                }
                return data;
            } )
            );
    }


    getAll() : Observable<Product[]> {
        return this.http.get<Product[]>(this.getAllUrl);
    }


    getAll3() : Observable<Product[]> {
        return this.http.get<Product[]>(this.getAllUrl3);
    }
    // getAllZip() : Observable<Product[]> {
    //     return this.http.get<any>(this.getAllUrlZip).pipe(map ((data : any) => { 
    //         return  <Product[]>JSON.parse(decompressResponse(data));
    //     }));
    // }


    findProducts2(search : string) : Observable<Product[]> {

        return this.http.post<Product[]>(this.searchUrl2, {search : search , httpOptions}).pipe(
            map((data : Product[]) => {
                if (data.length > 0)
                    data[0].searchString = search;
                else
                {
                    var product = new Product();
                    product.name = 'No Records';
                    product.searchString = search;
                    data.push(product)    
                }    
                return data;
            } )
            );
    }

    getAll2() : Observable<Product[]> {
        return this.http.get<Product[]>(this.searchUrl2);
    }

    // getAll2Zip() : Observable<Product[]> {
    //     return this.http.get<any>(this.searchUrl2).pipe(map ((data : any) => { 
    //         return  <Product[]>JSON.parse(decompressResponse(data));
    //     }));
    // }


}