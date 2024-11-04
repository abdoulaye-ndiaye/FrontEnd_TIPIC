import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { jwtDecode } from "jwt-decode";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-dashboard-admin",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./dashboard-admin.component.html",
    styleUrl: "./dashboard-admin.component.scss",
})
export class DashboardAdminComponent implements OnInit {
    constructor(private authService: AuthService) {}
    nom: string;
    prenom: string;
    decodedToken: any;

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        //console.log(this.decodedToken);
        this.nom = this.decodedToken.user.nom;
        this.prenom = this.decodedToken.user.prenom;
    }
}
