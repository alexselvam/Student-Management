import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-about',
  imports: [RouterLink,
    Header,
    Footer],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  benefits = [
    {
      icon: 'fa-bolt',
      title: 'Simple to Use',
      description:
        'A clean and straightforward interface makes student management easy.',
      class: 'blue'
    },
    {
      icon: 'fa-shield-halved',
      title: 'Secure',
      description:
        'Your account and student information are managed through a secure system.',
      class: 'purple'
    },
    {
      icon: 'fa-magnifying-glass',
      title: 'Quick Search',
      description:
        'Find student records quickly without going through large lists manually.',
      class: 'green'
    },
    {
      icon: 'fa-layer-group',
      title: 'Organized Records',
      description:
        'Keep student information structured and easy to access.',
      class: 'orange'
    }
  ];

  features = [
    {
      icon: 'fa-user-plus',
      title: 'Add Students',
      description: 'Create and store new student records easily.',
      class: 'blue'
    },
    {
      icon: 'fa-pen-to-square',
      title: 'Update Records',
      description: 'Modify student information whenever required.',
      class: 'purple'
    },
    {
      icon: 'fa-magnifying-glass',
      title: 'Search Students',
      description: 'Quickly find students using the search functionality.',
      class: 'green'
    },
    {
      icon: 'fa-trash-can',
      title: 'Delete Records',
      description: 'Remove outdated student records when necessary.',
      class: 'red'
    }
  ];

  islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  constructor() {
    if (!this.islogin) {
    }
  }

}
