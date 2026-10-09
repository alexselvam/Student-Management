import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    RouterLinkActive,
    Header,
    Footer,
    RouterLink,
    FormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {

  selectedPeriod = 'This Month';

  reportData = {

    totalStudents: 0,

    activeStudents: 0,

    inactiveStudents: 0,

    maleStudents: 0,

    femaleStudents: 0,

    newAdmissions: 0,

    totalClasses: 0

  };


  classData: any[] = [];

  recentAdmissions: any[] = [];
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

    this.getReports();

  }


  // ==========================================
  // GET REPORTS
  // ==========================================

  getReports(): void {

    this.spinner.show();

    this.apiservice
      .getRequest('user/student_reports')
      .then((res: any) => {

        console.log(
          'Student Reports Response:',
          res
        );

        this.spinner.hide();

        if (res?.status === true) {

          const data = res.data;

          this.reportData = {

            totalStudents:
              data.totalStudents || 0,

            activeStudents:
              data.activeStudents || 0,

            inactiveStudents:
              data.inactiveStudents || 0,

            maleStudents:
              data.maleStudents || 0,

            femaleStudents:
              data.femaleStudents || 0,

            newAdmissions:
              data.newAdmissions || 0,

            totalClasses:
              data.totalClasses || 0

          };


          this.classData =
            data.classData || [];


          this.recentAdmissions =
            data.recentAdmissions || [];
          this.cdr.detectChanges();


        } else {

          this.commonservice.openAlert(
            'error',
            res?.message ||
            'Failed to load reports.'
          );

        }

      })
      .catch((error: any) => {

        console.error(
          'Student Reports API Error:',
          error
        );

        this.spinner.hide();

        this.commonservice.openAlert(
          'error',
          error?.error?.message ||
          'Something went wrong.'
        );

      });

  }


  // ==========================================
  // MALE %
  // ==========================================

  get malePercentage(): number {

    if (!this.reportData.totalStudents) {
      return 0;
    }

    return Math.round(
      (
        this.reportData.maleStudents /
        this.reportData.totalStudents
      ) * 100
    );

  }


  // ==========================================
  // FEMALE %
  // ==========================================

  get femalePercentage(): number {

    if (!this.reportData.totalStudents) {
      return 0;
    }

    return Math.round(
      (
        this.reportData.femaleStudents /
        this.reportData.totalStudents
      ) * 100
    );

  }


  // ==========================================
  // ACTIVE %
  // ==========================================

  get activePercentage(): number {

    if (!this.reportData.totalStudents) {
      return 0;
    }

    return Math.round(
      (
        this.reportData.activeStudents /
        this.reportData.totalStudents
      ) * 100
    );

  }


  // ==========================================
  // CLASS %
  // ==========================================

  getClassPercentage(
    students: number
  ): number {

    if (!this.reportData.totalStudents) {
      return 0;
    }

    return Math.round(
      (
        students /
        this.reportData.totalStudents
      ) * 100
    );

  }


  // ==========================================
  // PERIOD CHANGE
  // ==========================================

  changePeriod(): void {

    console.log(
      'Selected Period:',
      this.selectedPeriod
    );

    // Current API supports current-month
    // calculation.

    this.getReports();

  }


  exportReport(): void {

    this.spinner.show();

    this.apiservice
      .getRequest('user/export_student_report')
      .then((res: any) => {

        this.spinner.hide();

        console.log(
          'Export Report Response:',
          res
        );

        if (res?.status === true) {

          const csvContent = res.data;

          // Create CSV Blob
          const blob = new Blob(
            [csvContent],
            {
              type: 'text/csv;charset=utf-8;'
            }
          );

          // Create download URL
          const url = window.URL.createObjectURL(blob);

          // Create temporary link
          const link = document.createElement('a');

          link.href = url;

          link.download =
            `student-report-${new Date().toISOString().split('T')[0]}.csv`;

          link.click();

          // Cleanup
          window.URL.revokeObjectURL(url);

          this.commonservice.openAlert(
            'success',
            'Student report exported successfully.'
          );

        } else {

          this.commonservice.openAlert(
            'error',
            res?.message ||
            'Failed to export report.'
          );

        }

      })
      .catch((error: any) => {

        console.error(
          'Export Report API Error:',
          error
        );

        this.spinner.hide();

        this.commonservice.openAlert(
          'error',
          error?.error?.message ||
          'Something went wrong while exporting report.'
        );

      });

  }
}