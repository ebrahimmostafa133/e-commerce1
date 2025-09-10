import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from "../../../shared/components/input/input.component";



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  msg:string='';
  isLoading: boolean = false;

  showPassword: boolean = false;
  showRePassword: boolean = false;


  // registerForm: FormGroup = new FormGroup({
  //   name: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(20)
  //   ]),
  //   email: new FormControl('', [
  //     Validators.required,
  //     Validators.email
  //   ]),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(6),
  //     Validators.maxLength(20),
  //     Validators.pattern(
  //       '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$'
  //     )
  //   ]),
  //   rePassword: new FormControl('', [
  //     Validators.required,
  //     this.passwordMatchValidator.bind(this)
  //   ]),
  //   phone: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern('^(01)[0-9]{9}$') 
  //   ])
  // });

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$'
        )
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        this.passwordMatchValidator.bind(this)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^(01)[0-9]{9}$')
      ])
    });
  }


  passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!this.registerForm) return null;
    const password = this.registerForm.get('password')?.value;
    const rePassword = control.value;
    return password === rePassword ? null : { noMatch: true };
  }

  submitForm() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.registerForm(this.registerForm.value).subscribe({
        next: (response) => {
          this.registerForm.reset();
          this.isLoading = false;
          if (response.message === "success") {
            // Handle successful registration
            // Navigate to the login page
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.msg = err.error.message ;
          setTimeout(() => {
            this.msg = '';
          }, 5000);
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }


  getControl(controlName: string): FormControl {
  return this.registerForm.get(controlName) as FormControl;
}
}
