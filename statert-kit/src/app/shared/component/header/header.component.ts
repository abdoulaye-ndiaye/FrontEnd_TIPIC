import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { ModeComponent } from './mode/mode.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { NotifactionsComponent } from './notifactions/notifactions.component';
import { Menu, NavmenuService } from '../../services/navmenu.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../directive/outside.directive';
import { LanguageComponent } from './language/language.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchComponent, BookmarkComponent, ModeComponent, CartComponent, ProfileComponent,LanguageComponent,
    MessageComponent, NotifactionsComponent, SvgIconComponent, FormsModule, ReactiveFormsModule, CommonModule,
    RouterModule,ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  public menuItems: Menu[] = [];
  public item: Menu[] = [];
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public open = false
  public text: string = '';

  constructor(public navmenu: NavmenuService) {
    this.navmenu.item.subscribe((menuItems: Menu[]) =>
      this.item = menuItems
    );
  }

  openMenu() {
    this.navmenu.closeSidebar = !this.navmenu.closeSidebar;
  }

  @HostListener('window:resize', ['$event'])

  onResize(event: number) {
    this.navmenu.closeSidebar = window.innerWidth < 1200 ? true : false;
  }

  openSearch() {
    this.open = !this.open
    this.searchResult = false;
  }


  languageToggle() {
    this.navmenu.language = !this.navmenu.language;
  }

  searchTerm(term: any) {
    term ? this.addFix() : this.removeFix();
    if (!term) return this.menuItems = [];
    let items: Menu[] = [];
    term = term.toLowerCase();
    this.item.forEach((data) => {
      if (data.title?.toLowerCase().includes(term) && data.type === 'link') {
        items.push(data);
      }
      data.children?.filter(subItems => {
        if (subItems.title?.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = data.icon
          items.push(subItems);
        }
        subItems.children?.filter(suSubItems => {
          if (suSubItems.title?.toLowerCase().includes(term)) {
            suSubItems.icon = data.icon
            items.push(suSubItems);
          }
        })
        return
      })
      this.checkSearchResultEmpty(items)
      this.menuItems = items
    })
    return
  }

  checkSearchResultEmpty(items: Menu[]) {
    if (!items.length)
      this.searchResultEmpty = true;
    else
      this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    document.body.classList.add('offcanvas')
  }

  removeFix() {
    this.searchResult = false;
    this.text = "";
    document.body.classList.remove('offcanvas')
  }

  clickOutside(): void {
    this.open = false
    this.searchResult = false;
    this.searchResultEmpty = false;
  }
}
