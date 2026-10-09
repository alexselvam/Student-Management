import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Footer } from '../footer/footer';
import { Header } from '../header/header';

import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule,
    RouterLinkActive,
    Header,
    Footer,
    RouterLink,
    NgxSpinnerModule
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.scss',
})
export class Dashboard {


  currentDate = new Date();

  totalStudents = 0;

  activeStudents = 0;

  inactiveStudents = 0;

  newAdmissions = 0;

  totalClasses = 0;


  maleStudents = 0;

  femaleStudents = 0;

  otherStudents = 0;


  classData: any[] = [];




  recentStudents: any[] = [];



  stats: any[] = [];
  islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  constructor(
    private apiservice: ApiserviceService,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    
    if (!this.islogin) {
      window.location.href = '/';
    }
  }



  ngOnInit(): void {

    this.getDashboard();

  }



  async getDashboard(): Promise<void> {

    try {

      this.spinner.show();


      const res: any =
        await this.apiservice.getRequest(
          'user/dashboard'
        );


      this.spinner.hide();


      console.log(
        'Dashboard Response:',
        res
      );


      if (res?.status === true) {

        const data = res.data;


        // ======================================
        // STATS
        // ======================================

        this.totalStudents =
          data?.stats?.totalStudents || 0;


        this.activeStudents =
          data?.stats?.activeStudents || 0;


        this.inactiveStudents =
          data?.stats?.inactiveStudents || 0;


        this.newAdmissions =
          data?.stats?.newAdmissions || 0;


        this.totalClasses =
          data?.stats?.totalClasses || 0;


        // ======================================
        // GENDER
        // ======================================

        this.maleStudents =
          data?.gender?.male || 0;


        this.femaleStudents =
          data?.gender?.female || 0;


        this.otherStudents =
          data?.gender?.other || 0;


        // ======================================
        // CLASS DATA
        // ======================================

        this.classData =
          data?.classData || [];


        // ======================================
        // RECENT STUDENTS
        // ======================================

        this.recentStudents =
          data?.recentStudents || [];


        // ======================================
        // BUILD STATS
        // ======================================

        this.stats = [

          {
            title: 'Total Students',

            value: this.totalStudents,

            icon: 'fa-users',

            type: 'blue',

            change: ''

          },

          {
            title: 'Active Students',

            value: this.activeStudents,

            icon: 'fa-user-check',

            type: 'green',

            change: ''

          },

          {
            title: 'New Admissions',

            value: this.newAdmissions,

            icon: 'fa-user-plus',

            type: 'orange',

            change: ''

          },

          {
            title: 'Total Classes',

            value: this.totalClasses,

            icon: 'fa-school',

            type: 'purple',

            change: ''

          }

        ];


        this.cdr.detectChanges();


      } else {

        this.commonservice.openAlert(

          'error',

          res?.message ||
          'Failed to load dashboard.'

        );

      }


    } catch (error: any) {

      this.spinner.hide();


      console.error(
        'Dashboard API Error:',
        error
      );


      this.commonservice.openAlert(

        'error',

        error?.error?.message ||
        'Something went wrong.'

      );

    }

  }


  getGreeting(): string {

    const hour =
      new Date().getHours();


    if (hour < 12) {

      return 'Good Morning';

    }


    if (hour < 17) {

      return 'Good Afternoon';

    }


    return 'Good Evening';

  }




  formatDate(date: any): string {

    if (!date) {

      return '-';

    }


    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

}