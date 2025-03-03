import { CommonModule } from "@angular/common";
import { ApplicationModule, Component, OnDestroy, OnInit } from "@angular/core";
import { FromageService } from "../../../services/fromage.service";
import $ from "jquery";
import "datatables.net";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    selector: "app-liste-echantillons",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./liste-echantillons.component.html",
    styleUrl: "./liste-echantillons.component.scss",
})
export class ListeEchantillonsComponent implements OnInit, OnDestroy {
    echantillons: any;
    selectedEchantillons: string[] = [];

    constructor(
        private fromageService: FromageService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.fromageService.getAll().subscribe((data) => {
            this.echantillons = data;
        });
        // Ajouter un parser de date personnalisé pour le format dd-MM-YYYY HH:mm:ss
        $.fn.dataTable.ext.type.order['date-fr-pre'] = function (data: string | null | undefined) {
            // Si la donnée est vide, retourner une valeur minimale
            if (data === null || data === '' || data === undefined) {
                return -Infinity;
            }

            // Format attendu: dd-MM-YYYY HH:mm:ss
            var dateParts = data.split(' ')[0].split('-');
            var timeParts = data.split(' ')[1] ? data.split(' ')[1].split(':') : ['00', '00', '00'];

            // Inverser jour et mois pour obtenir MM-dd-YYYY
            var year = parseInt(dateParts[2], 10);
            var month = parseInt(dateParts[1], 10) - 1; // Les mois dans JS sont 0-11
            var day = parseInt(dateParts[0], 10);
            var hour = parseInt(timeParts[0], 10);
            var minute = parseInt(timeParts[1], 10);
            var second = parseInt(timeParts[2], 10);

            // Créer un timestamp pour le tri
            var timestamp = new Date(year, month, day, hour, minute, second).getTime();

            return isNaN(timestamp) ? -Infinity : timestamp;
        };

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
                pageLength: 25,
                processing: true,
                lengthMenu: [25, 40, 50, 75, 100],
                columnDefs: [{ targets: [1], type: "date-fr-pre" }],
                order: [[1, "desc"]],
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

    toggleSelection(id: string, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.selectedEchantillons.push(id);
        } else {
            this.selectedEchantillons = this.selectedEchantillons.filter(
                (selectedId) => selectedId !== id
            );
        }
    }
    // Vérifier si tous les échantillons sont sélectionnés
    isAllSelected(): boolean {
        return (
            this.echantillons.length > 0 &&
            this.selectedEchantillons.length === this.echantillons.length
        );
    }

    // Sélectionner / Désélectionner tous les échantillons
    toggleSelectAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        if (checked) {
            this.selectedEchantillons = this.echantillons.map(
                (e: { _id: any }) => e._id
            );
        } else {
            this.selectedEchantillons = [];
        }

        this.cdr.detectChanges(); // Force Angular à mettre à jour les cases à cocher
    }

    isChecked(id: string): boolean {
        return this.selectedEchantillons.includes(id);
    }

    exportationfichier(): void {
        // code pour l'exportation du fichier
        this.fromageService
            .exportEchantillons(this.selectedEchantillons)
            .subscribe((blob) => {
                const a = document.createElement("a");
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = "export_echantillons.csv";
                a.click();
                URL.revokeObjectURL(objectUrl);
            });
    }
}
