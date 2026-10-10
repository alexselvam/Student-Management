import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';

import { CommonService } from '../../service/common/common-service';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';

import {
  NgxSpinnerModule,
  NgxSpinnerService
} from 'ngx-spinner';

@Component({
  selector: 'app-add-student',

  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule, Header, Footer, FormsModule, RouterLink],

  templateUrl: './add-student.html',
  styleUrl: './add-student.scss'
})
export class AddStudent {

  studentForm: FormGroup;

  submitted = false;

  isEditMode = false;

  studentId = '';

  islogin: any =
    localStorage.getItem('student_TOKEN') ??
    sessionStorage.getItem('student_TOKEN') ??
    null;

  profile_data: any;

  maxDate: string = '';
  isViewMode = false;


  constructor(
    private fb: FormBuilder,
    private commonservice: CommonService,
    private apiservice: ApiserviceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

    if (!this.islogin) {
      window.location.href = '/';
    }


    this.studentForm = this.fb.group({

      // ============================
      // PERSONAL INFORMATION
      // ============================

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      dob: [
        '',
        Validators.required
      ],

      gender: [
        '',
        Validators.required
      ],

      status: ['Active', Validators.required],


      // ============================
      // ACADEMIC INFORMATION
      // ============================

      studentId: [
        '',
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      className: [
        '',
        Validators.required
      ],

      section: [
        '',
        Validators.required
      ],

      admissionDate: [
        '',
        Validators.required
      ],


      // ============================
      // PARENT INFORMATION
      // ============================

      parentName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      parentPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s]{10}$/)
        ]
      ],


      // ============================
      // ADDRESS
      // ============================

      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(250)
        ]
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      state: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      country: [
        'India',
        Validators.required
      ]

    });

  }




  ngOnInit(): void {

    const today = new Date();

    this.maxDate =
      today.toISOString().split('T')[0];


    this.getprofile();


    this.activatedRoute.queryParams.subscribe(params => {

      const id = params['id'];
      const mode = params['mode'];


      // ==========================================
      // CREATE
      // ==========================================

      if (!id) {

        this.isEditMode = false;
        this.isViewMode = false;

        this.studentId = '';

        this.studentForm.enable();

        return;
      }


      // ==========================================
      // EDIT
      // ==========================================

      if (id && mode === 'edit') {

        this.isEditMode = true;
        this.isViewMode = false;

        this.studentId = id;

        this.studentForm.enable();

        this.getStudentDetails(id);

        return;
      }


      // ==========================================
      // VIEW
      // ==========================================

      if (id && mode === 'view') {

        this.isEditMode = false;
        this.isViewMode = true;

        this.studentId = id;

        this.getStudentDetails(id);

        return;
      }

    });

  }



  get f() {
    return this.studentForm.controls;
  }



  async getprofile(): Promise<void> {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest(
          'user/profile'
        );

      this.spinner.hide();

      console.log(
        'Profile Response:',
        res
      );


      if (res?.status) {

        this.profile_data = res.data;

        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert(
          'error',
          res?.message ||
          'Failed to fetch profile.'
        );

      }

    } catch (err) {

      this.spinner.hide();

      console.error(
        'Profile Error:',
        err
      );

    }

  }


  async getStudentDetails(studentId: string): Promise<void> {

    try {

      this.spinner.show();

      const res: any =
        await this.apiservice.getRequest(
          `user/get_Student/${studentId}`
        );

      this.spinner.hide();

      if (res?.status === true) {

        const student = res.data;

        this.studentForm.patchValue({

          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          phone: student.phone || '',

          dob: this.formatDate(student.dob),

          gender: student.gender || '',

          status: student.status || 'Active',

          studentId: student.studentId || '',

          className: student.className || '',

          section: student.section || '',

          admissionDate:
            this.formatDate(student.admissionDate),

          parentName:
            student.parentName || '',

          parentPhone:
            student.parentPhone || '',

          address:
            student.address || '',

          city:
            student.city || '',

          state:
            student.state || '',

          country:
            student.country || 'India'

        });


        // VIEW MODE
        if (this.isViewMode) {

          this.studentForm.disable();

        } else {

          this.studentForm.enable();

        }


        this.cdr.detectChanges();

      } else {

        this.commonservice.openAlert(
          'error',
          res?.message || 'Student not found.'
        );

      }

    } catch (error: any) {

      this.spinner.hide();

      console.error(
        'Get Student Details Error:',
        error
      );

      this.commonservice.openAlert(
        'error',
        error?.error?.message ||
        'Something went wrong.'
      );

    }

  }


  formatDate(date: any): string {

    if (!date) {
      return '';
    }


    const d = new Date(date);


    if (isNaN(d.getTime())) {
      return '';
    }


    return d
      .toISOString()
      .split('T')[0];

  }


  async submitStudent(): Promise<void> {

    this.submitted = true;


    this.studentForm.markAllAsTouched();


    // ============================
    // VALIDATION
    // ============================

    if (this.studentForm.invalid) {

      this.spinner.hide();

      return;

    }


    const studentData =
      this.studentForm.getRawValue();


    console.log(
      this.isEditMode
        ? 'Update Student Data:'
        : 'Add Student Data:',
      studentData
    );


    try {

      this.spinner.show();


      let res: any;


      // ========================================================
      // EDIT MODE
      // ========================================================

      if (this.isEditMode) {


        const payload = {

          studentId:
            this.studentId,

          ...studentData

        };


        console.log(
          'Update Payload:',
          payload
        );


        res =
          await this.apiservice.postRequest(
            'user/update_Student',
            payload
          );


      }

      // ========================================================
      // CREATE MODE
      // ========================================================

      else {


        res =
          await this.apiservice.postRequest(
            'user/add_Student',
            studentData
          );

      }


      console.log(
        this.isEditMode
          ? 'Update Student Response:'
          : 'Add Student Response:',
        res
      );


      this.spinner.hide();


      // ========================================================
      // SUCCESS
      // ========================================================

      if (res?.status === true) {


        this.commonservice.openAlert(
          'success',
          res.message ||
          (
            this.isEditMode
              ? 'Student updated successfully.'
              : 'Student added successfully.'
          )
        );
        this.router.navigate(
          ['/students']
        );

        // ============================
        // EDIT
        // ============================

        if (this.isEditMode) {

          this.router.navigate(
            ['/students']
          );

        }


        // ============================
        // CREATE
        // ============================

        else {

          this.studentForm.reset({

            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',

            studentId: '',
            className: '',
            section: '',
            admissionDate: '',

            parentName: '',
            parentPhone: '',

            address: '',
            city: '',
            state: '',

            country: 'India'

          });


          this.submitted = false;

        }

      }

      // ========================================================
      // API FAILURE
      // ========================================================

      else {


        this.commonservice.openAlert(
          'error',
          res?.message ||
          (
            this.isEditMode
              ? 'Failed to update student.'
              : 'Failed to add student.'
          )
        );

      }


    } catch (error: any) {


      this.spinner.hide();


      console.error(
        this.isEditMode
          ? 'Update Student API Error:'
          : 'Add Student API Error:',
        error
      );


      this.commonservice.openAlert(
        'error',
        error?.error?.message ||
        'Something went wrong.'
      );

    }

  }



  cancelForm(): void {

    if (this.isEditMode) {

      this.router.navigate(
        ['/students']
      );

    } else {

      this.resetForm();

    }

  }


  goToEdit(): void {

    if (!this.studentId) {
      return;
    }

    this.router.navigate(
      ['/student_add'],
      {
        queryParams: {
          id: this.studentId,
          mode: 'edit'
        }
      }
    );

  }


  resetForm(): void {

    this.submitted = false;


    this.studentForm.reset({

      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      status: 'Active',
      studentId: '',
      className: '',
      section: '',
      admissionDate: '',

      parentName: '',
      parentPhone: '',

      address: '',
      city: '',
      state: '',

      country: 'India'

    });

  }

}