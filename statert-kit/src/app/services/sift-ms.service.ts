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

    dowloadSiftMs(id: string) {
        this.httpClient
            .get(`${environment.apiUrl}/download-siftMs/${id}`, {
                responseType: "blob",
            })
            .subscribe((res) => {
                window.open(window.URL.createObjectURL(res));
                Swal.close();
            });
    }
}
