import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Menu {
  headTitle1?: string;
  level?: number;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  id?: number;
  bookmark?: boolean;
  children?: Menu[];
  horizontalList?: boolean;
  items?: Menu[]
}

@Injectable({
  providedIn: 'root'
})
export class NavmenuService {

  public language: boolean = false;
  public isShow: boolean = false;
  public closeSidebar: boolean = false;

  constructor() { }

  MENUITEMS: Menu[] = [
    {
      id: 1,
      headTitle1: 'page',
      active:true,
    },
    {
      title: 'pages',
      icon: 'sample-page',
      type: 'sub',
      level: 1,
      active: true,
      children: [
        { path: '/pages/sample-page1', title: 'Sample-page1', type: 'link' },
        { path: '/pages/sample-page2', title: 'Sample-page2', type: 'link' },
      ],
    },
    {
      title: 'Sample-page',
      icon: 'sample-page',
      type: 'link',
      level: 1,
      active: false,
      path: '/sample-page',
      bookmark:true
    },
    {
      id: 2,
      headTitle1: 'admin',
      active:true,
    },
    {
      title: 'admin',
      icon: 'admin',
      type: 'sub',
      level: 1,
      active: false,
      children: [
        {path: '/admin/dashboard', title: 'Dashboard', type: 'link'},
        {path: '/admin/register', title: 'Register', type: 'link'},
        {path: '/admin/utilisateur', title: 'Utilisateur', type: 'link'},
      ],
    },
    {
      id: 3,
      headTitle1: 'syndicat-AOP',
      active:true,
    },
    {
      title: 'syndicat-AOP',
      icon: 'syndicat-AOP',
      type: 'sub',
      level: 1,
      active: false,
      children: [
        {path: '/syndicat/formulaire-identite', title: 'Syndicat', type: 'link'},
      ],
    },
  ];
  item = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
