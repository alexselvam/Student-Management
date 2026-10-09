import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Footer, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class Home {
  islogin: any = localStorage.getItem('student_TOKEN') ?? sessionStorage.getItem('student_TOKEN') ?? null;

  animatedStats = {
    students: 0,
    features: 0,
    records: 0,
    access: 0
  };

  targetStats = {
    students: 100,
    features: 5,
    records: 99,
    access: 100
  };

  constructor() {
    if (!this.islogin) {
    }
  }

  startCountAnimation(): void {

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.animatedStats.students = Math.floor(
        this.targetStats.students * easeOut
      );

      this.animatedStats.features = Math.floor(
        this.targetStats.features * easeOut
      );

      this.animatedStats.records = Math.floor(
        this.targetStats.records * easeOut
      );

      this.animatedStats.access = Math.floor(
        this.targetStats.access * easeOut
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }

    };

    requestAnimationFrame(animate);
  }
}
