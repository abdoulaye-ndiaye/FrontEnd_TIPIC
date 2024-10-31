import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class UtilisateurService {
    constructor(private httpClient: HttpClient) {}
    getAll() {
        return this.httpClient.get<any>(`${environment.apiUrl}/utilisateur`);
    }

    getById(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/utilisateur/${id}`
        );
    }
    // bloquer un utilisateur
    bloquer(id: string) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/bloquer-utilisateur/${id}`,
            {}
        );
    }
    // debloquer un utilisateur
    debloquer(id: string) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/debloquer-utilisateur/${id}`,
            {}
        );
    }
    // supprimer un utilisateur
    delete(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/utilisateur/${id}`
        );
    }
    // modifier un utilisateur
    update(id: string, utilisateur: any) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/utilisateur/${id}`,
            utilisateur
        );
    }
}
