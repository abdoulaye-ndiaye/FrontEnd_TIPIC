import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { FromageService } from "../../../services/fromage.service";
import { AnalyseSensorielleService } from "../../../services/analyse-sensorielle.service";
@Component({
    selector: "app-ajout-analyse-sensorielle",
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: "./ajout-analyse-sensorielle.component.html",
    styleUrl: "./ajout-analyse-sensorielle.component.scss",
})
export class AjoutAnalyseSensorielleComponent implements OnInit {
    analyseForm: FormGroup;
    validate = false;
    fileSelected: File;
    nom: string;
    id_echantillon: string;
    fromage: any;
    analyseSensorielle: any;
    constructor(
        private formBuilder: FormBuilder,
        private fromageService: FromageService,
        private route: ActivatedRoute,
        private router: Router,
        private analyseSensorielleService: AnalyseSensorielleService
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
        this.analyseSensorielleService
            .getByIdEchantilon(this.id_echantillon)
            .subscribe((data) => {
                this.analyseSensorielle = data[0];
            });
        this.analyseForm = this.formBuilder.group({
            numero_anonyme: ["", Validators.required],
            file: ["", Validators.required],
        });
    }
    onSubmit() {
        this.validate = true;
        this.nom = this.fileSelected.name;
        if (this.analyseForm.valid) {
            const formData = new FormData();
            formData.append(
                "numeroAnonyme",
                this.analyseForm.value.numero_anonyme
            );

            formData.append("fichier", this.fileSelected, this.nom);
            formData.append("echantillonId", this.id_echantillon);

            this.analyseSensorielleService.upload(formData).subscribe(
                (response) => {
                    Swal.fire({
                        icon: "success",
                        title: "Succès",
                        text: "Analyse Sensorielle ajouté avec succès.",
                    });
                    this.router.navigate(["/PTF2A/liste-echantillons"]);
                    //console.log(response);
                },
                (error) => {
                    //console.log(error);

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors de l'ajout de l'analyse sensorielle.",
                    });
                }
            );
        }
    }
    telecharger(id: string) {
        this.analyseSensorielleService.dowloadSiftMs(id);
    }
    onFileChange(event: any) {
        if (event.target.files[0]) {
            this.fileSelected = event.target.files[0] as File;
        }
    }
    reset() {
        this.analyseForm.reset();
        this.analyseForm.setErrors(null);
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
                this.analyseSensorielleService.delete(id).subscribe((data) => {
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

    get numero_anonyme() {
        return this.analyseForm.get("numero_anonyme");
    }
    get file() {
        return this.analyseForm.get("file");
    }
}
