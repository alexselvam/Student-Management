import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';

import { ApiserviceService } from '../../service/apiservice/apiservice-service';
import { CommonService } from '../../service/common/common-service';

import {
  NgxSpinnerModule,
  NgxSpinnerService
} from 'ngx-spinner';


interface StudentData {
  _id?: string;
  userId?: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;

  studentId: string;
  className: string;
  section: string;
  admissionDate: string;

  parentName: string;
  parentPhone: string;

  address: string;
  city: string;
  state: string;
  country: string;

  status: any;

  createdAt?: string;
  updatedAt?: string;
}


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLinkActive,
    RouterLink,
    Header,
    Footer,
    NgxSpinnerModule
  ],
  templateUrl: './student.html',
  styleUrl: './student.scss'
})
export class Student {

  // ==============================
  // STUDENTS
  // ==============================

  students: StudentData[] = [];

  filteredStudents: StudentData[] = [];

  paginatedStudents: StudentData[] = [];


  // ==============================
  // FILTER
  // ==============================

  searchText: string = '';

  selectedClass: string = 'All Classes';


  // ==============================
  // PAGINATION
  // ==============================

  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number = 0;

  pages: number[] = [];

  islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;
  constructor(
    private apiservice: ApiserviceService,
    private commonservice: CommonService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    if (!this.islogin) {
      window.location.href = '/';
    }
  }


  ngOnInit(): void {
    this.spinner.show()
    this.getStudents();

  }


  // =====================================================
  // GET STUDENTS
  // =====================================================

  getStudents(): void {

    this.spinner.show();

    this.apiservice
      .getRequest('user/get_Students')
      .then((res: any) => {

        console.log('Get Students Response:', res);

        if (res?.status === true) {

          this.students = res?.data || [];

          this.filteredStudents = [...this.students];

          this.currentPage = 1;

          this.updatePagination();
          this.cdr.detectChanges();

        } else {

          this.students = [];
          this.filteredStudents = [];
          this.paginatedStudents = [];

          this.totalPages = 0;
          this.pages = [];

          this.commonservice.openAlert(
            'error',
            res?.message || 'Failed to get students.'
          );

        }

      })
      .catch((error: any) => {

        console.error(
          'Get Students API Error:',
          error
        );

        this.students = [];
        this.filteredStudents = [];
        this.paginatedStudents = [];

        this.commonservice.openAlert(
          'error',
          error?.error?.message ||
          'Something went wrong.'
        );

      })
      .finally(() => {

        this.spinner.hide();

      });

  }


  getActiveStudentsCount(): number {

    return this.students.filter(
      student => student.status === 'Active'
    ).length;

  }


  getClassesCount(): number {

    const classes = this.students
      .map(student => student.className)
      .filter(className => !!className);

    return new Set(classes).size;

  }


  getNewStudentsCount(): number {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return this.students.filter(student => {

      if (!student.createdAt) {
        return false;
      }

      const createdDate = new Date(student.createdAt);

      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );

    }).length;

  }


  // =====================================================
  // SEARCH + CLASS FILTER
  // =====================================================

  applyFilters(): void {

    const search = this.searchText
      .trim()
      .toLowerCase();


    this.filteredStudents = this.students.filter(
      (student: StudentData) => {

        // --------------------------
        // SEARCH
        // --------------------------

        const fullName =
          `${student.firstName} ${student.lastName}`
            .toLowerCase();

        const matchesSearch =
          !search ||
          fullName.includes(search) ||
          student.studentId
            ?.toLowerCase()
            .includes(search) ||
          student.email
            ?.toLowerCase()
            .includes(search);


        // --------------------------
        // CLASS
        // --------------------------

        const matchesClass =
          this.selectedClass === 'All Classes' ||
          student.className === this.selectedClass;


        return matchesSearch && matchesClass;

      }
    );


    // Reset page after filtering

    this.currentPage = 1;

    this.updatePagination();

  }


  // =====================================================
  // SEARCH
  // =====================================================

  searchStudent(): void {

    this.applyFilters();

  }


  // =====================================================
  // CLASS FILTER
  // =====================================================

  changeClass(): void {

    this.applyFilters();

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  updatePagination(): void {

    if (this.filteredStudents.length === 0) {

      this.totalPages = 0;

      this.pages = [];

      this.paginatedStudents = [];

      return;

    }


    this.totalPages = Math.ceil(
      this.filteredStudents.length /
      this.itemsPerPage
    );


    this.pages = Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );


    // Prevent invalid page

    if (this.currentPage > this.totalPages) {

      this.currentPage = this.totalPages;

    }


    this.setPaginatedStudents();

  }


  // =====================================================
  // SET PAGINATED STUDENTS
  // =====================================================

  setPaginatedStudents(): void {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;


    const endIndex =
      startIndex +
      this.itemsPerPage;


    this.paginatedStudents =
      this.filteredStudents.slice(
        startIndex,
        endIndex
      );

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.setPaginatedStudents();

    }

  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.setPaginatedStudents();

    }

  }


  // =====================================================
  // GO TO PAGE
  // =====================================================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;

    this.setPaginatedStudents();

  }


  // =====================================================
  // VIEW STUDENT
  // =====================================================

  viewStudent(student: StudentData): void {

    if (!student._id) {

      this.commonservice.openAlert(
        'error',
        'Student ID not found.'
      );

      return;
    }

    this.router.navigate(
      ['/student_add'],
      {
        queryParams: {
          id: student._id,
          mode: 'view'
        }
      }
    );

  }


  // =====================================================
  // EDIT STUDENT
  // =====================================================

  editStudent(student: StudentData): void {

    if (!student._id) {

      this.commonservice.openAlert(
        'error',
        'Student ID not found.'
      );

      return;
    }

    this.router.navigate(
      ['/student_add'],
      {
        queryParams: {
          id: student._id,
          mode: 'edit'
        }
      }
    );

  }

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  deleteStudent(student: StudentData): void {
    this.spinner.show();
    if (!student._id) {

      this.commonservice.openAlert(
        'error',
        'Student ID not found.'
      );
      this.spinner.hide();
      return;

    }


    const payload = {
      studentId: student._id
    };


    this.spinner.show();


    this.apiservice.postRequest('user/delete_Students', payload)
      .then((res: any) => {

        console.log(
          'Delete Student Response:',
          res
        );

        this.spinner.hide();


        if (res?.status === true) {

          this.commonservice.openAlert(
            'success',
            res.message ||
            'Student deleted successfully.'
          );


          // Refresh list

          this.getStudents();

        } else {

          this.commonservice.openAlert(
            'error',
            res?.message ||
            'Failed to delete student.'
          );

        }

      })
      .catch((error: any) => {

        console.error(
          'Delete Student API Error:',
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

}