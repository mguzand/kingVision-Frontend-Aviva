import { Route } from '@angular/router';

export const networkRoute: Route[] = [
    {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full',
    },
    {
        path: 'manage',
        loadComponent: () =>
            import('./pages/manager-network-page/manager-network-page.component').then(
                (c) => c.ManagerNetworkPageComponent
            ),
    },
    {
        path: 'groups/details/:group_id',
        loadComponent:() => 
            import('./pages/detail-group-page/detail-group-page.component').then(
                (c) => c.DetailGroupPageComponent
            )
    },
    {
        path: 'groups/:network_id/:name',
        loadComponent:() => 
            import('./pages/groups-manage-page/groups-manage-page.component').then(
                (c) => c.GroupsManagePageComponent
            )
    }
]