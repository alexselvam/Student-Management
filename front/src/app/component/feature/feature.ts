import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature',
  imports: [CommonModule, Header, Footer,RouterLink],
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class Feature {
  features = [
    {
      icon: 'fa-user-plus',
      title: 'Add Students',
      description:
        'Create new student records quickly with essential student information.',
      class: 'blue'
    },
    {
      icon: 'fa-pen-to-square',
      title: 'Update Records',
      description:
        'Update student information whenever their details change.',
      class: 'purple'
    },
    {
      icon: 'fa-trash-can',
      title: 'Delete Students',
      description:
        'Remove unwanted student records safely with confirmation.',
      class: 'red'
    },
    {
      icon: 'fa-magnifying-glass',
      title: 'Smart Search',
      description:
        'Find students instantly using name, email, ID or other details.',
      class: 'green'
    },
    {
      icon: 'fa-layer-group',
      title: 'Pagination',
      description:
        'Browse large student records efficiently page by page.',
      class: 'orange'
    },
    {
      icon: 'fa-shield-halved',
      title: 'Secure Access',
      description:
        'Keep your student management system protected with secure login.',
      class: 'indigo'
    }
  ];

  islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  constructor() {
    if (!this.islogin) {
    }
  }

}
