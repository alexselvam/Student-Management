import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-how-work',
  imports: [ RouterLink,
    Header,
    Footer],
  templateUrl: './how-work.html',
  styleUrl: './how-work.scss',
})
export class HowWork {
   steps = [
    {
      number: '01',
      icon: 'fa-user-plus',
      title: 'Create Your Account',
      description:
        'Register your account with basic information and create secure login credentials.',
      class: 'blue'
    },
    {
      number: '02',
      icon: 'fa-right-to-bracket',
      title: 'Login Securely',
      description:
        'Login to your StudentHub account and access your student management dashboard.',
      class: 'purple'
    },
    {
      number: '03',
      icon: 'fa-chart-line',
      title: 'Open Dashboard',
      description:
        'Get a quick overview of your student records and access management features.',
      class: 'green'
    },
    {
      number: '04',
      icon: 'fa-user-graduate',
      title: 'Manage Students',
      description:
        'Add, update, search and delete student records from one simple interface.',
      class: 'orange'
    }
  ];

    islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  constructor() {
    if (!this.islogin) {
    }
  }
}
