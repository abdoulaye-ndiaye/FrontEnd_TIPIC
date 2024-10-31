import { CommonModule } from '@angular/common';
import { ApplicationModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulaire-identite',
  standalone: true,
  imports: [CommonModule, ApplicationModule, FormsModule],
  templateUrl: './formulaire-identite.component.html',
  styleUrls: ['./formulaire-identite.component.scss']
})
export class FormulaireIdentiteComponent {
  currentStep: number = 0;

  // Définition de l'objet user avec les champs adaptés aux étapes
  cheese = {
    // Identifiants
    datePrelevement: '',
    numeroEchantillon: '',
    identifiantProducteur: '',
    typicite: '',
    
    // Production
    categorie: '',
    raceDominante: '',
    nbBrebis: null,
    productivite: null,
    periodeAgnelage: '',
    estive: null,
    paturage: '',
    laitCru: null,

    // Fabrication
    dateFabrication: '',
    nombreTraites: null,
    temperatureEmpressurage: null,
    quantitePresure: null,
    typeFerments: '',
    dureeCoagulation: null,
    temperatureCaillage: null,
    salage: '',
    reportVide: '',
    dateMiseVide: '',
    dateSortieVide: '',
    
    // Affinage
    preAffinage: false,
    dureeAffinage: null,
    temperatureAffinage: null,
    brossageManuel: false,
    tempPreAffinage: null,
    tempAffinage: null,
    humidificationCave: '',
    dureeHumidification: null,
    temperatureHumidification: null
  };

  // Méthodes pour gérer la navigation entre étapes
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

  showPreAffinageFields() {
    if (!this.cheese.preAffinage) {
      this.cheese.dureeAffinage = null;
      this.cheese.tempAffinage = null;
    }
  }


  onSubmit() {
    // Traitement lors de la soumission finale
    console.log('Données du fromage:', this.cheese);
    alert('Formulaire soumis avec succès !');
  }
}
