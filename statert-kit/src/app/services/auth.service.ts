import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { jwtDecode } from "jwt-decode";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    getDecodedToken(token: string) {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    login(email: string, password: string) {
        return this.httpClient
            .post<any>(`${environment.apiUrl}/login`, {
                email,
                password,
            })
            .pipe(
                map((res) => {
                    if (res && res.token) {
                        localStorage.setItem("token", res.token);
                        localStorage.setItem("refreshToken", res.refreshToken);
                    }
                    return res;
                })
            );
    }

    logout() {
        localStorage.removeItem("token");
    }

    isLoggedIn() {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }
        const decodedToken = this.getDecodedToken(token);
        if (!decodedToken) {
            return false;
        }
        return true;
    }

    register(
        email: string,
        password: string,
        nom: string,
        prenom: string,
        role: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/utilisateur`, {
            email,
            password,
            nom,
            prenom,
            role,
        });
    }

    registerProducteur(
        email: string,
        password: string,
        nom: string,
        prenom: string,
        role: string,
        codeProducteur: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/utilisateur`, {
            email,
            password,
            nom,
            prenom,
            role,
            codeProducteur,
        });
    }
    refreshToken(): Observable<string> {
        const refreshToken =
            (localStorage.getItem("refreshToken") as string) || "";

        return this.httpClient
            .post<any>(`${environment.apiUrl}/refreshToken`, { refreshToken })
            .pipe(
                map((response) => {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("refreshToken", response.refreshToken);
                    return response.token;
                })
            );
    }
}