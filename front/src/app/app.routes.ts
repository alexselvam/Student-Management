import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./component/home/home').then(m => m.Home)
    },
    {
        path: 'features', loadComponent: () => import('./component/feature/feature').then(m => m.Feature)
    },
    {
        path: 'how-it-works', loadComponent: () => import('./component/how-work/how-work').then(m => m.HowWork)
    },
    {
        path: 'about', loadComponent: () => import('./component/about/about').then(m => m.About)
    },
    {
        path: 'register', loadComponent: () => import('./component/register/register').then(m => m.Register)
    },
    {
        path: 'login', loadComponent: () => import('./component/login/login').then(m => m.Login)
    },
    {
        path: 'forgot-password', loadComponent: () => import('./component/forgot-password/forgot-password').then(m => m.ForgotPassword)
    },
    {
        path: 'reset-password', loadComponent: () => import('./component/reset-password/reset-password').then(m => m.ResetPassword)
    },
    {
        path: 'dashboard', loadComponent: () => import('./component/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: 'students', loadComponent: () => import('./component/student/student').then(m => m.Student)
    },
    {
        path: 'student_add', loadComponent: () => import('./component/add-student/add-student').then(m => m.AddStudent)
    },
    {
        path: 'reports', loadComponent: () => import('./component/report/report').then(m => m.Report)
    }



];
