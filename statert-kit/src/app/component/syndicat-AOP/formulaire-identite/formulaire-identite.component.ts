import { CommonModule } from '@angular/common';
import { ApplicationModule, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulaire-identite',
  standalone: true,
  imports: [CommonModule, ApplicationModule, ReactiveFormsModule],
  templateUrl: './formulaire-identite.component.html',
  styleUrls: ['./formulaire-identite.component.scss']
})
export class FormulaireIdentiteComponent implements OnInit {
  currentStep: number = 0;
  cheeseForm: FormGroup;
  validate: boolean = false; // Initialiser à false

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cheeseForm = this.fb.group({
      // Identifiants
      datePrelevement: ['', Validators.required],
      numeroEchantillon: ['', Validators.required],
      identifiantProducteur: ['', Validators.required],
      typicite: ['', Validators.required],

      // Production
      categorie: ['', Validators.required],
      raceDominante: ['', Validators.required],
      nbBrebis: ['', [Validators.required, Validators.min(1)]],
      productivite: ['', [Validators.required, Validators.min(0)]],
      periodeAgnelage: ['', Validators.required],
      estive: [null, Validators.required],
      paturage: [null, Validators.required],
      laitCru: [null, Validators.required],

      // Fabrication
      dateFabrication: ['', Validators.required],
      nombreTraites: [null, Validators.required],
      temperatureEmpressurage: [null, Validators.required],
      quantitePresure: [null, Validators.required],
      typeFerments: ['', Validators.required],
      dureeCoagulation: [null, Validators.required],
      temperatureCaillage: [null, Validators.required],
      salage: ['', Validators.required],
      reportVide: ['', Validators.required],
      dateMiseVide: ['', Validators.required],
      dateSortieVide: ['', Validators.required],

      // Affinage
      preAffinage: [false,Validators.required],
      dureeAffinage: [null,Validators.required],
      temperatureAffinage: [null,Validators.required],
      brossageManuel: [false,Validators.required],
      tempPreAffinage: [null,Validators.required],
      tempAffinage: [null,Validators.required],
      humidificationCave: ['', Validators.required],
      dureeHumidification: ['', Validators.required],
      temperatureHumidification: ['', Validators.required]
    });

    // Surveiller les changements du champ "preAffinage"
    this.cheeseForm.get('preAffinage')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.cheeseForm.get('dureeAffinage')?.setValue(null);
        this.cheeseForm.get('tempAffinage')?.setValue(null);
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

  isNextDisabled(): boolean {
    switch (this.currentStep) {
      case 0:
        return !this.datePrelevement?.valid || !this.numeroEchantillon?.valid || 
               !this.identifiantProducteur?.valid || !this.typicite?.valid;
      case 1:
        return !this.categorie?.valid || !this.raceDominante?.valid || 
               !this.nbBrebis?.valid || !this.productivite?.valid || 
               !this.periodeAgnelage?.valid || !this.estive?.valid || 
               !this.paturage?.valid || !this.laitCru?.valid;
      case 2:
        return !this.dateFabrication?.valid || !this.nombreTraites?.valid || 
               !this.temperatureEmpressurage?.valid || !this.quantitePresure?.valid || 
               !this.typeFerments?.valid || !this.dureeCoagulation?.valid || 
               !this.temperatureCaillage?.valid || !this.salage?.valid || 
               !this.reportVide?.valid || !this.dateMiseVide?.valid || 
               !this.dateSortieVide?.valid;
      case 3:
        return !this.preAffinage?.valid || 
               (!this.preAffinage?.value && 
                (!this.dureeAffinage?.valid || !this.tempAffinage?.valid)) || 
               !this.brossageManuel?.valid || 
               !this.humidificationCave?.valid;
      default:
        return true; // Par défaut, le bouton est activé
    }
  }
  

  onSubmit() {
    this.validate = true; // Activer la validation globale lors de la soumission
    if (this.cheeseForm.valid) {
      console.log('Données du fromage:', this.cheeseForm.value);
      alert('Formulaire soumis avec succès !');
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  // Getter pour faciliter l'accès aux contrôles dans le template
  get datePrelevement() {
    return this.cheeseForm.get('datePrelevement');
  }

  get numeroEchantillon() {
    return this.cheeseForm.get('numeroEchantillon');
  }

  get identifiantProducteur() {
    return this.cheeseForm.get('identifiantProducteur');
  }

  get typicite() {
    return this.cheeseForm.get('typicite');
  }

  get categorie() {
    return this.cheeseForm.get('categorie');
  }

  get raceDominante() {
    return this.cheeseForm.get('raceDominante');
  }

  get nbBrebis() {
    return this.cheeseForm.get('nbBrebis');
  }

  get productivite() {
    return this.cheeseForm.get('productivite');
  }

  get periodeAgnelage() {
    return this.cheeseForm.get('periodeAgnelage');
  }

  get estive() {
    return this.cheeseForm.get('estive');
  }

  get paturage() {
    return this.cheeseForm.get('paturage');
  }

  get laitCru() {
    return this.cheeseForm.get('laitCru');
  }

  get dateFabrication() {
    return this.cheeseForm.get('dateFabrication');
  }

  get nombreTraites() {
    return this.cheeseForm.get('nombreTraites');
  }

  get temperatureEmpressurage() {
    return this.cheeseForm.get('temperatureEmpressurage');
  }

  get quantitePresure() {
    return this.cheeseForm.get('quantitePresure');
  }

  get typeFerments() {
    return this.cheeseForm.get('typeFerments');
  }

  get dureeCoagulation() {
    return this.cheeseForm.get('dureeCoagulation');
  }

  get temperatureCaillage() {
    return this.cheeseForm.get('temperatureCaillage');
  }

  get salage() {
    return this.cheeseForm.get('salage');
  }

  get reportVide() {
    return this.cheeseForm.get('reportVide');
  }

  get dateMiseVide() {
    return this.cheeseForm.get('dateMiseVide');
  }

  get dateSortieVide() {
    return this.cheeseForm.get('dateSortieVide');
  }

  get dureeAffinage() {
    return this.cheeseForm.get('dureeAffinage');
  }

  get preAffinage(){
    return this.cheeseForm.get('preAffinage');
  }

  get brossageManuel(){
    return this.cheeseForm.get('brossageManuel');
  }

  get tempPreAffinage() {
    return this.cheeseForm.get('tempPreAffinage');
  }

  get tempAffinage() {
    return this.cheeseForm.get('tempAffinage');
  }

  get humidificationCave() {
    return this.cheeseForm.get('humidificationCave');
  }


}
