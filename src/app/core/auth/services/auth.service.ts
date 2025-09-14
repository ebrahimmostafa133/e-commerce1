import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '../../models/decoded-token.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  registerForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signup', data);
  }

  loginForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signin', data);
  }

  submitVerifyEmail(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/forgotPasswords', data);
  }

  submitVerifyCode(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/verifyResetCode', data);
  }

  submitResetPassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'auth/resetPassword', data);
  }

  updateUserData(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/updateMe', data);
  }

  updateUserPassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/changeMyPassword', data);
  }

  logout():void {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }

  decodeToken(): DecodedToken | null {
    try {
      const token = this.cookieService.get('token');
      if (!token) {
        this.logout();
        return null;
      }
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      this.logout();
      return null;
    }
  }

  getUserDataById(id: string): Observable<any> {
  return this.httpClient.get(environment.baseUrl + 'users/' + id);
}



}
