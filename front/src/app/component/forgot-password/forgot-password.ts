import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,
    ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  forgotForm!: FormGroup;


  constructor(private fb: FormBuilder, private commonservice: CommonService, private apiservice: ApiserviceService, private spinner: NgxSpinnerService, private route: Router,) {



  }


  ngOnInit(): void {
    const token = localStorage.getItem('student_TOKEN');

    if (token) {
      this.route.navigate(['/dashboard']);
      return;
    }

    this.forgotForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]]

    });


  }


  get f() {
    return this.forgotForm.controls;
  }


  sendResetLink(): void {
    this.spinner.show();
    if (this.forgotForm.invalid) {
      this.spinner.hide();
      this.forgotForm.markAllAsTouched();

      return;
    }

    console.log('Forgot Password:', this.forgotForm.value);
    const email = { email: this.forgotForm.value.email };
    this.apiservice.postRequest('user/user_forgot', email).then((resdata: any) => {
      if (resdata.status) {
        this.spinner.hide()
        this.commonservice.openAlert("success", resdata.message)
        localStorage.setItem("student_FORMAIL", this.forgotForm.value.email)
        sessionStorage.setItem("student_FORMAIL", this.forgotForm.value.email)
        this.route.navigate(['reset-password'])
      }
      else {
        this.commonservice.openAlert("error", resdata.message)
        this.spinner.hide()

      }
    })


  }



}
