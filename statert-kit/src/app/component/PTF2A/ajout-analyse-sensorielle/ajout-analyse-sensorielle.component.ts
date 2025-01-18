import { CommonModule, Location } from "@angular/common";
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
import { forkJoin } from "rxjs";
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
    idsEchantillons: string[] = [];
    fromage: any;
    analyseSensorielle: any;
    echantillonsSelected: any;
  
    constructor(
      private formBuilder: FormBuilder,
      private fromageService: FromageService,
      private route: ActivatedRoute,
      private router: Router,
      private analyseSensorielleService: AnalyseSensorielleService,
      private location: Location
    ) {}
  
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const ids = params["ids"]; // Example: "id1,id2,id3"
            if (ids) {
              const idArray = ids.split(",");
              const requests = idArray.map((id: string) =>
                this.fromageService.getEchantillonById(id)
              );
              this.idsEchantillons = idArray;
              forkJoin(requests).subscribe(
                (results: any) => {
                  this.echantillonsSelected = results; // Populate echantillonsSelected
                },
                (error) => {
                  Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors du chargement des échantillons.",
                  });
                }
              );
            }
          });
          
  
      if (this.idsEchantillons.length > 0) {
        this.fromageService
          .getEchantillonById(this.idsEchantillons[0])
          .subscribe((data) => {
            this.fromage = data;
          });
  
        this.analyseSensorielleService
          .getByIdEchantilon(this.idsEchantillons[0])
          .subscribe((data) => {
            this.analyseSensorielle = data[0];
          });
      }
  
      this.analyseForm = this.formBuilder.group({
        numero_anonyme: ["", Validators.required],
        file: ["", Validators.required],
      });
    }
  
    onSubmit() {
        this.validate = true;
        this.nom = this.fileSelected?.name;
        // Ensure idsEchantillons is populated
        if (!this.idsEchantillons || this.idsEchantillons.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Aucun échantillon sélectionné.",
          });
          return;
        }
      
        if (this.analyseForm.valid && this.idsEchantillons.length > 0) {
          const formData = new FormData();
          formData.append("numeroAnonyme", this.analyseForm.value.numero_anonyme);
          formData.append("fichier", this.fileSelected, this.nom);
          formData.append("echantillons", JSON.stringify(this.idsEchantillons));
      
          this.analyseSensorielleService.upload(formData).subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Succès",
                text: "Analyse Sensorielle ajoutée avec succès.",
              });
              this.router.navigate(["/PTF2A/liste-echantillons"]);
            },
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Erreur lors de l'ajout de l'analyse sensorielle.",
              });
            }
          );
        }
      }
      
  
    onFileChange(event: any) {
      if (event.target.files[0]) {
        this.fileSelected = event.target.files[0] as File;
  
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ];
  
        if (!allowedTypes.includes(this.fileSelected.type)) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Veuillez télécharger un fichier au format CSV ou Excel.",
            confirmButtonColor: "var(--theme-default)",
          });
          this.analyseForm.controls["file"].setErrors({ invalidType: true });
        } else {
          this.analyseForm.controls["file"].setErrors(null);
        }
      }
    }
  
    reset() {
      this.analyseForm.reset();
      this.analyseForm.setErrors(null);
    }
  
    telecharger(id: string) {
      this.analyseSensorielleService.dowloadSiftMs(id);
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
          this.analyseSensorielleService.delete(id).subscribe(() => {
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
  
    goBack(): void {
      this.location.back();
    }
  
    get numero_anonyme() {
      return this.analyseForm.get("numero_anonyme");
    }
  
    get file() {
      return this.analyseForm.get("file");
    }
  }
