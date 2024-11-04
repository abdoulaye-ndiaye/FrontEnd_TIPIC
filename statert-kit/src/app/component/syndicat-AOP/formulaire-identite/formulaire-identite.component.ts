import { CommonModule } from "@angular/common";
import { ApplicationModule, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { FromageService } from "../../../services/fromage.service";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

@Component({
    selector: "app-formulaire-identite",
    standalone: true,
    imports: [CommonModule, ApplicationModule, ReactiveFormsModule],
    templateUrl: "./formulaire-identite.component.html",
    styleUrls: ["./formulaire-identite.component.scss"],
})
export class FormulaireIdentiteComponent implements OnInit {
    currentStep: number = 0;
    cheeseForm: FormGroup;
    validate: boolean = false; // Initialiser à false

    constructor(private fb: FormBuilder, private fromage: FromageService) {}

    ngOnInit(): void {
        this.cheeseForm = this.fb.group({
            // Identifiants
            datePrelevement: ["", Validators.required],
            numeroEchantillon: [
                "",
                [Validators.required, Validators.minLength(10)],
            ],
            identifiantProducteur: [
                "",
                [Validators.required, Validators.minLength(6)],
            ],
            typicite: ["", Validators.required],

            // Production
            categorie: ["", Validators.required],
            raceDominante: ["", Validators.required],
            nbBrebis: ["", [Validators.required, Validators.min(1)]],
            productivite: ["", [Validators.required, Validators.min(0)]],
            periodeAgnelage: ["", Validators.required],
            estive: [null, Validators.required],
            paturage: [null, Validators.required],
            laitCru: [null, Validators.required],

            // Fabrication
            dateFabrication: ["", Validators.required],
            nombreTraites: [null, Validators.required],
            temperatureEmpressurage: [null, Validators.required],
            quantitePresure: [null, Validators.required],
            typeFerments: ["", Validators.required],
            dureeCoagulation: [null, Validators.required],
            temperatureCaillage: [null, Validators.required],
            salage: ["", Validators.required],
            reportVide: ["", Validators.required],
            dateMiseVide: ["", Validators.required],
            dateSortieVide: ["", Validators.required],

            // Affinage
            nomAffineur: ["", Validators.required],
            preAffinage: [false, Validators.required],
            dureeAffinage: [null, Validators.required],
            brossageManuel: [false, Validators.required],
            tempPreAffinage: [null, Validators.required],
            tempAffinage: [null, Validators.required],
            humidificationCave: ["", Validators.required],
        });

        // Surveiller les changements du champ "preAffinage"
        this.cheeseForm.get("preAffinage")?.valueChanges.subscribe((value) => {
            if (!value) {
                this.cheeseForm.get("dureeAffinage")?.setValue(null);
                this.cheeseForm.get("tempAffinage")?.setValue(null);
            }
        });
    }

    // Méthodes pour naviguer entre les étapes
    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    cleanInput(event: Event) {
        const input = event.target as HTMLInputElement;

        // Retire tous les caractères non numériques de la valeur actuelle de l'input
        input.value = input.value.replace(/[^0-9]/g, "");
    }

    replaceCommaWithDot(event: Event) {}

    isNextDisabled(): boolean {
        switch (this.currentStep) {
            case 0:
                return (
                    !this.datePrelevement?.valid ||
                    !this.numeroEchantillon?.valid ||
                    !this.identifiantProducteur?.valid ||
                    !this.typicite?.valid
                );
            case 1:
                return (
                    !this.categorie?.valid ||
                    !this.raceDominante?.valid ||
                    !this.nbBrebis?.valid ||
                    !this.productivite?.valid ||
                    !this.periodeAgnelage?.valid ||
                    !this.estive?.valid ||
                    !this.paturage?.valid ||
                    !this.laitCru?.valid
                );
            case 2:
                return (
                    !this.dateFabrication?.valid ||
                    !this.nombreTraites?.valid ||
                    !this.temperatureEmpressurage?.valid ||
                    !this.quantitePresure?.valid ||
                    !this.typeFerments?.valid ||
                    !this.dureeCoagulation?.valid ||
                    !this.temperatureCaillage?.valid ||
                    !this.salage?.valid ||
                    !this.reportVide?.valid ||
                    !this.dateMiseVide?.valid ||
                    !this.dateSortieVide?.valid
                );
            case 3:
                return (
                    !this.nomAffineur?.valid ||
                    !this.preAffinage?.valid ||
                    (!this.preAffinage?.value &&
                        (!this.dureeAffinage?.valid ||
                            !this.tempAffinage?.valid)) ||
                    !this.brossageManuel?.valid ||
                    !this.humidificationCave?.valid
                );
            default:
                return true; // Par défaut, le bouton est activé
        }
    }

    // Getter pour faciliter l'accès aux contrôles dans le template
    get datePrelevement() {
        return this.cheeseForm.get("datePrelevement");
    }

    get numeroEchantillon() {
        return this.cheeseForm.get("numeroEchantillon");
    }

    get identifiantProducteur() {
        return this.cheeseForm.get("identifiantProducteur");
    }

    get typicite() {
        return this.cheeseForm.get("typicite");
    }

    get categorie() {
        return this.cheeseForm.get("categorie");
    }

    get raceDominante() {
        return this.cheeseForm.get("raceDominante");
    }

    get nbBrebis() {
        return this.cheeseForm.get("nbBrebis");
    }

    get productivite() {
        return this.cheeseForm.get("productivite");
    }

    get periodeAgnelage() {
        return this.cheeseForm.get("periodeAgnelage");
    }

    get estive() {
        return this.cheeseForm.get("estive");
    }

    get paturage() {
        return this.cheeseForm.get("paturage");
    }

    get laitCru() {
        return this.cheeseForm.get("laitCru");
    }

    get dateFabrication() {
        return this.cheeseForm.get("dateFabrication");
    }

    get nombreTraites() {
        return this.cheeseForm.get("nombreTraites");
    }

    get temperatureEmpressurage() {
        return this.cheeseForm.get("temperatureEmpressurage");
    }

    get quantitePresure() {
        return this.cheeseForm.get("quantitePresure");
    }

    get typeFerments() {
        return this.cheeseForm.get("typeFerments");
    }

    get dureeCoagulation() {
        return this.cheeseForm.get("dureeCoagulation");
    }

    get temperatureCaillage() {
        return this.cheeseForm.get("temperatureCaillage");
    }

    get salage() {
        return this.cheeseForm.get("salage");
    }

    get reportVide() {
        return this.cheeseForm.get("reportVide");
    }

    get dateMiseVide() {
        return this.cheeseForm.get("dateMiseVide");
    }

    get dateSortieVide() {
        return this.cheeseForm.get("dateSortieVide");
    }

    get dureeAffinage() {
        return this.cheeseForm.get("dureeAffinage");
    }

    get nomAffineur() {
        return this.cheeseForm.get("nomAffineur");
    }

    get preAffinage() {
        return this.cheeseForm.get("preAffinage");
    }

    get brossageManuel() {
        return this.cheeseForm.get("brossageManuel");
    }

    get tempPreAffinage() {
        return this.cheeseForm.get("tempPreAffinage");
    }

    get tempAffinage() {
        return this.cheeseForm.get("tempAffinage");
    }

    get humidificationCave() {
        return this.cheeseForm.get("humidificationCave");
    }

    async onSubmit() {
        this.validate = true;
        console.log(this.cheeseForm.value);
        if (this.cheeseForm.valid) {
            const formValue = this.cheeseForm.value;

            try {
                console.log("entrer");
                // Utilisation de firstValueFrom
                const echantillonResponse = await firstValueFrom(
                    this.fromage.createEchantillon(
                        formValue.numeroEchantillon,
                        formValue.typicite,
                        formValue.datePrelevement,
                        formValue.identifiantProducteur
                    )
                );

                const echantillonId = echantillonResponse._id;
                console.log(echantillonId);

                // Appel au service createProduction
                await firstValueFrom(
                    this.fromage.createProduction(
                        formValue.categorie,
                        formValue.raceDominante,
                        formValue.nbBrebis,
                        formValue.productivite,
                        formValue.periodeAgnelage,
                        formValue.estive,
                        formValue.paturage,
                        formValue.laitCru,
                        echantillonId
                    )
                );

                // Appel au service createFabrication
                await firstValueFrom(
                    this.fromage.createFabrication(
                        formValue.dateFabrication,
                        formValue.nombreTraites,
                        formValue.temperatureEmpressurage,
                        formValue.quantitePresure,
                        formValue.typeFerments,
                        formValue.dureeCoagulation,
                        formValue.temperatureCaillage,
                        formValue.salage,
                        formValue.reportVide,
                        formValue.dateMiseVide,
                        formValue.dateSortieVide,
                        echantillonId
                    )
                );

                // Appel au service createAffinage
                await firstValueFrom(
                    this.fromage.createAffinage(
                        formValue.nomAffineur,
                        formValue.preAffinage,
                        formValue.dureeAffinage,
                        formValue.tempAffinage,
                        formValue.brossageManuel,
                        formValue.tempAffinage,
                        formValue.humidificationCave,
                        echantillonId
                    )
                );

                // Utilisation de Swal pour une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès",
                    text: "Formulaire soumis avec succès !",
                });
            } catch (error) {
                console.error(
                    "Erreur lors de la soumission du formulaire:",
                    error
                );

                // Utilisation de Swal pour une alerte d'erreur
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors de la soumission du formulaire.",
                });
            }
        } else {
            Swal.fire({
                icon: "warning",
                title: "Attention",
                text: "Veuillez remplir tous les champs obligatoires.",
            });
        }
    }
}
