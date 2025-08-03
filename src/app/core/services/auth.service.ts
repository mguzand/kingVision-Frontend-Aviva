import { Injectable } from '@angular/core';
import { LoginPayload } from '../interfaces/login-payload.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile, User } from '../interfaces/profile.interface';
import { environment } from '../../../environments/environment';
import { ChangePasswordBody } from '../interfaces/change-password.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(new User(''));
  public profile$: BehaviorSubject<Profile> = new BehaviorSubject<Profile>({
    firstName: '',
    lastName: '',
    email: '',
    menu: [],
  });

  constructor(private _http: HttpClient) {
    this.profile$.next({
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'nombre@senprende.hn',
      menu: [
      ],
    });
  }

  isValidToken() {
    if (!this.token) return false;

    const token_ = this.parseJWT(this.token!);
    const expFromToken = token_.exp;
    const newDate = new Date();
    const dateFromExp = new Date(expFromToken * 1000);
    return dateFromExp.getTime() > newDate.getTime() || false;
  }

  get token() {
    return localStorage.getItem('token');
  }

  public getCurrentUser(): User {
    const token = localStorage.getItem('token');
    if (token) {
      this.user$.next(new User(this.parseJWT(token)));
    }

    return this.user$.value;
  }

  parseJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload: any = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  login(loginPayload: LoginPayload) {
    return this._http.post<LoginResponse>(
      `${environment.api}/auth/login`,
      loginPayload
    );
  }

  changePassword(body: ChangePasswordBody) {
    return this._http.patch(`${environment.api}/auth/change-password`, body);
  }
}
