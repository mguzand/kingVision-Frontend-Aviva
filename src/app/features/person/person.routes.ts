import { Route } from '@angular/router';

export const personRoute: Route[] = [
    {
        path: '',
        redirectTo: 'create/general-information',
        pathMatch: 'full',
    },
    {
        path: 'manage',
        loadComponent: () =>
            import('./pages/manage-person-page/manage-person-page.component').then(
                (c) => c.ManagePersonPageComponent
            ),
    },
    {
        path: ':personId',
        loadComponent: () =>
            import(
                './pages/create-of-edit-peron/create-of-edit-peron.component'
            ).then((c) => c.CreateOfEditPeronComponent),
        children: [
            {
                path: 'general-information',
                title: 'Registro de Peronas',
                loadComponent: () =>
                    import(
                        './components/general-information/general-information.component'
                    ).then((c) => c.GeneralInformationComponent),
            },
            {
                path: 'conversion',
                title: 'Conversion',
                loadComponent: () =>
                    import('./components/conversion-form/conversion-form.component').then(
                        (c) => c.ConversionFormComponent
                    ),
            },
        ]
    }


]