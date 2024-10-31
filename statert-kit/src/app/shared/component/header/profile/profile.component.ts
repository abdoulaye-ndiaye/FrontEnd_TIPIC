import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FeathericonComponent } from "../../feathericon/feathericon.component";
import { AuthService } from "../../../../services/auth.service";

@Component({
    selector: "app-profile",
    standalone: true,
    imports: [CommonModule, FeathericonComponent, RouterModule],
    templateUrl: "./profile.component.html",
    styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
    public show: boolean = false;
    profile: any;
    token: string;
    nom: any;
    prenom: any;
    role: any;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.profile = this.authService.getDecodedToken(token);
        this.nom = this.profile.user.nom;
        this.prenom = this.profile.user.prenom;
        this.role = this.profile.user.role;
    }

    open() {
        this.show = !this.show;
    }

    logout() {
        this.authService.logout();
    }
}
