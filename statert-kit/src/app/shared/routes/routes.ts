import { Routes } from "@angular/router";
import { LoginComponent } from "../../auth/login/login.component";
import { authGuard } from "../../guard/auth.guard";

export const dashData: Routes = [
    {
        path: "admin",
        data: {
            title: "admin",
            breadcrumb: "admin",
            expectedRole: "ADMIN",
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
        path: "syndicat",
        data: {
            title: "syndicat",
            breadcrumb: "syndicat",
        },
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
        },
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
        },
        loadChildren: () =>
            import("../../../app/component/PTF2A/PTF2A.routes").then(
                (r) => r.PTF2A
            ),
    },
];
