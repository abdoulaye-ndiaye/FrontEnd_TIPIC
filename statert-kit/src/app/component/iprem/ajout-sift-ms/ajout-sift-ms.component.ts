import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { SiftMsService } from "../../../services/sift-ms.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FromageService } from "../../../services/fromage.service";

@Component({
    selector: "app-ajout-sift-ms",
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: "./ajout-sift-ms.component.html",
    styleUrl: "./ajout-sift-ms.component.scss",
})
export class AjoutSiftMsComponent implements OnInit {
    siftMsForm: FormGroup;
    validate = false;
    fileSelected: File;
    nom: string;
    id_echantillon: string;
    fromage: any;
    siftMs: any;

    constructor(
        private formBuilder: FormBuilder,
        private siftMsService: SiftMsService,
        private route: ActivatedRoute,
        private router: Router,
        private fromageService: FromageService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.id_echantillon = params["id"];
        });

        this.fromageService
            .getEchantillonById(this.id_echantillon)
            .subscribe((data) => {
                this.fromage = data;
            });
        this.siftMsService
            .getByIdEchantilon(this.id_echantillon)
            .subscribe((data) => {
                this.siftMs = data[0];
            });

        this.siftMsForm = this.formBuilder.group({
            blanc_positif: ["", Validators.required],
            blanc_negatif: ["", Validators.required],
            fromage_positif: ["", Validators.required],
            fromage_negatif: ["", Validators.required],
            file: ["", Validators.required],
        });
    }

    onSubmit() {
        this.validate = true;
        this.nom = this.fileSelected.name;
        if (this.siftMsForm.valid) {
            console.log(this.siftMsForm.value);
            const formData = new FormData();
            formData.append(
                "blanc_positif",
                this.siftMsForm.value.blanc_positif
            );
            formData.append(
                "blanc_negatif",
                this.siftMsForm.value.blanc_negatif
            );
            formData.append(
                "fromage_positif",
                this.siftMsForm.value.fromage_positif
            );
            formData.append(
                "fromage_negatif",
                this.siftMsForm.value.fromage_negatif
            );
            formData.append("fichier", this.fileSelected, this.nom);
            formData.append("echantillonId", this.id_echantillon);

            this.siftMsService.upload(formData).subscribe(
                (response) => {
                    Swal.fire({
                        icon: "success",
                        title: "Succès",
                        text: "SIFT-MS ajouté avec succès.",
                    }).then(() => {
                        window.location.reload();
                    });
                    //console.log(response);
                },
                (error) => {
                    //console.log(error);

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors de l'ajout du SIFT-MS.",
                    });
                }
            );
        }
    }
    telecharger(id: string) {
        this.siftMsService.dowloadSiftMs(id);
    }
    onFileChange(event: any) {
        if (event.target.files[0]) {
            this.fileSelected = event.target.files[0] as File;
        }
    }
    reset() {
        this.siftMsForm.reset();
        this.siftMsForm.setErrors(null);
    }

    delete(id: string) {
        Swal.fire({
            title: "Voulez-vous vraiment supprimer ce fichier ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
        }).then((result) => {
            if (result.isConfirmed) {
                this.siftMsService.delete(id).subscribe((data) => {
                    Swal.fire(
                        "Supprimé !",
                        "Le fichier a été supprimé avec succès.",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                });
            }
        });
    }

    get blanc_positif() {
        return this.siftMsForm.get("blanc_positif");
    }
    get blanc_negatif() {
        return this.siftMsForm.get("blanc_negatif");
    }
    get fromage_positif() {
        return this.siftMsForm.get("fromage_positif");
    }
    get fromage_negatif() {
        return this.siftMsForm.get("fromage_negatif");
    }
    get file() {
        return this.siftMsForm.get("file");
    }
}
