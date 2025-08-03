import { Component, ElementRef } from '@angular/core';
import { AppMenu } from '../app.menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div> 
    
    <!-- <div class="flex flex-column h-full">
        <div class="overflow-y-auto">ss</div>
        <div class="mt-auto border-top-1 surface-border">
            <app-user-sidebar-card />
        </div>
        </div> -->


`
})
export class AppSidebar {
    constructor(public el: ElementRef) { }
}
