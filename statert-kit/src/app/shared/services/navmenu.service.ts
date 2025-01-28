import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Role } from "../../shared/services/models/Role";
import { UtilisateurService } from "../../services/utilisateur.service";

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
    
    // Map qui définit quels IDs de menu sont visibles pour chaque rôle
    private readonly ROLE_MENU_MAP = {
        [Role.ADMIN]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Admin voit tout
        [Role.SYNDICAT_AOP]: [5, 6, 7], // Section syndicat-AOP
        [Role.TECHNICIEN_IPREM]: [8, 9], // Section IPREM
        [Role.INGENIEUR_IPREM]: [8, 9],
        [Role.CHEF_PROJET_IPREM]: [8, 9],
        [Role.PARTENAIRE_PTF2A]: [10, 11], // Section PTF2A
        [Role.PRODUCTEUR]: [14, 15] // Section producteur
    };

    private currentRole: Role;
    public item = new BehaviorSubject<Menu[]>([]); // Changé en public item

    constructor(private utilisateurService: UtilisateurService) {
        this.initializeMenuFromToken();
    }

    private initializeMenuFromToken() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = this.utilisateurService.getDecodedToken(token);
                const userToken = decodedToken as { user: { role: Role } };
                if (userToken && userToken.user && userToken.user.role) {
                    const userToken = decodedToken as { user: { role: Role } };
                    this.currentRole = userToken.user.role;
                    this.updateMenuItems(this.currentRole);
                    return;
                }
            }
            this.clearMenu();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du menu:', error);
            this.clearMenu();
        }
    }

    updateMenuItems(role: Role) {
        const allowedIds = this.ROLE_MENU_MAP[role] || [];
        const filteredItems = this.MENUITEMS.filter(item => 
            item.id !== undefined && allowedIds.includes(item.id)
        );
        this.item.next(filteredItems);
    }

    clearMenu() {
        this.currentRole = undefined!;
        this.item.next([]);
    }

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
        },
        {
            id: 14,
            headTitle1: "PRODUCTEUR",
            active: true,
        },
        {
            title:"Dashboard Producteur",
            icon:"to-do",
            path:"/producteur/dashboard-producteur",
            type:"link",
            level:1,
            active:false,
            id:15
        },
    ];
}


