import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { FeathericonComponent } from '../../feathericon/feathericon.component';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';

import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';

import { LayoutService } from '../../../services/layout.service';
import { NavmenuService } from '../../../services/navmenu.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, BreadcrumbComponent, FeathericonComponent, RouterOutlet,
    FooterComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

  constructor(public layout: LayoutService, public navmenu: NavmenuService) {
    if (window.innerWidth < 1185) {
      navmenu.closeSidebar = true;
    }

    if (window.innerWidth <= 992) {
      this.layout.config.settings.sidebar_type = 'compact-wrapper'
    } else {
      this.layout.config.settings.sidebar_type = this.layout.config.settings.sidebar_type;
    }

  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    if (window.innerWidth < 1185) {
      this.navmenu.closeSidebar = true;
    } else {
      this.navmenu.closeSidebar = false;
    }

    if (window.innerWidth <= 992) {
      this.layout.config.settings.sidebar_type = 'compact-wrapper';
    } else {
      this.layout.config.settings.sidebar_type = this.layout.config.settings.sidebar_type;
    }
  }


}
