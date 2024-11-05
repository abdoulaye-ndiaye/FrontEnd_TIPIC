import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class SiftMsService {
    constructor(private httpClient: HttpClient) {}

    upload(data: any) {
        return this.httpClient.post<any>(
            `${environment.apiUrl}/upload-article`,
            data
        );
    }
}
