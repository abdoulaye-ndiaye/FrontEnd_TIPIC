import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class FromageService {
    constructor(private httpClient: HttpClient) {}

    getAll() {
        return this.httpClient.get<any>(`${environment.apiUrl}/echantillon`);
    }
    createEchantillon(
        numeroEchan: string,
        typicite: string,
        datePrelevement: Date,
        codeProducteur: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/echantillon`, {
            numeroEchan,
            typicite,
            datePrelevement,
            codeProducteur,
        });
    }

    createProduction(
        categorie: string,
        raceDominante: string,
        nbreBrebis: Number,
        productivite: Number,
        periodeAgnelage: string,
        fabriqueEstive: Boolean,
        fabriquePaturage: Boolean,
        fabriqueLaitCru: Boolean,
        echantillonId: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/production`, {
            categorie,
            raceDominante,
            nbreBrebis,
            productivite,
            periodeAgnelage,
            fabriqueEstive,
            fabriquePaturage,
            fabriqueLaitCru,
            echantillonId,
        });
    }

    createFabrication(
        dateFabri: Date,
        nbreTraitesFabri: Number,
        tempEmpresurage: Number,
        quantEmpresurage: Number,
        typeFerment: string,
        dureeCoagulation: Number,
        tempChauffage: Number,
        typeSalage: string,
        reportSvAvAffinage: Boolean,
        dateMiseSousVide: Date,
        dateSortieSousVide: Date,
        echantillonId: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/fabrication`, {
            dateFabri,
            nbreTraitesFabri,
            tempEmpresurage,
            quantEmpresurage,
            typeFerment,
            dureeCoagulation,
            tempChauffage,
            typeSalage,
            reportSvAvAffinage,
            dateMiseSousVide,
            dateSortieSousVide,
            echantillonId,
        });
    }

    createAffinage(
        affineur: string,
        preAffinage: Boolean,
        dureePreAffinage: Number,
        tempPreAffinage: Number,
        brossManuel: Boolean,
        tempAffinage: Number,
        sysHumidCave: string,
        echantillonId: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/affinage`, {
            affineur,
            preAffinage,
            dureePreAffinage,
            tempPreAffinage,
            brossManuel,
            tempAffinage,
            sysHumidCave,
            echantillonId,
        });
    }

    getEchantillonByProducteur(codeProducteur: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/producteur/${codeProducteur}/echantillon`
        );
    }
}
