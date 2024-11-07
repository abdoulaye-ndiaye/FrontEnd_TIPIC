import { CommonModule } from "@angular/common";
import { ApplicationModule, Component, OnDestroy, OnInit } from "@angular/core";
import $ from "jquery";
import "datatables.net"; // Importation des types DataTables
import { UtilisateurService } from "../../../services/utilisateur.service";
import Swal from "sweetalert2";
import { Route, Router } from "@angular/router";

@Component({
    selector: "app-utilisateur",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./utilisateur.component.html",
    styleUrl: "./utilisateur.component.scss",
})
export class UtilisateurComponent implements OnInit, OnDestroy {
    users: any[] = [];
    constructor(
        private utilisateurService: UtilisateurService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Récupération des utilisateurs
        this.utilisateurService.getAll().subscribe((data) => {
            this.users = data;
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
    bloquer(id: string) {
        Swal.fire({
            title: "Voulez-vous vraiment bloquer cet utilisateur ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, bloquer",
        }).then((result) => {
            if (result.isConfirmed) {
                this.utilisateurService.bloquer(id).subscribe((data) => {
                    this.users = data;
                    Swal.fire(
                        "Bloqué !",
                        "L'utilisateur a été bloqué avec succès.",
                        "success"
                    ).then(() => {
                        this.refresh();
                    });
                });
            }
        });
    }

    debloquer(id: string) {
        Swal.fire({
            title: "Voulez-vous vraiment débloquer cet utilisateur ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, débloquer",
        }).then((result) => {
            if (result.isConfirmed) {
                this.utilisateurService.debloquer(id).subscribe((data) => {
                    this.users = data;
                    Swal.fire(
                        "Débloqué !",
                        "L'utilisateur a été débloqué avec succès.",
                        "success"
                    ).then(() => {
                        this.refresh();
                    });
                });
            }
        });
    }
    refresh() {
        window.location.reload();
    }
    update(id: string) {
        this.router.navigate(["/admin/update-utilisateur"], {
            queryParams: { id: id },
        });
    }
}
