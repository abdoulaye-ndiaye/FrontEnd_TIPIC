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
];
