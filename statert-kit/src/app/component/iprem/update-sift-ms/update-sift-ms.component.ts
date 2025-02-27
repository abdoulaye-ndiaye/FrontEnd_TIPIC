import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FromageService } from '../../../services/fromage.service';
import { SiftMsService } from '../../../services/sift-ms.service';
import { Location } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-sift-ms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-sift-ms.component.html',
  styleUrl: './update-sift-ms.component.scss'
})
export class UpdateSiftMsComponent implements OnInit {
  siftMsForm: FormGroup;
  validate = false;
  fileSelected: File | null;
  nom: string;
  id_echantillon: string;
  fromage: any;
  siftMs: any;
  decodedToken: any;
  roleUtilisateur: any;
  siftMsList: any;
  initialReplicatCount: number = 0; // Stocker le nombre initial de réplicats
  firstReplicat: any;
  // Ajoutez cette propriété à la classe
  lastReplicatNumber: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private siftMsService: SiftMsService,
    private route: ActivatedRoute,
    private router: Router,
    private fromageService: FromageService,
    private location: Location
  ) { }
  
  // Ajoutez ces propriétés à votre classe de composant
  fileSelectedMap: { [key: number]: { [type: string]: File } } = {};
  replicats: number[] = [];

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
        this.fromage = data;
      });

    // Initialiser le formulaire principal
    this.initForm();

    // Charger tous les SiftMS associés à cet échantillon
    this.siftMsService.getByIdEchantilon(this.id_echantillon).subscribe(
      data => {
        this.siftMsList = data;
        
        if (this.siftMsList && this.siftMsList.length > 0) {
          // Définir le nombre initial de réplicats
          this.initialReplicatCount = this.siftMsList.length;
          
          // Mettre à jour le nombre de réplicats dans le formulaire
          this.siftMsForm.patchValue({
            nombreReplicats: this.initialReplicatCount
          });
          
          // Charger les données des réplicats existants
          this.loadExistingReplicats();
        } else {
          // Si aucun réplicat existant, initialiser avec un réplicat par défaut
          this.onReplicatsChange();
        }
      },
      error => {
        console.error('Erreur lors du chargement des données SiftMS:', error);
        // Initialiser avec un réplicat par défaut en cas d'erreur
        this.onReplicatsChange();
      }
    );
  }

  initForm(): void {
    // Créer le formulaire principal avec seulement le nombre de réplicats
    this.siftMsForm = this.formBuilder.group({
      nombreReplicats: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    // Initialiser l'array des réplicats
    this.replicats = [];
  }

  // Nouvelle méthode pour charger les données des réplicats existants
  loadExistingReplicats(): void {
    // Réinitialiser les réplicats
    this.replicats = [];
    
    // Pour chaque réplicat existant dans la liste
    for (let i = 0; i < this.siftMsList.length; i++) {
      const replicat = this.siftMsList[i];

      // Mettre à jour le dernier numéro de réplicat
      if (replicat.replicatNumber > this.lastReplicatNumber) {
        this.lastReplicatNumber = replicat.replicatNumber;
      }
      
      // Ajouter l'index du réplicat à l'array
      this.replicats.push(i);
      
      // Ajouter les contrôles au formulaire pour ce réplicat
      this.siftMsForm.addControl('blanc_positif_' + i, this.formBuilder.control(replicat.blanc_positif || ''));
      this.siftMsForm.addControl('blanc_negatif_' + i, this.formBuilder.control(replicat.blanc_negatif || ''));
      this.siftMsForm.addControl('echantillon_positif_' + i, this.formBuilder.control(replicat.echantillon_positif, Validators.required));
      this.siftMsForm.addControl('echantillon_negatif_' + i, this.formBuilder.control(replicat.echantillon_negatif, Validators.required));
      
      // Initialiser une entrée dans la map pour ce réplicat (pour les fichiers)
      this.fileSelectedMap[i] = {};
    }
  }

  onReplicatsChange(): void {
    const nombreReplicats = (this.siftMsForm.get('nombreReplicats')?.value) || 1;
    
    // Vérifier que le nouveau nombre de réplicats n'est pas inférieur au nombre initial
    if (nombreReplicats < this.initialReplicatCount) {
      // Restaurer l'ancienne valeur
      this.siftMsForm.patchValue({
        nombreReplicats: this.initialReplicatCount
      });
      
      // Afficher un message d'erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Vous ne pouvez pas réduire le nombre de réplicats en dessous de ${this.initialReplicatCount}.`,
        confirmButtonColor: 'var(--theme-default)',
      });
      
      return;
    }
    
    // Ajouter uniquement les nouveaux réplicats
    for (let i = this.replicats.length; i < nombreReplicats; i++) {
      this.replicats.push(i);
      
      // Incrémenter le numéro de réplicat pour les nouveaux réplicats
      const newReplicatNumber = this.lastReplicatNumber + (i - this.initialReplicatCount + 1);
      
      // Générer des valeurs de démonstration pour le mockup
      const startId = 10956 + (newReplicatNumber * 4);
      
      // Ajouter les contrôles pour ce nouveau réplicat
      this.siftMsForm.addControl('blanc_positif_' + i, this.formBuilder.control(startId));
      this.siftMsForm.addControl('blanc_negatif_' + i, this.formBuilder.control(startId + 1));
      this.siftMsForm.addControl('echantillon_positif_' + i, this.formBuilder.control(startId + 2, Validators.required));
      this.siftMsForm.addControl('echantillon_negatif_' + i, this.formBuilder.control(startId + 3, Validators.required));
      
      // Initialiser une entrée dans la map pour ce réplicat
      this.fileSelectedMap[i] = {};
    }
  }

  /**
   * Vérifie si un fichier a été chargé pour un réplicat et un type spécifique
   */
  hasFile(replicatIndex: number, fileType: string): boolean {
    return !!(this.fileSelectedMap[replicatIndex] && this.fileSelectedMap[replicatIndex][fileType]);
  }

  /**
   * Vérifie si un réplicat existant possède déjà un fichier dans la base de données
   */
  hasExistingFile(replicatIndex: number, fileType: string): boolean {
    if (replicatIndex >= 0 && replicatIndex < this.siftMsList.length) {
      const replicat = this.siftMsList[replicatIndex];
      return !!replicat[`fichier_${fileType}`]; // Vérifie si la propriété fichier_X existe
    }
    return false;
  }

  /**
   * Vérifie si tous les fichiers requis ont été chargés pour tous les réplicats
   */
  allFilesUploaded(): boolean {
    const fileTypes = ['echantillon_positif', 'echantillon_negatif'];

    // Vérifier chaque réplicat
    for (let i = 0; i < this.replicats.length; i++) {
      // Vérifier si tous les types de fichiers sont présents pour ce réplicat
      for (const fileType of fileTypes) {
        // Si c'est un réplicat existant qui a déjà un fichier, on considère que c'est OK
        if (i < this.initialReplicatCount && this.hasExistingFile(i, fileType)) {
          continue;
        }
        
        // Sinon, vérifier si un nouveau fichier a été chargé
        if (!this.hasFile(i, fileType)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Vérifie si le formulaire est valide (tous les champs requis + tous les fichiers)
   */
  isFormValid(): boolean {
    return this.siftMsForm.valid && this.allFilesUploaded();
  }

  onFileChange(event: any, replicatIndex: number, fileType: string) {
    if (event.target.files[0]) {
      const selectedFile = event.target.files[0] as File;

      // Vérification du type de fichier
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'text/xml' // .xml
      ];

      // Si le fichier n'est pas dans les types autorisés
      if (!allowedTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Veuillez télécharger un fichier au format CSV ou Excel ou XML.',
          confirmButtonColor: 'var(--theme-default)',
        });
        // Réinitialiser l'input file
        event.target.value = '';

        // Supprimer le fichier s'il était déjà stocké
        if (this.fileSelectedMap[replicatIndex] && this.fileSelectedMap[replicatIndex][fileType]) {
          delete this.fileSelectedMap[replicatIndex][fileType];
        }
        return;
      }

      // Initialiser l'objet pour ce réplicat s'il n'existe pas encore
      if (!this.fileSelectedMap[replicatIndex]) {
        this.fileSelectedMap[replicatIndex] = {};
      }

      // Stocker le fichier
      this.fileSelectedMap[replicatIndex][fileType] = selectedFile;
    } else {
      // Si l'utilisateur annule la sélection, supprimer le fichier
      if (this.fileSelectedMap[replicatIndex] && this.fileSelectedMap[replicatIndex][fileType]) {
        delete this.fileSelectedMap[replicatIndex][fileType];
      }
    }
  }

  hasChanges(): boolean {
    // Vérifier si des nouveaux réplicats ont été ajoutés
    if (this.siftMsForm.get('nombreReplicats')?.value > this.initialReplicatCount) {
      return true;
    }
    
    // Vérifier si des fichiers ont été sélectionnés pour les réplicats existants
    for (let i = 0; i < this.initialReplicatCount; i++) {
      if (this.fileSelectedMap[i] && Object.keys(this.fileSelectedMap[i]).length > 0) {
        return true;
      }
      
      // Vérifier si les valeurs ont été modifiées pour les réplicats existants
      const replicat = this.siftMsList[i];
      const formValues = this.siftMsForm.value;
      
      if (formValues[`blanc_positif_${i}`] !== replicat.blanc_positif ||
          formValues[`blanc_negatif_${i}`] !== replicat.blanc_negatif ||
          formValues[`echantillon_positif_${i}`] !== replicat.echantillon_positif ||
          formValues[`echantillon_negatif_${i}`] !== replicat.echantillon_negatif) {
        return true;
      }
    }
    
    // Aucune modification détectée
    return false;
  }

  onSubmit() {
    this.validate = true;

    // Vérifier si tous les fichiers d'échantillon obligatoires sont chargés
    if (!this.allRequiredFilesUploaded()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez télécharger tous les fichiers d\'échantillon requis pour chaque réplicat.',
        confirmButtonColor: 'var(--theme-default)',
      });
      return;
    }

    // Vérifier si le formulaire est valide
    if (this.siftMsForm.valid) {
      // Vérifier que le nombre de réplicats correspond au nombre attendu
      const nombreReplicatsAttendu = this.siftMsForm.get('nombreReplicats')?.value || 1;

      if (this.replicats.length !== nombreReplicatsAttendu) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Le nombre de réplicats (${this.replicats.length}) ne correspond pas au nombre attendu (${nombreReplicatsAttendu}).`,
          confirmButtonColor: 'var(--theme-default)',
        });
        return;
      }

      const formValues = this.siftMsForm.value;

      // Créer deux tableaux pour stocker les promesses d'upload et de mise à jour
      const uploadPromises = [];
      const updatePromises = [];
      
      // Traitement des réplicats existants (mise à jour des valeurs)
      for (let i = 0; i < this.lastReplicatNumber; i++) {
        // rechercher le réplicat s'il existe
        const replicatExisting = this.siftMsList.find((r: { replicatNumber: number; }) => r.replicatNumber === i);
        if (!replicatExisting) {
          console.error(`Réplicat ${i} introuvable dans la liste existante.`);
          continue;
        }
        const replicat = this.siftMsList[i];
        console.log('replicat', replicat);
        // Mettre à jour les valeurs des champs texte
        const updateData = {
          id: replicat._id,
          blanc_positif: formValues['blanc_positif_' + i] || '',
          blanc_negatif: formValues['blanc_negatif_' + i] || '',
          echantillon_positif: formValues['echantillon_positif_' + i],
          echantillon_negatif: formValues['echantillon_negatif_' + i],
          echantillonId: this.id_echantillon,
          replicatNumber: i
        };
        
        // Si de nouveaux fichiers ont été sélectionnés pour ce réplicat
        const files = this.fileSelectedMap[i] || {};
        
        // Créer un FormData pour l'upload des fichiers
        if (Object.keys(files).length > 0) {
          const formData = new FormData();
          
          // Ajouter l'ID du réplicat pour la mise à jour
          formData.append("id", replicat._id);
          
          // Ajouter les métadonnées
          formData.append("blanc_positif", updateData.blanc_positif);
          formData.append("blanc_negatif", updateData.blanc_negatif);
          formData.append("echantillon_positif", updateData.echantillon_positif);
          formData.append("echantillon_negatif", updateData.echantillon_negatif);
          formData.append("echantillonId", this.id_echantillon);
          formData.append("replicatNumber", i.toString());
          
          // récupérer la date now en format string
          const date = new Date().toISOString().replace('T', '-').split('.')[0];
          
          // Ajouter uniquement les fichiers qui ont été sélectionnés
          if (files['echantillon_positif']) {
            formData.append("fichier_echantillon_positif", files['echantillon_positif'], 
              'echantillon_positif' + '-' + updateData.echantillon_positif + '-' + date + '.xml');
          }
          
          if (files['echantillon_negatif']) {
            formData.append("fichier_echantillon_negatif", files['echantillon_negatif'], 
              'echantillon_negatif' + '-' + updateData.echantillon_negatif + '-' + date + '.xml');
          }
          
          if (files['blanc_positif']) {
            formData.append("fichier_blanc_positif", files['blanc_positif'], 
              'blanc_positif' + '-' + updateData.blanc_positif + '-' + date + '.xml');
          }
          
          if (files['blanc_negatif']) {
            formData.append("fichier_blanc_negatif", files['blanc_negatif'], 
              'blanc_negatif' + '-' + updateData.blanc_negatif + '-' + date + '.xml');
          }
          
          // Ajouter la promesse de mise à jour avec fichiers
          updatePromises.push(
            this.siftMsService.updateWithFiles(formData).toPromise()
              .catch((error: { message: any; }) => {
                console.error(`Erreur lors de la mise à jour du réplicat ${i}:`, error);
                return { error: true, replicatNumber: i, message: error.message || "Erreur inconnue" };
              })
          );
        } else {
          // Mise à jour sans fichiers (juste les métadonnées)
          updatePromises.push(
            this.siftMsService.update(updateData).toPromise()
              .catch((error: { message: any; }) => {
                console.error(`Erreur lors de la mise à jour du réplicat ${i}:`, error);
                return { error: true, replicatNumber: i, message: error.message || "Erreur inconnue" };
              })
          );
        }
      }
      
      // Traitement des nouveaux réplicats
      for (let i = this.initialReplicatCount; i < nombreReplicatsAttendu; i++) {
        // Calculer le numéro de réplicat pour ce nouvel index
        const replicatNumber = this.lastReplicatNumber + (i - this.initialReplicatCount + 1);
        // Vérifier si nous avons des données et des fichiers pour ce réplicat
        if (!formValues['echantillon_positif_' + i] || !formValues['echantillon_negatif_' + i]) {
          console.log(`Pas de données formulaire pour le réplicat ${i}, passage au suivant`);
          continue;
        }
        
        const files = this.fileSelectedMap[i] || {};
        if (!files['echantillon_positif'] || !files['echantillon_negatif']) {
          console.log(`Fichiers manquants pour le réplicat ${i}, passage au suivant`);
          continue;
        }
        
        // Créer un FormData pour l'upload
        const formData = new FormData();
        
        // Ajouter les métadonnées
        if (formValues['blanc_positif_' + i]) {
          formData.append("blanc_positif", formValues['blanc_positif_' + i]);
        }
        
        if (formValues['blanc_negatif_' + i]) {
          formData.append("blanc_negatif", formValues['blanc_negatif_' + i]);
        }
        
        // Les métadonnées d'échantillon sont toujours requises
        formData.append("echantillon_positif", formValues['echantillon_positif_' + i]);
        formData.append("echantillon_negatif", formValues['echantillon_negatif_' + i]);
        
        // Ajouter l'ID d'échantillon et le numéro de réplicat
        formData.append("echantillonId", this.id_echantillon);
        formData.append("replicatNumber", replicatNumber.toString());
        
        // récupérer la date now en format string
        const date = new Date().toISOString().replace('T', '-').split('.')[0];
        
        // Ajouter les fichiers d'échantillon (obligatoires)
        formData.append("fichier_echantillon_positif", files['echantillon_positif'], 
          'echantillon_positif' + '-' + formValues['echantillon_positif_' + i] + '-' + date + '.xml');
        formData.append("fichier_echantillon_negatif", files['echantillon_negatif'], 
          'echantillon_negatif' + '-' + formValues['echantillon_negatif_' + i] + '-' + date + '.xml');
        
        // Ajouter les fichiers blancs (optionnels) uniquement s'ils existent
        if (files['blanc_positif']) {
          formData.append("fichier_blanc_positif", files['blanc_positif'], 
            'blanc_positif' + '-' + formValues['blanc_positif_' + i] + '-' + date + '.xml');
        }
        
        if (files['blanc_negatif']) {
          formData.append("fichier_blanc_negatif", files['blanc_negatif'], 
            'blanc_negatif' + '-' + formValues['blanc_negatif_' + i] + '-' + date + '.xml');
        }
        
        // Ajouter la promesse d'upload à notre tableau
        uploadPromises.push(
          this.siftMsService.uploadNew(formData).toPromise()
            .catch(error => {
              console.error(`Erreur lors de l'upload du réplicat ${i}:`, error);
              return { error: true, replicatNumber: i, message: error.message || "Erreur inconnue" };
            })
        );
      }
      
      // Combiner toutes les promesses
      const allPromises = [...updatePromises, ...uploadPromises];
      
      // Vérifier si des opérations sont à effectuer
      if (allPromises.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'Aucune modification à effectuer.',
          confirmButtonColor: 'var(--theme-default)',
        });
        return;
      }
      
      // Afficher un indicateur de chargement
      Swal.fire({
        title: 'Chargement...',
        text: 'Mise à jour et upload des fichiers SIFT-MS en cours',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Utiliser Promise.all pour attendre que toutes les opérations soient terminées
      Promise.all(allPromises)
        .then(responses => {
          // Vérifier si des erreurs se sont produites
          const erreurs = responses.filter((res: { error: boolean; }) => res && res.error === true);
          
          if (erreurs.length > 0) {
            // Des erreurs se sont produites pour certains réplicats
            const replicatsErreur = erreurs.map((err: { replicatNumber: any; }) => err.replicatNumber).join(', ');
            Swal.fire({
              icon: 'warning',
              title: 'Attention',
              text: `${allPromises.length - erreurs.length} réplicat(s) traité(s) avec succès, mais des erreurs sont survenues pour les réplicats: ${replicatsErreur}`,
            }).then(() => {
              window.location.reload();
            });
          } else {
            // Toutes les opérations ont réussi
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: `${updatePromises.length} réplicat(s) mis à jour et ${uploadPromises.length} nouveau(x) réplicat(s) ajouté(s) avec succès.`,
            }).then(() => {
              window.location.reload();
            });
          }
        })
        .catch(error => {
          console.error("Erreur détaillée:", error);
          let errorMessage = "Erreur lors de la mise à jour/ajout des réplicats SIFT-MS.";
          
          // Tenter d'extraire un message d'erreur plus précis si disponible
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir correctement tous les champs requis.',
        confirmButtonColor: 'var(--theme-default)',
      });
    }
  }

  // Méthode pour vérifier seulement les fichiers obligatoires
  allRequiredFilesUploaded() {
    // Pour chaque réplicat, vérifier si les fichiers d'échantillon (obligatoires) sont présents
    for (let i = 0; i < this.replicats.length; i++) {
      // Si c'est un réplicat existant qui a déjà des fichiers, on ignore la vérification
      if (i < this.initialReplicatCount) {
        if (this.hasExistingFile(i, 'echantillon_positif') && this.hasExistingFile(i, 'echantillon_negatif')) {
          continue;
        }
      }
      
      const files = this.fileSelectedMap[i] || {};
      
      // Vérifier si les fichiers d'échantillon sont présents
      if (!files['echantillon_positif'] || !files['echantillon_negatif']) {
        return false;
      }
    }
    return true;
  }

  reset() {
    this.validate = false;
    
    // Ne pas supprimer complètement fileSelectedMap, mais seulement les fichiers ajoutés
    // pour les nouveaux réplicats ou les fichiers modifiés pour les réplicats existants
    const newFileSelectedMap = {};
    
    // Récupérer les valeurs actuelles du formulaire
    const currentValues = this.siftMsForm.value;
    
    // Réinitialiser le formulaire sans effacer complètement
    this.siftMsForm.reset();
    
    // Remettre le nombre de réplicats
    this.siftMsForm.patchValue({
      nombreReplicats: this.initialReplicatCount || 1
    });
    
    // Si des réplicats existants sont présents
    if (this.initialReplicatCount > 0) {
      // Pour chaque réplicat existant, restaurer les valeurs d'origine de la base de données
      for (let i = 0; i < this.initialReplicatCount; i++) {
        const replicat = this.siftMsList[i];
        
        // Restaurer les valeurs d'origine pour ce réplicat
        this.siftMsForm.patchValue({
          [`blanc_positif_${i}`]: replicat.blanc_positif || '',
          [`blanc_negatif_${i}`]: replicat.blanc_negatif || '',
          [`echantillon_positif_${i}`]: replicat.echantillon_positif,
          [`echantillon_negatif_${i}`]: replicat.echantillon_negatif
        });
      }
      
      // Supprimer les contrôles pour les réplicats ajoutés au-delà de initialReplicatCount
      for (let i = this.initialReplicatCount; i < this.replicats.length; i++) {
        this.siftMsForm.removeControl(`blanc_positif_${i}`);
        this.siftMsForm.removeControl(`blanc_negatif_${i}`);
        this.siftMsForm.removeControl(`echantillon_positif_${i}`);
        this.siftMsForm.removeControl(`echantillon_negatif_${i}`);
      }
      
      // Réinitialiser le tableau des réplicats à afficher
      this.replicats = Array.from({ length: this.initialReplicatCount }, (_, i) => i);
    } else {
      // Si aucun réplicat existant, générer un réplicat par défaut
      this.onReplicatsChange();
    }
    
    // Réinitialiser tous les éléments input file
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
    
    // Mettre à jour l'affichage pour refléter les données d'origine
    this.fileSelectedMap = {};
  }

  telecharger(id: string, fileType: string) {
    this.siftMsService.downloadSiftMs(id, fileType);
  }

  delete(id: string) {
    // Vérifier que ce n'est pas le dernier réplicat
    if (this.siftMsList.length <= 1) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Vous ne pouvez pas supprimer le dernier réplicat.',
        confirmButtonColor: 'var(--theme-default)',
      });
      return;
    }
    
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

  goBack() {
    this.location.back();
  }

  // Getters
  get nombreReplicats() {
    return this.siftMsForm.get('nombreReplicats');
  }
}
