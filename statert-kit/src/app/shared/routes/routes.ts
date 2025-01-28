import { Routes } from "@angular/router";
import { LoginComponent } from "../../auth/login/login.component";
import { authGuard } from "../../guard/auth.guard";
import { JuryComponent } from "../../component/jury/jury.component";
import { Role } from '../services/models/Role'; // Importez l'enum des rôles


export const dashData: Routes = [
    {
        path: "admin",
        data: {
            title: "admin",
            breadcrumb: "admin",
            expectedRoles: [Role.ADMIN],  // Seul un ADMIN peut accéder à cette route
        },
        canActivate: [authGuard],
        loadChildren: () =>
            import("../../../app/component/admin/admin.routes").then(
                (r) => r.admin
            ),
    },
    {
        path: "auth/login",
        data: {
            title: "auth",
            breadcrumb: "auth",
        },
        component: LoginComponent,
    },
    {
        path:"jury",
        data: {
            title: "jury",
            breadcrumb: "jury",
        },
        component: JuryComponent,

    },
    {
        path: "syndicat",
        data: {
            title: "syndicat",
            breadcrumb: "syndicat",
            expectedRoles: [Role.SYNDICAT_AOP,Role.ADMIN],  // Seul un SYNDICAT peut accéder à cette route
        },
        canActivate: [authGuard],
        loadChildren: () =>
            import(
                "../../../app/component/syndicat-AOP/syndicat-AOP.routes"
            ).then((r) => r.syndicat),
    },
    {
        path: "iprem",
        data: {
            title: "iprem",
            breadcrumb: "iprem",
            expectedRoles: [Role.TECHNICIEN_IPREM,Role.CHEF_PROJET_IPREM,Role.INGENIEUR_IPREM,Role.ADMIN],  // Seul un TECHNICIEN_IPREM peut accéder à cette route
        },
        canActivate: [authGuard],
        loadChildren: () =>
            import("../../../app/component/iprem/iprem.routes").then(
                (r) => r.iprem
            ),
    },
    {
        path: "PTF2A",
        data: {
            title: "PTF2A",
            breadcrumb: "PTF2A",
            expectedRoles: [Role.PARTENAIRE_PTF2A,Role.ADMIN],  // Seul un PARTENAIRE_PTF2A peut accéder à cette
        },
        canActivate: [authGuard],
        loadChildren: () =>
            import("../../../app/component/PTF2A/PTF2A.routes").then(
                (r) => r.PTF2A
            ),
    },
    {
        path:"user",
        data : {
            title: "Utilisateur",
            breadcrumb: "Utilisateur",
        },
        loadChildren: () =>
            import("../../../app/component/user/user.routes").then(
                (r) => r.user
            ),
    },
    {
        path: "producteur",
        data: {
            title: "producteur",
            breadcrumb: "producteur",
            expectedRoles: [Role.PRODUCTEUR,Role.ADMIN],  // Seul un PRODUCTEUR peut accéder à cette route
        },
        canActivate: [authGuard],
        loadChildren: () =>
            import("../../../app/component/producteur/producteur.routes").then(
                (r) => r.producteur
            ),
    }
];
