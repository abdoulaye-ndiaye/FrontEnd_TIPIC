import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import Swal from "sweetalert2";

@Injectable({
    providedIn: "root",
})
export class SiftMsService {
    constructor(private httpClient: HttpClient) {}

    upload(data: any) {
        return this.httpClient.post<any>(`${environment.apiUrl}/siftMs`, data);
    }

    getByIdEchantilon(id: string) {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/echantillon/${id}/siftMs`
        );
    }

    downloadSiftMs(id: string, fileType: string) {
        // Afficher une notification de chargement
        Swal.fire({
            title: 'Téléchargement en cours',
            text: 'Veuillez patienter...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Construire l'URL avec le paramètre fileType
        const url = `${environment.apiUrl}/siftms/download/${id}?fileType=${fileType}`;
        
        this.httpClient
            .get(url, {
                responseType: "blob",
            })
            .subscribe(
                (res) => {
                    // Créer un objet URL pour le blob
                    const fileUrl = window.URL.createObjectURL(res);
                    
                    // Ouvrir le fichier dans un nouvel onglet
                    window.open(fileUrl);
                    
                    // Fermer la notification de chargement
                    Swal.close();
                },
                (error) => {
                    // Gérer les erreurs de téléchargement
                    console.error('Erreur lors du téléchargement:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur de téléchargement',
                        text: 'Impossible de télécharger le fichier demandé.'
                    });
                }
            );
    }
    delete(id: string) {
        return this.httpClient.delete<any>(
            `${environment.apiUrl}/siftMs/${id}`
        );
    }
    update(data: any) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/siftMs/update`,
            data
        );
    }
    updateWithFiles(data: any) {
        return this.httpClient.put<any>(
            `${environment.apiUrl}/siftMs/updateWithFiles`,
            data
        );
    }
    uploadNew(data: any) {
        return this.httpClient.post<any>(`${environment.apiUrl}/siftMs/upload`, data);
    }
}
