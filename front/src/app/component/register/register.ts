import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  imports: [CommonModule, NgxSpinnerModule,
    RouterLink,
    ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm!: FormGroup;

  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private route: Router,) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('student_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.fb.group({


      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required]
    },
      {
        validators: this.passwordMatch
      });

  }

  passwordMatch(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;

    const confirm = control.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };

  }

  get f() {
    return this.registerForm.controls;
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  register(): void {
    this.spinner.show();
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.spinner.hide();
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return;
    }
    this.apiservice.postRequest('user/user_register', this.registerForm.value).then((data_suc: any) => {
      console.log("🚀 ~ Register ~ register ~ data_suc:", data_suc)
      this.spinner.hide();
      if (data_suc.status) {
        this.commonservice.openAlert('success', data_suc.message)
        this.route.navigate(['login'])
        localStorage.setItem("student_REGEMAIL", this.registerForm.value.email)
        sessionStorage.setItem("student_REGEMAIL", this.registerForm.value.email)
        this.registerForm.reset()
      }
      else {
        this.commonservice.openAlert('error', data_suc.message)
      }

    })
  }

}
