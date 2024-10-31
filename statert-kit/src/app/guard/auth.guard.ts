import { CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateFn = (route, state) => {
    let decodedToken: any;
    let role = "";

    const authService = inject(AuthService);
    const router = inject(Router);

    const token = localStorage.getItem("token") as string;
    if (token) {
        decodedToken = jwtDecode(token);
        role = decodedToken.user.role;
    }

    var expectedRole = role;
    if (route.data["expectedRole"]) {
        expectedRole = route.data["expectedRole"];
    }

    if (authService.isLoggedIn() && role == expectedRole) return true;

    router.navigate(["auth/login"]);
    return false;
};
