import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../services/layout.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/profile.interface';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, RouterModule, CommonModule, StyleClassModule, ButtonModule, TooltipModule, MenuModule, AvatarModule],
    templateUrl: './app.topbar.html',
})
export class AppTopbar {
    public isFullScreen: boolean = false;
    public elem: HTMLElement = document.documentElement;
    user: User;


    constructor(public layoutService: LayoutService, private _router: Router, private _authService: AuthService,) {
        this.user = _authService.getCurrentUser();
    }

    // Items para el menú del avatar
    public items: MenuItem[] = [
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            routerLink: '/profile/setting',
        },
        {
            label: '<b class="m-0 text-red-600">Cerrar sesión</b>',
            escape: false,
            icon: 'pi pi-sign-out',
            iconClass: 'text-red-600',
            command: () => {
                //this._authService.logout();
                this._router.navigateByUrl('auth/login');
            },
        },
    ];


    get firstname() {
        return this.user.names.split(' ')[0];
    }

    get surname() {
        return this.user.surname.split(' ')[0];
    }

    // get para sacar la primera letra del usuario logueado
    get initialLetter() {
        return this.firstname[0] ?? '';
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    onOpenFullScreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
            this.isFullScreen = true;
        }
    }

    onCloseFullScreen() {
        document.exitFullscreen();
        this.isFullScreen = false;
    }


}
