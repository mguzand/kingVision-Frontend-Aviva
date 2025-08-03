import { Route } from '@angular/router';

export const vissionScoolRoute: Route[] = [
 
    {
        path: 'manage/:id',
        loadComponent: () =>
            import('./pages/manage-scool-vision-page/manage-scool-vision-page.component').then(
                (c) => c.ManageScoolVisionPageComponent
            ),
    },

    {
        path: 'student-list/:period_id',
        loadComponent: () =>
            import('./pages/list-student-page/list-student-page.component').then(
                (c) => c.ListStudentPageComponent
            ),
    },
]