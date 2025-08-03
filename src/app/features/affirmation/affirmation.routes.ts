import { Route } from '@angular/router';
import { interiorHealthRoute } from './interior-health.routes';

export const affirmationRoute: Route[] = [
    {
        path: 'welcome-party',
        redirectTo: 'welcome-party/manager',
        pathMatch: 'full',
    },
    {
        path: 'welcome-party/manager',
        loadComponent: () =>
            import('./pages/welcome-party-page/welcome-party-page.component').then(
                (c) => c.WelcomePartyPageComponent
            ),
    },
    {
        path: 'welcome-party/details-list/:affirmation_id',
        loadComponent: () =>
            import('./pages/list-detail-welcome-party-page/list-detail-welcome-party-page.component').then(
                (c) => c.ListDetailWelcomePartyPageComponent
            ),
    },
    {
        path: 'interior-health',
        children: interiorHealthRoute,
    },
];