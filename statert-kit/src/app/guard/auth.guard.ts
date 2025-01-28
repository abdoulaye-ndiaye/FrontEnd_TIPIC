import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../services/auth.service";
import { Role } from "../shared/services/models/Role"; // Importez l'enum des rôles

interface DecodedToken {
    user: {
        role: Role;
    };
    exp: number;
}

/*************  ✨ Codeium Command ⭐  *************/
/******  b8831d51-f2d6-4ec1-92db-0f3ee5bbf1fa  *******/
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = localStorage.getItem("token");
    if (!token) {
        router.navigate(["auth/login"], { queryParams: { redirectUrl: state.url } });
        return false;
    }

    let decodedToken: DecodedToken;
    try {
        decodedToken = jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Token invalide :", error);
        router.navigate(["auth/login"], { queryParams: { redirectUrl: state.url } });
        return false;
    }

    const userRole = decodedToken.user.role;

    // Vérifier les rôles dans la route actuelle et ses parents
    let currentRoute = route;
    while (currentRoute) {
        const expectedRoles = currentRoute.data?.["expectedRoles"] as Role | Role[];
        if (expectedRoles) {
            const allowedRoles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
            if (authService.isLoggedIn() && allowedRoles.includes(userRole)) {
                return true;
            }
        }
        currentRoute = currentRoute.parent!;
    }

    console.log("Accès refusé pour le rôle:", userRole);
    router.navigate(["auth/login"], { queryParams: { redirectUrl: state.url } });
    return false;
};