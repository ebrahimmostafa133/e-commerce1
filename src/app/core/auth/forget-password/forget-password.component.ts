import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  imports: [InputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  private readonly fb =inject(FormBuilder);
  private readonly authService =inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly toasterServices = inject(ToastrService);
  



  step:number=1;
  labeledEmail:string='';
  verifyEmail!:FormGroup;
  verifyCode!:FormGroup;
  verifyPassword!:FormGroup;


  ngOnInit():void{
    this.initForm();
  }

  initForm():void {
    this.step =1;
    this.verifyEmail =this.fb.group(
      {
        email:[null,[Validators.required ,Validators.email]]
      }
    );
    this.verifyCode =this.fb.group(
      {
        resetCode:[null,[Validators.required ]]
      }
    );
    this.verifyPassword =this.fb.group(
      {
        email:[null,[Validators.required ,Validators.email]],
        newPassword:[null,[Validators.required,Validators.minLength(6), Validators.maxLength(20)]]
      }
    );
  }

  formStep1(): void {
    if (this.verifyEmail.valid) {
      this.authService.submitVerifyEmail(this.verifyEmail.value).subscribe({
        next: (res) => {
          console.log(res);
          const emailValue = this.verifyEmail.get('email')?.value;

          // save and patch email
          this.labeledEmail = emailValue;
          this.verifyPassword.patchValue({ email: emailValue });

          // disable the email input (so user can’t change it in Step 3)
          this.verifyPassword.get('email')?.disable();
          this.step = 2;
          this.toasterServices.success(res.message);
        },
      });
    }
  }

  formStep2(): void {
    if (this.verifyCode.valid) {
      this.authService.submitVerifyCode(this.verifyCode.value).subscribe({
        next: (res) => {
          console.log(res);
          this.step = 3;
          this.toasterServices.success(res.status);

        },
      });
    }
  }

  formStep3(): void {
    if (this.verifyPassword.valid) {
      this.authService.submitResetPassword(this.verifyPassword.getRawValue()).subscribe({
        next: (res) => {
          this.toasterServices.success("Your password has been changed successfully", "FreshCart");
          this.step = 1; 
          console.log(res);
          this.cookieService.set('token',res.token);
          this.router.navigate(['/login']);
        },
      });
    }
  }

}
