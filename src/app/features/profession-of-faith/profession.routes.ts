import { Route } from '@angular/router';

export const professionRoute: Route[] = [

    {
        path: 'create',
        loadComponent: () =>
            import('./pages/registration-data/registration-data.component').then(
                (c) => c.RegistrationDataComponent
            ),
    },
    {
        path: 'manage',
        loadComponent: () =>
            import('./pages/proffesion-manage-page/proffesion-manage-page.component').then(
                (c) => c.ProffesionManagePageComponent
            ),
    },
]