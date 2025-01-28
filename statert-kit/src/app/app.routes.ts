import { Routes } from "@angular/router";
import { ContentComponent } from "./shared/component/layout/content/content.component";
import { dashData } from "./shared/routes/routes";
import { LoginComponent } from "./auth/login/login.component";
import { authGuard } from "./guard/auth.guard";
import { JuryComponent } from "./component/jury/jury.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "auth/login",
        pathMatch: "full",
    },
    {
        path: "auth/login",
        component: LoginComponent,
    },
    {
        path: "",
        component: ContentComponent,
        children: dashData,
    },
    {
        path:"jury",
        component: JuryComponent,
    }
];
