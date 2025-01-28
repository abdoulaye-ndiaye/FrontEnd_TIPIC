import { CommonModule, Location } from "@angular/common";
import Swal from "sweetalert2";
import { UtilisateurService } from "../../../services/utilisateur.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: "app-profil",
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./profil.component.html",
    styleUrl: "./profil.component.scss",
})
export class ProfilComponent implements OnInit {
    profileForm: FormGroup;
    validate = false; // Pour déclencher la validation après soumission
    isProducer: boolean = false;
    id_utilisateur: string;
    utilisateur: any;
    decodedToken: any;
    prenomUtilisateur: any;
    nomUtilisateur: any;
    roleUtilisateur: any;

    constructor(
        private formBuilder: FormBuilder,
        private utilisateurService: UtilisateurService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.profileForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            nom: ["", Validators.required],
            prenom: ["", Validators.required],
            role: ["", Validators.required],
            codeProducteur: [""],
        });
    }

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        console.log(this.decodedToken);
        this.nomUtilisateur = this.decodedToken.user.nom;
        this.prenomUtilisateur = this.decodedToken.user.prenom;
        this.id_utilisateur = this.decodedToken.user._id;
        this.roleUtilisateur = this.decodedToken.user.role;

        // Écoute les changements de la sélection du rôle pour afficher le champ 'codeProducteur'
        this.profileForm.get("role")?.valueChanges.subscribe((role) => {
            this.isProducer = role === "PRODUCTEUR";
            if (this.isProducer) {
                this.profileForm
                    .get("codeProducteur")
                    ?.setValidators(Validators.required);
            } else {
                this.profileForm.get("codeProducteur")?.clearValidators();
            }
            this.profileForm.get("codeProducteur")?.updateValueAndValidity();
        });

        this.utilisateurService
            .getById(this.id_utilisateur)
            .subscribe((data: any) => {
                this.utilisateur = data;
                this.profileForm.patchValue({
                    email: data.email,
                    nom: data.nom,
                    prenom: data.prenom,
                    role: data.role,
                    codeProducteur: data.codeProducteur,
                });
            });
    }

    onSubmit() {
        this.validate = true;
        if (this.profileForm.valid) {
            if (this.role!.value === "PRODUCTEUR") {
                this.utilisateurService
                    .updateProducteur(
                        this.id_utilisateur,
                        this.email!.value,
                        this.password!.value,
                        this.nom!.value,
                        this.prenom!.value,
                        this.role!.value,
                        this.codeProducteur!.value
                    )
                    .subscribe({
                        next: (data) => {
                            Swal.fire({
                                icon: "success",
                                title: "Mise à jour réussie",
                                text: "L'utilisateur producteur a été mis à jour avec succès!",
                                confirmButtonColor: "var(--theme-default)",
                            }).then(() => {
                                this.authService
                                    .login(
                                        this.email!.value,
                                        this.password!.value
                                    )
                                    .subscribe({
                                        next: (data) => {
                                            localStorage.setItem(
                                                "token",
                                                data.token
                                            );
                                            this.router
                                                .navigate([
                                                    "/producteur/dashboard-producteur",
                                                ])
                                                .then(() => {
                                                    window.location.reload();
                                                });
                                        },
                                        error: (err) => {
                                            console.error(err);
                                        },
                                    });
                            });
                            //console.log(data);
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Erreur",
                                text: "Une erreur s'est produite lors de la mise à jour.",
                                confirmButtonColor: "var(--theme-default)",
                            });
                            console.error(err);
                        },
                    });
            } else {
                this.utilisateurService
                    .update(
                        this.id_utilisateur,
                        this.email!.value,
                        this.password!.value,
                        this.nom!.value,
                        this.prenom!.value,
                        this.role!.value
                    )
                    .subscribe({
                        next: (data) => {
                            Swal.fire({
                                icon: "success",
                                title: "Mise à jour réussie",
                                text: "L'utilisateur a été mis à jour avec succès!",
                                confirmButtonColor: "var(--theme-default)",
                            }).then(() => {
                                localStorage.removeItem("token");
                                this.router.navigate(["/auth/login"]);
                            });
                            console.log(data);
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Erreur",
                                text: "Une erreur s'est produite lors de la mise à jour.",
                                confirmButtonColor: "var(--theme-default)",
                            });
                            console.error(err);
                        },
                    });
            }
        } else {
            Swal.fire({
                icon: "warning",
                title: "Formulaire invalide",
                text: "Veuillez vérifier les champs et réessayer.",
                confirmButtonColor: "var(--theme-default)",
            });
            console.log("Form is invalid");
        }
    }

    // Getter pour faciliter l'accès aux contrôles dans le template
    get email() {
        return this.profileForm.get("email");
    }
    get password() {
        return this.profileForm.get("password");
    }
    get nom() {
        return this.profileForm.get("nom");
    }
    get prenom() {
        return this.profileForm.get("prenom");
    }
    get role() {
        return this.profileForm.get("role");
    }
    get codeProducteur() {
        return this.profileForm.get("codeProducteur");
    }
}
