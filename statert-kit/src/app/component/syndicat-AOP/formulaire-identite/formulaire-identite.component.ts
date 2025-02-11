import { CommonModule } from "@angular/common";
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
import { FromageService } from "../../../services/fromage.service";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

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

 // Méthodes utilitaires
cleanInput(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
}

replaceCommaWithDot(event: any) {
    // const input = event.target as HTMLInputElement;
    // input.value = input.value.replace(',', '.');
}

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
        return !this.categorie?.valid;
      // !this.raceDominante?.valid ||
      // !this.nbBrebis?.valid ||
      // !this.productivite?.valid ||
      // !this.periodeAgnelage?.valid ||
      // !this.estive?.valid ||
      // !this.paturage?.valid ||
      // !this.laitCru?.valid
      case 2:
        // Vérifier si le report sous vide est activé et si les dates sont valides
        const isSousVideValid =
          this.cheeseForm.get("reportVide")?.value === true
            ? this.dateMiseVide?.valid && this.dateSortieVide?.valid
            : true; // Si "Non" est sélectionné ou null, on n'exige pas les dates

        return (
          this.cheeseForm.hasError("invalidDateRange") ||
          this.cheeseForm.hasError("fabricationDateError") ||
          !isSousVideValid
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
        const isPreAffinageValid = this.cheeseForm.get("preAffinage")?.value === true
          ? this.dureePreAffinage?.valid && this.tempPreAffinage?.valid
          : true; // Si "Non" est sélectionné, on n'exige pas les champs

        // Inclure la validation du sous vide dans l'étape finale aussi
        const isFinalSousVideValid = this.cheeseForm.get('reportVide')?.value === true
          ? this.dateMiseVide?.valid && this.dateSortieVide?.valid
          : true; // Si "Non" est sélectionné ou null, on n'exige pas les dates

        // Validation pour l'humidification
        const isHumidificationValid = this.cheeseForm.get('humidificationActive')?.value === true
        ? this.cheeseForm.get('humidificationCave')?.valid
        : true;

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
          this.cheeseForm.hasError("invalidDateRange") ||
          this.cheeseForm.hasError("fabricationDateError") ||
          !this.preAffinage?.valid ||
          !isPreAffinageValid ||
          !isFinalSousVideValid ||
          !isHumidificationValid
        );
      default:
        return true; // Par défaut, le bouton est activé
    }
  }

  goToStep(step: number) {
    if (step >= 0 && step <= 3) {
      this.currentStep = step;
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
    if (this.cheeseForm.valid) {
      const formValue = this.cheeseForm.value;
      const humidificationValue = formValue.humidificationActive ? 
        formValue.humidificationCave : null;

      try {
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
            formValue.categorieFerment,
            formValue.typeFerments,
            formValue.dureeCoagulation,
            formValue.temperatureCaillage,
            formValue.salage,
            formValue.reportVide,
            formValue.dateMiseVide ?? null,
            formValue.dateSortieVide ?? null,
            formValue.dureeSousVide ?? null,
            echantillonId
          )
        );
        // Récupération de la valeur calculée avec vérification
        const dureeAffinageValue = this.cheeseForm.get('dureeAffinage')?.value ?? null; // Valeur par défaut 0 si null

        // Appel au service createAffinage
        await firstValueFrom(
          this.fromage.createAffinage(
            formValue.nomAffineur,
            dureeAffinageValue,
            formValue.preAffinage,
            formValue.dureePreAffinage ?? null,
            formValue.tempPreAffinage ?? null,
            formValue.brossageManuel,
            formValue.tempAffinage,
            formValue.humidificationActive,
            humidificationValue,
            echantillonId
          )
        );

        // Utilisation de Swal pour une alerte de succès
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Formulaire soumis avec succès !",
        }).then(() => {
          this.cheeseForm.reset(); // Réinitialiser le formulaire
        });
      } catch (error: any) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        // Vérification si l'erreur vient de la réponse du serveur
        if (error?.error === "echantillon existe déja") {
          // Utilisation de Swal pour une alerte d'erreur
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Le numéro de l'échantillon existe déjà. Veuillez modifier et réessayer.",
          });
        } else {
          // Utilisation de Swal pour une alerte d'erreur générique
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de la soumission du formulaire.",
          });
        }
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
