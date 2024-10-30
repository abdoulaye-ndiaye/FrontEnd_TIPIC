import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { jwtDecode } from "jwt-decode";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class UtilisateurService {
    constructor(private httpClient: HttpClient) {}

    getDecodedToken(token: string) {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    getAll() {
        return this.httpClient.get<any>(`${environment.apiUrl}/utilisateur`);
    }
}
