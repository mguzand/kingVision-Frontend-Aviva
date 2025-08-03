import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app.menuitem/app.menuitem';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <!-- <ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> -->


    <ul class="layout-menu">
    @for (items of model; track items.id; let i = $index) {
      @if (items.separator) { 
        <li class="menu-separator"></li> 
      }@else {
        <li  app-menuitem [item]="items" [root]="true" [index]="i" ></li>
      }
    }
  </ul>
  
  
  `
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        id: 'home',
        label: 'Menu principal',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
          },
          // {
          //   id: 'add-member',
          //   label: 'Agregar nuevo registro',
          //   icon: 'pi pi-user-plus',
          //   routerLink: ['/person'],
          //   routerLinkActiveOptions: { exact: false },
          // },
          {
            id: 'list-members',
            label: 'Listado de Miembros',
            icon: 'pi pi-list',
            routerLink: ['/person-list/manage'],
          },
          {
            id: 'list-members',
            label: 'Listado de redes',
            icon: 'pi pi-sitemap',
            routerLinkActiveOptions: { exact: false },
            routerLink: ['/network'],
          },
        ]
      },

      // {
      //   separator: true
      // },

      {
        id: 'Afirmacion',
        label: 'Afirmación',
        routerLinkActiveOptions: { exact: false },
        items: [
          {
            id: 'new-profesion',
            label: 'Profesiones de fe',
            icon: 'pi pi-flag-fill',
            //routerLink: ['/profession-of-faith'],
            items: [
              {
                id: 'new-profesion-fe',
                label: 'Registrar datos',
                routerLink: ['/profession/create'],
                routerLinkActiveOptions: { exact: false },
              },
              {
                id: 'list-profession',
                label: 'Listado de profesiones de fe',
                routerLink: ['/profession/manage'],
              },
            ]
          },
          {
            id: 'new-bienvenida',
            label: 'Fiestas de bienvenida',
            icon: 'pi pi-flag',
            routerLink: ['/affirmation/welcome-party'],
            routerLinkActiveOptions: { exact: false },
          },
          {
            id: 'new-sanidadin',
            label: 'Retiro de sanidad interior',
            icon: 'pi pi-wave-pulse',
            routerLink: ['/affirmation/interior-health'],
            routerLinkActiveOptions: { exact: false },
          },
          {
            id: 'new-escuelav',
            label: 'Escuelas de la visión',
            icon: 'pi pi-graduation-cap',
            items: [
              {
                id: 'esc-creyente',
                label: 'Esc. para Nuevo creyente',
                routerLink: ['/vission-scool/manage/b06a27db-de34-4fdf-a768-fc3bc4cae704']
              },
              {
                id: 'esc-Miembro',
                label: 'Esc. para Miembro',
                routerLink: ['/vission-scool/manage/7df9148a-1b4a-4f17-8999-076318a40a1c']
              },
              {
                id: 'esc-Miembro',
                label: 'Esc. para Discipulos',
                routerLink: ['/vission-scool/manage/c241c272-fffd-450c-9591-285dc0d77c4f']
              }
            ]
          },
        ]
      },
      {
        id: 'Events',
        label: 'Eventos',
        items: [
          {
            id: 'new-event',
            label: 'Registrar evento',
            icon: 'pi pi-calendar-plus',
            routerLink: ['/event/create'],
            routerLinkActiveOptions: { exact: false },
          },
          {
            id: 'list-event',
            label: 'Listado de eventos',
            icon: 'pi pi-calendar',
            routerLink: ['/event/manage'],
          }
        ]
      }

 
    ];

  }
}
