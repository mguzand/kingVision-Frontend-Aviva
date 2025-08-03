import { Route } from '@angular/router';

export const eventsRoute: Route[] = [
  {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full',
    },
    {
        path: 'manage',
        loadComponent: () =>
            import('./pages/manage-event-page/manage-event-page.component').then(
                (c) => c.ManageEventPageComponent
            ),
    },
    {
        path: 'assistance/:eventId',
        loadComponent: () =>
            import('./pages/assistance-page/assistance-page.component').then(
                (c) => c.AssistancePageComponent
            ),
    },
]