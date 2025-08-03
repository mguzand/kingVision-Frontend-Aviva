import { Route } from '@angular/router';

export const interiorHealthRoute: Route[] = [
    {
        path: '',
        redirectTo: 'manager',
        pathMatch: 'full',
    },
    {
        path: 'manager',
        loadComponent: () =>
            import('./pages/interior-health-page/interior-health-page.component').then(
                (c) => c.InteriorHealthPageComponent
            ),
    },
    {
        path: 'details-list/:affirmation_id',
        loadComponent: () =>
            import('./pages/list-detail-interior-health-page/list-detail-interior-health-page.component').then(
                (c) => c.ListDetailInteriorHealthPageComponent
            ),
    },
]