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
    updateEchantillon(
        id: string,
        numeroEchan: string,
        typicite: string,
        datePrelevement: Date,
        codeProducteur: string
    ) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/echantillon/${id}`,
            {
                numeroEchan,
                typicite,
                datePrelevement,
                codeProducteur,
            }
        );
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
    updateProduction(
        id: string,
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
        return this.httpClient.put<any>(
            `${environment.apiUrl}/production/${id}`,
            {
                categorie,
                raceDominante,
                nbreBrebis,
                productivite,
                periodeAgnelage,
                fabriqueEstive,
                fabriquePaturage,
                fabriqueLaitCru,
                echantillonId,
            }
        );
    }

    createFabrication(
        dateFabri: Date,
        nbreTraitesFabri: Number,
        tempEmpresurage: Number,
        quantEmpresurage: Number,
        categorieFerment: string,
        typeFerment: string,
        dureeCoagulation: Number,
        tempChauffage: Number,
        typeSalage: string,
        reportSvAvAffinage: Boolean,
        dateMiseSousVide: Date,
        dateSortieSousVide: Date,
        dureeSousVide: Number,
        echantillonId: string
    ) {
        return this.httpClient.post<any>(`${environment.apiUrl}/fabrication`, {
            dateFabri,
            nbreTraitesFabri,
            tempEmpresurage,
            quantEmpresurage,
            categorieFerment,
            typeFerment,
            dureeCoagulation,
            tempChauffage,
            typeSalage,
            reportSvAvAffinage,
            dateMiseSousVide,
            dateSortieSousVide,
            dureeSousVide,
            echantillonId,
        });
    }
    updateFabrication(
        id: string,
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
        return this.httpClient.put<any>(
            `${environment.apiUrl}/fabrication/${id}`,
            {
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
            }
        );
    }

    createAffinage(
        affineur: string,
        dureeAffinage: Number,
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
            dureeAffinage,
            preAffinage,
            dureePreAffinage,
            tempPreAffinage,
            brossManuel,
            tempAffinage,
            sysHumidCave,
            echantillonId,
        });
    }
    updateAffinage(
        id: string,
        affineur: string,
        preAffinage: Boolean,
        dureePreAffinage: Number,
        tempPreAffinage: Number,
        brossManuel: Boolean,
        tempAffinage: Number,
        sysHumidCave: string,
        echantillonId: string
    ) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/affinage/${id}`,
            {
                affineur,
                preAffinage,
                dureePreAffinage,
                tempPreAffinage,
                brossManuel,
                tempAffinage,
                sysHumidCave,
                echantillonId,
            }
        );
    }

    getEchantillonByProducteur(codeProducteur: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/producteur/${codeProducteur}/echantillon`
        );
    }

    getEchantillonById(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/echantillon/${id}`
        );
    }
    getProductionByIdEchantilon(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/echantillon/${id}/production`
        );
    }
    getAffinageByIdEchantilon(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/echantillon/${id}/affinage`
        );
    }
    getFabricationByIdEchantilon(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/echantillon/${id}/fabrication`
        );
    }

    deleteEchantillon(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/echantillon/${id}`
        );
    }
    deleteProduction(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/production/${id}`
        );
    }
    deleteAffinage(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/affinage/${id}`
        );
    }
    deleteFabrication(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/fabrication/${id}`
        );
    }
}
