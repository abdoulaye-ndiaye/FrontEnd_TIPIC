import { CommonModule } from "@angular/common";
import { ApplicationModule, Component, OnDestroy, OnInit } from "@angular/core";
import $ from "jquery";
import "datatables.net"; // Importation des types DataTables
import { UtilisateurService } from "../../../services/utilisateur.service";

@Component({
    selector: "app-utilisateur",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./utilisateur.component.html",
    styleUrl: "./utilisateur.component.scss",
})
export class UtilisateurComponent implements OnInit, OnDestroy {
    users: any[] = [];
    constructor(private utilisateurService: UtilisateurService) {}

    ngOnInit(): void {
        // Récupération des utilisateurs
        this.utilisateurService.getAll().subscribe((data) => {
            this.users = data;
            //console.log(data);
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
                pageLength: 10,
                processing: true,
                lengthMenu: [5, 10, 25],
            });
        }, 1000);
    }

    ngOnDestroy(): void {
        $("#userTable").DataTable().destroy(); // Détruire le DataTable pour éviter les fuites de mémoire
    }
}
