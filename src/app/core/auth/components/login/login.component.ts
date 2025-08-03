import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    NgxSpinnerModule
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public showPassword: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _loadingService: LoadingService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  changeEyeIcon() {
    this.showPassword = !this.showPassword;
  }

  initForm() {
    //Nombre del usuario almacenado en el localStorage
    const rememberUserName = localStorage.getItem('username');

    this.loginForm = this._fb.group({
      username: [rememberUserName || '', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: !!rememberUserName,
    });
  }

  onSubmit() {
    this._loadingService.onDisplayLoading();
    const { remember, ...loginData } = this.loginForm.value;

    this._authService.login({
      ...loginData,
    })
      .pipe(finalize(() => this._loadingService.onHideLoading()))
      .subscribe({
        next: (res: any) => {
          if (remember) localStorage.setItem('username', loginData.username);
          localStorage.setItem('token', res.token);
          this._router.navigateByUrl('/');
        }, error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      })
  }


}
