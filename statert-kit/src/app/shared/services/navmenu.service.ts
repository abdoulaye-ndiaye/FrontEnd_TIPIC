import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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
    items?: Menu[];
}

@Injectable({
    providedIn: "root",
})
export class NavmenuService {
    public language: boolean = false;
    public isShow: boolean = false;
    public closeSidebar: boolean = false;

    constructor() {}

    MENUITEMS: Menu[] = [
        {
            id: 1,
            headTitle1: "admin",
            active: true,
        },
        {
            title: "Dashboard",
            icon: "home",
            path: "/admin/dashboard",
            type: "link",
            level: 1,
            active: false,
            id: 2,
        },
        {
            title: "Créer Utilisateur",
            icon: "to-do",
            path: "/admin/register",
            type: "link",
            level: 1,
            active: false,
            id: 3,
        },
        {
            title: "Liste Utilisateurs",
            icon: "file",
            path: "/admin/utilisateur",
            type: "link",
            level: 1,
            active: false,
            id: 4,
        },
        {
            id: 5,
            headTitle1: "syndicat-AOP",
            active: true,
        },
        {
            title: "Créer Echantillon",
            icon: "to-do",
            path: "/syndicat/formulaire-identite",
            type: "link",
            level: 1,
            active: false,
            id: 6,
        },
        {
            title: "Liste Echantillons",
            icon: "file",
            path: "/syndicat/liste-echantillons",
            type: "link",
            level: 1,
            active: false,
            id: 7,
        },
        {
            id: 8,
            headTitle1: "IPREM",
            active: true,
        },
        {
            title: "SIFT-MS",
            icon: "to-do",
            path: "/iprem/liste-echantillons",
            type: "link",
            level: 1,
            active: false,
            id: 9,
        },
        {
            id: 10,
            headTitle1: "PTF2A",
            active: true,
        },
        {
            title: "Analyse Sensorielle",
            icon: "to-do",
            path: "/PTF2A/liste-echantillons",
            type: "link",
            level: 1,
            active: false,
            id: 11,
        },
        {
            id: 12,
            headTitle1: "jury",
            active: true,
        },
        {
            title: "Jury",
            icon: "to-do",
            path: "/jury",
            type: "link",
            level: 1,
            active: false,
            id: 13,
        }
    ];

    item = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
