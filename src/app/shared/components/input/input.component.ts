import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html'
})
export class InputComponent {
  @Input() control: FormControl | AbstractControl | null = null;
  
  @Input() typeInput!: string;
  @Input() idInput!: string;
  @Input() labelInput!: string;
  @Input() togglePassword: boolean = false;
  @Input() element: string = 'input';

  show: boolean = false;

  asFormControl(): FormControl {
    return this.control as FormControl;
  }

  getInputType(): string {
    if (this.togglePassword && this.typeInput === 'password') {
      return this.show ? 'text' : 'password';
    }
    return this.typeInput;
  }

  // Add safe access to control properties
  get controlTouched(): boolean {
    return this.control?.touched || false;
  }

  get controlValid(): boolean {
    return this.control?.valid || false;
  }

  get controlInvalid(): boolean {
    return this.control?.invalid || false;
  }

  get controlErrors(): any {
    return this.control?.errors || null;
  }

  hasError(errorName: string): boolean {
    return this.control?.hasError(errorName) || false;
  }
}