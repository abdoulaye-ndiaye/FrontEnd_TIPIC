import { CommonModule } from "@angular/common";
import { ApplicationModule, Component, OnDestroy, OnInit } from "@angular/core";
import { FromageService } from "../../../services/fromage.service";
import $ from "jquery";
import "datatables.net";
import { Router } from "@angular/router";

@Component({
    selector: "app-liste-echantillons",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./liste-echantillons.component.html",
    styleUrl: "./liste-echantillons.component.scss",
})
export class ListeEchantillonsComponent implements OnInit, OnDestroy {
    echantillons: any;

    constructor(
        private fromageService: FromageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fromageService.getAll().subscribe((data) => {
            this.echantillons = data;
        });

        // Initialisation de DataTables avec setTimeout
        setTimeout(() => {
            $("#userTable").DataTable({
                language: {
                    processing: "Traitement en cours...",
                    search: "Rechercher&nbsp;:",
                    lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
                    info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                    infoEmpty:
                        "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                    infoFiltered:
                        "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                    loadingRecords: "Chargement en cours...",
                    zeroRecords:
                        "Aucun &eacute;l&eacute;ment &agrave; afficher",
                    emptyTable: "Aucune donnée disponible dans le tableau",
                },
                pagingType: "full_numbers",
                pageLength: 5,
                processing: true,
                lengthMenu: [5, 10, 25],
            });
        }, 1000);
    }

    ngOnDestroy(): void {
        $("#userTable").DataTable().destroy(); // Détruire le DataTable pour éviter les fuites de mémoire
    }

    voir(id: string) {
        this.router.navigate(["/syndicat/details-echantillon"], {
            queryParams: { id: id },
        });
    }
}
