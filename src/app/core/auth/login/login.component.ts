import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly FormBuilder = inject(FormBuilder);
  private readonly cookieService = inject(CookieService);

  subscription: Subscription = new Subscription();

  msg: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  // loginForm: FormGroup = new FormGroup({
  //   email: new FormControl('', [
  //     Validators.required,
  //     Validators.email
  //   ]),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(6),
  //     Validators.maxLength(20)
  //   ])
  // });


  loginForm!: FormGroup ;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  submitLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.subscription.unsubscribe(); // Unsubscribe from any previous subscription to avoid memory leaks
      this.subscription = this.authService.loginForm(this.loginForm.value).subscribe({
        next: (response) => {
          this.loginForm.reset();
          this.isLoading = false;

          if (response.message === "success") {
            // save tokeens
            this.cookieService.set('token', response.token);

            this.authService.decodeToken();
            console.log(this.authService.decodeToken());

            // Navigate to home or dashboard page after login
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.msg = err.error.message;
          setTimeout(() => {
            this.msg = '';
          }, 5000);
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getControl(controlName: string): FormControl {
  return this.loginForm.get(controlName) as FormControl;
}

}
