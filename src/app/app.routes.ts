import { Routes } from '@angular/router';
import { layoutRoutes } from './layout/layout.routes';
import { personRoute } from './features/person/person.routes';
import { LoggedinGuard } from './core/guards/loggedin.guard';

export const routes: Routes = [
  {
    path: '',
    children: layoutRoutes,
    canActivate: [LoggedinGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./core/auth/page/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
   {
      path: "assistance/:period_id",
      loadComponent: () =>
      import('./features/vission-scool/pages/assistance-student/assistance-student.component').then(
        (c) => c.AssistanceStudentComponent
      ),
   }
];

 