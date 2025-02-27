import { CommonModule, Location } from "@angular/common";
import { Component, OnInit, ɵisEnvironmentProviders } from "@angular/core";
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
import { jwtDecode } from "jwt-decode";
import { DropzoneEvents } from "ngx-dropzone-wrapper/lib/dropzone.interfaces";

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
    fileSelected: File | null;
    nom: string;
    id_echantillon: string;
    fromage: any;
    siftMs: any;
    decodedToken: any;
    roleUtilisateur: any;
    siftMsList: any;

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

        // this.siftMsService
        //     .getByIdEchantilon(this.id_echantillon)
        //     .subscribe((data) => {
        //         this.siftMs = data[0];
        //     });
        // Charger tous les SiftMS associés à cet échantillon
        this.siftMsService.getByIdEchantilon(this.id_echantillon).subscribe(
            data => {
            this.siftMsList = data;
            this.siftMs = this.siftMsList[0];
            },
            error => {
            console.error('Erreur lors du chargement des données SiftMS:', error);
            }
        );

        // Initialiser le formulaire principal avec le nombre de réplicats
        this.initForm();
    }

    initForm(): void {
        // Créer le formulaire principal avec seulement le nombre de réplicats
        this.siftMsForm = this.formBuilder.group({
            nombreReplicats: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
        });

        // Initialiser l'array des réplicats
        this.replicats = [];

        // Initialiser avec un réplicat par défaut
        this.onReplicatsChange();
    }

    onReplicatsChange(): void {
        const nombreReplicats = (this.siftMsForm.get('nombreReplicats')?.value) || 1;

        // Supprimer tous les champs de réplicats existants
        for (let i = 0; i < this.replicats.length; i++) {
            this.siftMsForm.removeControl('blanc_positif_' + i);
            this.siftMsForm.removeControl('blanc_negatif_' + i);
            this.siftMsForm.removeControl('echantillon_positif_' + i);
            this.siftMsForm.removeControl('echantillon_negatif_' + i);
        }

        // Réinitialiser l'array des réplicats
        this.replicats = [];

        // Réinitialiser la map des fichiers
        this.fileSelectedMap = {};

        // Créer les contrôles pour chaque réplicat
        for (let i = 0; i < nombreReplicats; i++) {
            this.replicats.push(i);

            // Générer des valeurs de démonstration pour le mockup (à remplacer par vos valeurs réelles)
            const startId = 10956 + (i * 4);

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
     * Vérifie si tous les fichiers requis ont été chargés pour tous les réplicats
     */
    allFilesUploaded(): boolean {
        const fileTypes = ['echantillon_positif', 'echantillon_negatif'];

        // Vérifier chaque réplicat
        for (let i = 0; i < this.replicats.length; i++) {
            // Vérifier si tous les types de fichiers sont présents pour ce réplicat
            for (const fileType of fileTypes) {
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
                    text: 'Veuillez télécharger un fichier au format CSV ou Excel.',
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
                // Réinitialiser les réplicats pour qu'ils correspondent
                this.onReplicatsChange();
                return;
            }
    
            const formValues = this.siftMsForm.value;
    
            // Créer un tableau pour stocker toutes les promesses d'upload
            const uploadPromises = [];
    
            // Pour chaque réplicat, créer et envoyer un FormData
            for (let i = 0; i < nombreReplicatsAttendu; i++) {
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
                formData.append("replicatNumber", i.toString());
    
                // Récupérer les fichiers pour ce réplicat
                const files = this.fileSelectedMap[i];

                // recuperer la date now en format string ex : 20190718-17:18:35
                const date = new Date().toISOString().replace('T', '-').split('.')[0];
                
                // Ajouter les fichiers d'échantillon (obligatoires)
                formData.append("fichier_echantillon_positif", files['echantillon_positif'], 'echantillon_positif'+'-'+ formValues['echantillon_positif_' + i]+'-'+date+'.xml');
                formData.append("fichier_echantillon_negatif", files['echantillon_negatif'], 'echantillon_negatif'+'-'+ formValues['echantillon_negatif_' + i]+'-'+date+'.xml');
                
                // Ajouter les fichiers blancs (optionnels) uniquement s'ils existent
                if (files['blanc_positif']) {
                    formData.append("fichier_blanc_positif", files['blanc_positif'], 'blanc_positif'+'-'+ formValues['blanc_positif_' + i]+'-'+date+'.xml');
                }
                
                if (files['blanc_negatif']) {
                    formData.append("fichier_blanc_negatif", files['blanc_negatif'], 'blanc_negatif'+'-'+ formValues['blanc_negatif_' + i]+'-'+date+'.xml');
                }
    
                // Log pour débogage
                console.log(`Envoi des données pour le réplicat ${i}:`);
                for (const pair of (formData as any).entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
    
                // Ajouter la promesse d'upload à notre tableau
                uploadPromises.push(this.siftMsService.upload(formData).toPromise());
            }
    
            // Afficher un indicateur de chargement
            Swal.fire({
                title: 'Chargement...',
                text: 'Upload des fichiers SIFT-MS en cours',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            // Utiliser Promise.all pour attendre que tous les uploads soient terminés
            Promise.all(uploadPromises)
                .then(responses => {
                    Swal.fire({
                        icon: "success",
                        title: "Succès",
                        text: `${nombreReplicatsAttendu} réplicat${nombreReplicatsAttendu > 1 ? 's' : ''} SIFT-MS ajouté${nombreReplicatsAttendu > 1 ? 's' : ''} avec succès.`,
                    }).then(() => {
                        window.location.reload();
                    });
                })
                .catch(error => {
                    console.error("Erreur détaillée:", error);
                    let errorMessage = "Erreur lors de l'ajout des réplicats SIFT-MS.";
                    
                    // Tenter d'extraire un message d'erreur plus précis si disponible
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                    }
                    
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
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
    
    // Nouvelle méthode pour vérifier seulement les fichiers obligatoires
    allRequiredFilesUploaded() {
        // Pour chaque réplicat, vérifier si les fichiers d'échantillon (obligatoires) sont présents
        for (let i = 0; i < this.replicats.length; i++) {
            const files = this.fileSelectedMap[i] || {};
            console.log(files);
            
            // Vérifier si les fichiers d'échantillon sont présents
            if (!files['echantillon_positif'] || !files['echantillon_negatif']) {
                return false;
            }
        }
        return true;
    }

    reset() {
        this.validate = false;
        this.fileSelectedMap = {};

        // Réinitialiser le formulaire
        this.siftMsForm.reset();
        this.siftMsForm.patchValue({
            nombreReplicats: 1
        });

        // Régénérer les champs pour un seul réplicat
        this.onReplicatsChange();

        // Réinitialiser tous les éléments input file
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
            const htmlInput = input as HTMLInputElement;
            (input as HTMLInputElement).value = '';
        });
    }

    telecharger(id: string, fileType: string) {
        this.siftMsService.downloadSiftMs(id, fileType);
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

    goBack() {
        this.location.back();
    }

    update(id: string) {
        this.router.navigate(["/iprem/update-sift-ms"], {
            queryParams: { id: id },
        });
    }
    // Getters
    get nombreReplicats() {
        return this.siftMsForm.get('nombreReplicats');
    }

    get blanc_positif() {
        return this.siftMsForm.get("blanc_positif_0");
    }

    get blanc_negatif() {
        return this.siftMsForm.get("blanc_negatif_0");
    }

    get fromage_positif() {
        return this.siftMsForm.get("echantillon_positif_0");
    }

    get fromage_negatif() {
        return this.siftMsForm.get("echantillon_negatif_0");
    }
}