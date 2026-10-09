import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiserviceService } from '../../service/apiservice/apiservice-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgClass, CommonModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {


  isMenuOpen = false;
  islogin: any;

  constructor(private rtr: Router, private apiservice: ApiserviceService) {

  }

  ngOnInit() {
    this.islogin = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  closeMenu(): void {
    this.isMenuOpen = false;
  }


  logout() {
    this.apiservice.logout(false)
  }
}
