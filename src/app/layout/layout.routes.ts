import { Routes } from '@angular/router';
import { AppLayout } from './app.layout';
import { personRoute } from '../features/person/person.routes';
import { networkRoute } from '../features/networks/networks.routes';
import { affirmationRoute } from '../features/affirmation/affirmation.routes';
import { professionRoute } from '../features/profession-of-faith/profession.routes';
import { vissionScoolRoute } from '../features/vission-scool/vission-scool.routes';
import { eventsRoute } from '../features/events/events.routes';


export const layoutRoutes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('../features/dashboard/dashboard.component')
                    .then(
                        (c) => c.DashboardComponent
                    ),
                title: 'King Vision Mitra'
            }
            , {
                path: 'person',
                children: personRoute,
            },
            {
                path: 'network',
                children: networkRoute,
            },
            {
                path: 'affirmation',
                children: affirmationRoute,
            },
            {
                path: 'profession',
                children: professionRoute
            },

            {
                path: 'vission-scool',
                children: vissionScoolRoute
            },
            {
                path: 'event',
                children: eventsRoute
            },



            {
                path: 'person-list/manage',
                loadComponent: () =>
                    import(
                        '../features/person/pages/manage-person-page/manage-person-page.component'
                    ).then((c) => c.ManagePersonPageComponent),
            },
        ]
    },


]