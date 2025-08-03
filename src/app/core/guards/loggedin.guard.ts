import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedinGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router
  ) { }
  
  get isLoggedIn() {
    return this._authService.isValidToken()
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    if (!this.isLoggedIn) {
      this._router.navigate(['/auth/login'])
    }
    return this.isLoggedIn
  }
}