import { Routes } from "@angular/router";
import { LoginComponent } from "../../auth/login/login.component";
import { authGuard } from "../../guard/auth.guard";

export const dashData: Routes = [
    {
        path: "pages",
        data: {
            title: "sample-page",
            breadcrumb: "sample-page",
        },

        loadChildren: () =>
            import("../../../app/component/pages/pages.routes").then(
                (r) => r.pages
            ),
    },
    {
        path: "sample-page",
        data: {
            title: "sample-page",
            breadcrumb: "sample-page",
        },
        loadChildren: () =>
            import(
                "../../../app/component/sample-page/sample-pages.routes"
            ).then((r) => r.samplePages),
    },
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
