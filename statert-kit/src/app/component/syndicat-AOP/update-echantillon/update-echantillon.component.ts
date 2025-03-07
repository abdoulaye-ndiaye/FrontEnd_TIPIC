import { ApplicationModule, Component, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";
import { FromageService } from "../../../services/fromage.service";
import { CommonModule, DatePipe, Location } from "@angular/common";

// Validateur personnalisé pour nbBrebis
export function nbBrebisValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // Retourne null si le champ est vide (optionnel)
        }
        return value >= 1 ? null : { minValue: { min: 1, actual: value } };
    };
}

// Validateur personnalisé pour productivite
export function productiviteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // Retourne null si le champ est vide (optionnel)
        }
        return value >= 0 ? null : { minValue: { min: 0, actual: value } };
    };
}
@Component({
    selector: "app-update-echantillon",
    standalone: true,
    imports: [CommonModule, ApplicationModule, ReactiveFormsModule],
    providers: [DatePipe],
    templateUrl: "./update-echantillon.component.html",
    styleUrl: "./update-echantillon.component.scss",
})
export class UpdateEchantillonComponent implements OnInit {
    currentStep: number = 0;
    cheeseForm: FormGroup;
    validate: boolean = false; // Initialiser à false
    id_echantillon: string;
    echantillon: any;
    production: any;
    affinage: any;
    fabrication: any;

    constructor(
        private fb: FormBuilder,
        private fromageService: FromageService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private router: Router,
        private location: Location
    ) {
        this.cheeseForm = this.fb.group(
            {
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
                raceDominante: ["BASCO_BEARNAISE"],
                nbBrebis: ["", nbBrebisValidator()],
                productivite: ["", productiviteValidator()],
                periodeAgnelage: ["OCT_NOV"],
                estive: [null],
                paturage: [null],
                laitCru: [null],

                // Fabrication
                dateFabrication: [""],
                nombreTraites: [null],
                temperatureEmpressurage: [null],
                quantitePresure: [null],
                categorieFerment: ['MESOPHILE'],  // pour mésophile, thermophile, méso&thermophile 
                typeFerments: [""], // pour la saisie libre
                dureeCoagulation: [null],
                temperatureCaillage: [null],
                salage: ["A_SEC"],
                reportVide: [null],
                dateMiseVide: [{ value: "", disabled: true }],
                dateSortieVide: [{ value: "", disabled: true }],
                dureeSousVide: [{ value: null, disabled: true }],

                // Affinage
                nomAffineur: [""],
                dureeAffinage: [{ value: '', disabled: true }],
                preAffinage: [null],
                dureePreAffinage: [{ value: '', disabled: true }],
                tempPreAffinage: [{ value: '', disabled: true }],
                brossageManuel: [null],
                tempAffinage: [null],
                humidificationActive: [null],  // boolean pour oui/non
                humidificationCave: [''],      // texte pour le type d'humidificateur
            },
            { validators: [this.dateRangeValidator, this.fabricationDateValidator] }
        );
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.id_echantillon = params["id"];
        });

        // Observer pour le preAffinage
        this.cheeseForm.get('preAffinage')?.valueChanges.subscribe((value) => {
            const dureeControl = this.cheeseForm.get('dureePreAffinage');
            const tempControl = this.cheeseForm.get('tempPreAffinage');

            if (value === true) {
                dureeControl?.enable();
                tempControl?.enable();
                dureeControl?.setValidators([Validators.required, Validators.min(0)]);
                tempControl?.setValidators([Validators.required, Validators.min(0)]);
            } else {
                dureeControl?.disable();
                tempControl?.disable();
                dureeControl?.clearValidators();
                tempControl?.clearValidators();
                dureeControl?.setValue('');
                tempControl?.setValue('');
            }

            dureeControl?.updateValueAndValidity();
            tempControl?.updateValueAndValidity();
        });

        // Nouveau : Calcul automatique de la durée d'affinage
        const calculateAgingDuration = () => {
            const fabricationDate = this.cheeseForm.get("dateFabrication")?.value;
            const samplingDate = this.cheeseForm.get("datePrelevement")?.value;

            if (fabricationDate && samplingDate) {
                const fabrication = new Date(fabricationDate);
                const sampling = new Date(samplingDate);

                // Calcul de la différence en jours
                const diffTime = Math.abs(sampling.getTime() - fabrication.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                this.cheeseForm.get("dureeAffinage")?.patchValue(diffDays);
            } else {
                this.cheeseForm.get("dureeAffinage")?.patchValue(null);
            }
        };

        // Surveillance des changements de dates pour mettre à jour la durée d'affinage
        this.cheeseForm.get("dateFabrication")?.valueChanges.subscribe(() => {
            calculateAgingDuration();
        });

        this.cheeseForm.get("datePrelevement")?.valueChanges.subscribe(() => {
            calculateAgingDuration();
        });

        // Observer pour le reportVide
        this.cheeseForm.get("reportVide")?.valueChanges.subscribe((value) => {
            const dateMiseVideControl = this.cheeseForm.get("dateMiseVide");
            const dateSortieVideControl = this.cheeseForm.get("dateSortieVide");

            if (value === true) {
                dateMiseVideControl?.enable();
                dateSortieVideControl?.enable();
                dateMiseVideControl?.setValidators([
                    Validators.required,
                    this.dateValidator,
                ]);
                dateSortieVideControl?.setValidators([
                    Validators.required,
                    this.dateValidator,
                ]);
            } else {
                dateMiseVideControl?.disable();
                dateSortieVideControl?.disable();
                dateMiseVideControl?.clearValidators();
                dateSortieVideControl?.clearValidators();
                dateMiseVideControl?.setValue("");
                dateSortieVideControl?.setValue("");
                this.cheeseForm.get("dureeSousVide")?.setValue(null);
            }

            dateMiseVideControl?.updateValueAndValidity();
            dateSortieVideControl?.updateValueAndValidity();
        });

        // Calcul automatique de la durée sous vide
        const calculateSousVideDuration = () => {
            const startDate = this.cheeseForm.get("dateMiseVide")?.value;
            const endDate = this.cheeseForm.get("dateSortieVide")?.value;

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                if (start <= end) {
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    this.cheeseForm.get("dureeSousVide")?.setValue(diffDays);
                } else {
                    this.cheeseForm.get("dureeSousVide")?.setValue(null);
                }
            } else {
                this.cheeseForm.get("dureeSousVide")?.setValue(null);
            }
        };

        // Observe les changements de dates pour calculer la durée
        this.cheeseForm.get("dateMiseVide")?.valueChanges.subscribe(() => {
            calculateSousVideDuration();
        });

        this.cheeseForm.get("dateSortieVide")?.valueChanges.subscribe(() => {
            calculateSousVideDuration();
        });

        // Ajout d'un listener pour la gestion conditionnelle
        this.cheeseForm.get('humidificationActive')?.valueChanges.subscribe(value => {
            const humidificationControl = this.cheeseForm.get('humidificationCave');
            if (value === true) {
                humidificationControl?.setValidators([Validators.required]);
            } else {
                humidificationControl?.clearValidators();
            }
            humidificationControl?.updateValueAndValidity();
        });

        this.fromageService
            .getEchantillonById(this.id_echantillon)
            .subscribe((data) => {
                this.echantillon = data;
                this.cheeseForm.patchValue({
                    datePrelevement: this.datePipe.transform(
                        data.datePrelevement,
                        "yyyy-MM-dd"
                    ),
                    numeroEchantillon: data.numeroEchan,
                    identifiantProducteur: data.codeProducteur,
                    typicite: data.typicite,
                });
                this.fromageService
                    .getProductionByIdEchantilon(this.id_echantillon)
                    .subscribe((data1) => {
                        this.production = data1[0];
                        this.cheeseForm.patchValue({
                            categorie: data1[0].categorie,
                            raceDominante: data1[0].raceDominante,
                            nbBrebis: data1[0].nbreBrebis,
                            productivite: data1[0].productivite,
                            periodeAgnelage: data1[0].periodeAgnelage,
                            estive: data1[0].fabriqueEstive,
                            paturage: data1[0].fabriquePaturage,
                            laitCru: data1[0].fabriqueLaitCru,
                        });
                        this.fromageService
                            .getAffinageByIdEchantilon(this.id_echantillon)
                            .subscribe((data2) => {
                                this.affinage = data2[0];

                                this.cheeseForm.patchValue({
                                    nomAffineur: data2[0].affineur,
                                    dureeAffinage: data2[0].dureeAffinage, // Correction de la propriété
                                    preAffinage: data2[0].preAffinage,
                                    dureePreAffinage: data2[0].dureePreAffinage, // Ajout de cette propriété manquante
                                    tempAffinage: data2[0].tempAffinage,
                                    tempPreAffinage: data2[0].tempPreAffinage,
                                    brossageManuel: data2[0].brossManuel,
                                    humidificationActive: data2[0].humidificationActive,
                                    humidificationCave: data2[0].sysHumidCave,
                                });
                                this.fromageService
                                    .getFabricationByIdEchantilon(
                                        this.id_echantillon
                                    )
                                    .subscribe((data3) => {
                                        this.fabrication = data3[0];
                                        this.cheeseForm.patchValue({
                                            dateFabrication:
                                                this.datePipe.transform(
                                                    data3[0].dateFabri,
                                                    "yyyy-MM-dd"
                                                ),
                                            nombreTraites: data3[0].nbreTraitesFabri,
                                            temperatureEmpressurage: data3[0].tempEmpresurage,
                                            quantitePresure: data3[0].quantEmpresurage,
                                            typeFerments: data3[0].typeFerment,
                                            dureeCoagulation: data3[0].dureeCoagulation,
                                            temperatureCaillage: data3[0].tempChauffage,
                                            salage: data3[0].typeSalage,
                                            reportVide: data3[0].reportSvAvAffinage,
                                            dateMiseVide:
                                                this.datePipe.transform(
                                                    data3[0].dateMiseSousVide,
                                                    "yyyy-MM-dd"
                                                ),
                                            dateSortieVide:
                                                this.datePipe.transform(
                                                    data3[0].dateSortieSousVide,
                                                    "yyyy-MM-dd"
                                                ),
                                            dureeSousVide: data3[0].dureeSousVide // Ajout de cette propriété manquante
                                        });
                                    });
                            });
                    });
            });

    }

    // Custom date validator to ensure valid date format
    dateValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        // Check if date is in correct format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
            return { invalidDateFormat: true };
        }

        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return { invalidDate: true };
        }

        return null;
    }

    // Custom validator to ensure dateSortieVide is after dateMiseVide
    dateRangeValidator(group: FormGroup): ValidationErrors | null {
        const dateMiseVide = group.get("dateMiseVide")?.value;
        const dateSortieVide = group.get("dateSortieVide")?.value;

        if (!dateMiseVide || !dateSortieVide) {
            return null;
        }

        const miseVideDate = new Date(dateMiseVide);
        const sortieVideDate = new Date(dateSortieVide);

        return sortieVideDate <= miseVideDate ? { invalidDateRange: true } : null;
    }

    // Ajout du validateur pour les dates de fabrication/prélèvement
    fabricationDateValidator(group: AbstractControl): ValidationErrors | null {
        const fabricationDate = group.get("dateFabrication")?.value;
        const samplingDate = group.get("datePrelevement")?.value;

        if (fabricationDate && samplingDate) {
            const fabrication = new Date(fabricationDate);
            const sampling = new Date(samplingDate);

            if (fabrication > sampling) {
                return {
                    fabricationDateError:
                        "La date de fabrication doit être antérieure à la date de prélèvement",
                };
            }
        }
        return null;
    }
    goToStep(step: number) {
        if (step >= 0 && step <= 3) {
            this.currentStep = step;
        }
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

    replaceCommaWithDot(event: Event) { }

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
                    !this.categorie?.valid
                    // !this.raceDominante?.valid ||
                    // !this.nbBrebis?.valid ||
                    // !this.productivite?.valid ||
                    // !this.periodeAgnelage?.valid ||
                    // !this.estive?.valid ||
                    // !this.paturage?.valid ||
                    // !this.laitCru?.valid
                );
            case 2:
                return (
                    this.cheeseForm.hasError('invalidDateRange')
                );
            // return (
            //     !this.dateFabrication?.valid ||
            //     !this.nombreTraites?.valid ||
            //     !this.temperatureEmpressurage?.valid ||
            //     !this.quantitePresure?.valid ||
            //     !this.typeFerments?.valid ||
            //     !this.dureeCoagulation?.valid ||
            //     !this.temperatureCaillage?.valid ||
            //     !this.salage?.valid ||
            //     !this.reportVide?.valid ||
            //     !this.dateMiseVide?.valid ||
            //     !this.dateSortieVide?.valid
            // );
            case 3:
                // Vérifier si le pré-affinage est activé et si les champs associés sont valides
                // const isPreAffinageValid = this.cheeseForm.get('preAffinage')?.value
                //     ? this.dureeAffinage?.valid && this.tempPreAffinage?.valid
                //     : true; // Si "Non" est sélectionné, on n'exige pas les champs

                // return (
                //     !this.nomAffineur?.valid ||
                //     !this.preAffinage?.valid ||
                //     !isPreAffinageValid || // Ajoutez cette condition
                //     !this.brossageManuel?.valid ||
                //     !this.humidificationCave?.valid
                // );
                return (
                    !this.datePrelevement?.valid ||
                    !this.numeroEchantillon?.valid ||
                    !this.identifiantProducteur?.valid ||
                    !this.typicite?.valid ||
                    !this.categorie?.valid ||
                    this.cheeseForm.hasError('invalidDateRange')
                );
            default:
                return true; // Par défaut, le bouton est activé
        }
    }

    // Getter pour faciliter l'accès aux contrôles dans le template

    get categorieFerment() {
        return this.cheeseForm.get("categorieFerment");
    }
    get dureeSousVide() {
        return this.cheeseForm.get("dureeSousVide");
    }
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

    get dureePreAffinage() {
        return this.cheeseForm.get("dureePreAffinage");
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
        if (this.validate) {
            const formValue = this.cheeseForm.value;

            try {
                // Utilisation de firstValueFrom
                const echantillonResponse = await firstValueFrom(
                    this.fromageService.updateEchantillon(
                        this.id_echantillon,
                        formValue.numeroEchantillon,
                        formValue.typicite,
                        formValue.datePrelevement,
                        formValue.identifiantProducteur
                    )
                );

                const echantillonId = echantillonResponse._id;

                // Appel au service createProduction
                await firstValueFrom(
                    this.fromageService.updateProduction(
                        this.production._id,
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
                    this.fromageService.updateFabrication(
                        this.fabrication._id,
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
                        formValue.dureeSousVide,
                        echantillonId
                    )
                );

                // Appel au service createAffinage
                await firstValueFrom(
                    this.fromageService.updateAffinage(
                        this.affinage._id,
                        formValue.nomAffineur,
                        formValue.dureeAffinage,
                        formValue.preAffinage,
                        formValue.dureePreAffinage,
                        formValue.tempAffinage,
                        formValue.brossageManuel,
                        formValue.tempAffinage,
                        formValue.humidificationActive,
                        formValue.humidificationCave,
                        echantillonId
                    )
                );

                // Utilisation de Swal pour une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès",
                    text: "Echantillon mis à jour avec succès !",
                }).then(() => {
                    // Redirection vers la page d'accueil
                    this.router.navigate(["/syndicat/liste-echantillons"]);
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
    goBack(): void {
        this.location.back(); // Retour à la page précédente
    }
}
