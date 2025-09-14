import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/components/input/input.component'; // ✅ adjust path if needed
import { decode } from 'punycode';

@Component({
  selector: 'app-profile',
  standalone: true, // ✅ mark as standalone
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent // ✅ import your custom input
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  userData: any; // to hold current user profile

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^01[0-9]{9}$/)
      ]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });

    // ✅ decode token to get id
    const decoded = this.authService.decodeToken();
    if (decoded?.id) {
      this.authService.getUserDataById(decoded.id).subscribe({
        next: (res) => {
          this.userData = res.data;                
          this.profileForm.patchValue(res.data);  
        },

        error: () => {
          this.toastr.error('Failed to load profile data');
        }
      });
    }
  }




  // ✅ custom validator for matching passwords
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const rePass = form.get('rePassword')?.value;
    return pass === rePass ? null : { noMatch: true };
  }

  onUpdateProfile(): void {
  // collect only dirty and non-empty fields
  const updatedData: any = {};
  Object.keys(this.profileForm.controls).forEach(key => {
    const control = this.profileForm.get(key);
    if (control?.dirty && control.value?.trim() !== '') {
      updatedData[key] = control.value;
    }
  });

  if (Object.keys(updatedData).length === 0) {
    this.toastr.info('No changes detected');
    return;
  }

  this.authService.updateUserData(updatedData).subscribe({
    next: () => {
      this.toastr.success('Profile updated successfully');

      // ✅ update local userData so HTML reflects changes
      this.userData = { ...this.userData, ...updatedData };

      this.profileForm.markAsPristine();
    },
    error: (err) => {
      this.toastr.error(err.error.message || 'Failed to update profile');
    },
  });
}




  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    this.authService.updateUserPassword(this.passwordForm.value).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to change password');
      },
    });
  }
}
