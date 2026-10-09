import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, NgxSpinnerModule,
    RouterLink,
    ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;

  showPassword = false;

  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private route: Router,) {
  }



  ngOnInit(): void {
    const token = localStorage.getItem('student_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }


  get f() {
    return this.loginForm.controls;
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  login(): void {
    this.spinner.show();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.spinner.hide()
      return;
    }
    this.apiservice.postRequest('user/user_login', this.loginForm.value).then((res: any) => {
      console.log("🚀 ~ Login ~ login ~ res:", res)
      if (res.status) {
        this.commonservice.openAlert('success', res.message);
        localStorage.setItem("student_LoginMail", this.loginForm.value.email);
        sessionStorage.setItem("student_LoginMail", this.loginForm.value.email);
        sessionStorage.setItem("student_TOKEN", res.data);
        localStorage.setItem("student_TOKEN", res.data);
        this.loginForm.reset();
        this.spinner.hide()
        this.route.navigate(['dashboard'])

      } else {
        this.spinner.hide()
        this.commonservice.openAlert('error', res.message);
      }

    })

  }
}
