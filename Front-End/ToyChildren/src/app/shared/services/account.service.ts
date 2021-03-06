import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlConstants } from '../utils/url.constants';
import { DataResponse } from 'src/app/models/data-response';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Constant } from '../utils/constant';
import { Customer } from 'src/app/models/customer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public login(username: String, password: String) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ":" + password)
    })

    sessionStorage.removeItem(Constant.HEADERS_SESSION);
    sessionStorage.setItem(Constant.HEADERS_SESSION,headers.get("Authorization"));

    return this.http.get<DataResponse<Object>>(UrlConstants.LOGIN_API_URL, { headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  public _register(account: Object): Observable<DataResponse<Customer>> {
    return this.http.post<DataResponse<Customer>>(UrlConstants.REGISTER_API_URL,JSON.stringify(account), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  public logout() {
    const headers = new HttpHeaders({
      Authorization: sessionStorage.getItem(Constant.HEADERS_SESSION)
    })

    return this.http.get<DataResponse<Object>>(UrlConstants.LOGOUT_API_URL,{headers})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  errorHandl(error: any) {
    let response = new DataResponse<Object>();

    // client-side error
    if (error.error instanceof ErrorEvent) {
      response.code = error.error.code;
      response.message = error.error.message;
    }
    // server-side error
    else {
      response.code = error.status;
      response.message = error.message;
    }
    response.data = null;
    return throwError(response);
  }
}
