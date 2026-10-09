import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxSpinnerModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {

  resetForm!: FormGroup;

  showPassword = false;
  showConfirmPassword = false;

  isSubmitted = false;
  ForgotEmail: string | null = localStorage.getItem('student_FORMAIL') ?? sessionStorage.getItem('student_FORMAIL');


  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private route: Router,) {


  }


  ngOnInit(): void {

    const token = localStorage.getItem('traker_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],

        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

  }

  get f() {
    return this.resetForm.controls;
  }


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordMismatch: true
      };
    }

    return null;
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  resetPassword(): void {
    this.spinner.show();
    if (this.resetForm.invalid) {

      this.resetForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }

    console.log('Reset Password:', this.resetForm.value);

    const payload = {
      email: this.ForgotEmail,
      password: this.resetForm.value.password,
      confirmPassword: this.resetForm.value.confirmPassword

    };
    console.log("🚀 ~ ResetPassword ~ resetPassword ~ payload:", payload)

    this.apiservice.postRequest('user/forgot_update', payload).then((suc: any) => {
      this.spinner.hide();
      if (suc.status) {
        this.commonservice.openAlert('success', suc.message);
        localStorage.setItem("student_REGEMAIL", this.resetForm.value.email);
        sessionStorage.setItem("student_REGEMAIL", this.resetForm.value.email);
        this.route.navigate(['login']);
        this.resetForm.reset();
        this.spinner.hide()
      } else {
        this.spinner.hide()
        this.commonservice.openAlert('error', suc.message);
      }
    });


  }

}
