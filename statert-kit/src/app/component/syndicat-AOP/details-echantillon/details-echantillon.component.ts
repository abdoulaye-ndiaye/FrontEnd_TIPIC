import { ApplicationModule, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FromageService } from "../../../services/fromage.service";
import { CommonModule, Location } from "@angular/common";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";

@Component({
    selector: "app-details-echantillon",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./details-echantillon.component.html",
    styleUrl: "./details-echantillon.component.scss",
})
export class DetailsEchantillonComponent implements OnInit {
    id_echantillon: string;
    echantillon: any;
    production: any;
    affinage: any;
    fabrication: any;
    decodedToken: any;
    roleUtilisateur: any;

    constructor(
        private route: ActivatedRoute,
        private fromageService: FromageService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        this.roleUtilisateur = this.decodedToken.user.role;

        this.route.queryParams.subscribe((params) => {
            this.id_echantillon = params["id"];
        });
        this.fromageService
            .getEchantillonById(this.id_echantillon)
            .subscribe((data) => {
                this.echantillon = data;
                this.fromageService
                    .getProductionByIdEchantilon(this.id_echantillon)
                    .subscribe((data1) => {
                        this.production = data1[0];
                        this.fromageService
                            .getAffinageByIdEchantilon(this.id_echantillon)
                            .subscribe((data2) => {
                                this.affinage = data2[0];
                                this.fromageService
                                    .getFabricationByIdEchantilon(
                                        this.id_echantillon
                                    )
                                    .subscribe((data3) => {
                                        this.fabrication = data3[0];
                                    });
                            });
                    });
            });
    }

    update(id: string) {
        this.router.navigate(["/syndicat/update-echantillon"], {
            queryParams: { id: id },
        });
    }
    deleteEchantillon(id: string) {
        Swal.fire({
            title: "Voulez-vous vraiment supprimer cet enregistrement ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
        }).then((result) => {
            if (result.isConfirmed) {
                this.fromageService
                    .deleteEchantillon(id)
                    .subscribe((data) => {
                        Swal.fire(
                            "Supprimé !",
                            "L'enregistrement a été supprimé avec succès.",
                            "success"
                        ).then(() => {
                            this.router.navigate([
                                "/syndicat/liste-echantillons",
                            ]);
                        });
                    });
            }
        });
    }
    refresh() {
        window.location.reload();
    }
    goBack(): void {
        this.location.back(); // Retour à la page précédente
    }

    downloadPDF() {
        const element = document.querySelector(
            ".echantillon-details"
        ) as HTMLElement;
        const pdf = new jsPDF("p", "mm", "a4"); // Format PDF A4 portrait

        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");

            const imgWidth = 210; // Largeur du PDF (A4)
            const pageHeight = 297; // Hauteur du PDF (A4)
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur proportionnelle
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Ajouter d'autres pages si nécessaire
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("echantillon-details-" + this.id_echantillon + ".pdf"); // Sauvegarder le fichier PDF
        });
    }
}
