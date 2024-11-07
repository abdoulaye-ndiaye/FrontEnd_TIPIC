import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import Swal from 'sweetalert2';

@Component({
    selector: "app-register",
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
    registerForm: FormGroup;
    validate = false; // Pour déclencher la validation après soumission
    isProducer: boolean = false; // Variable pour vérifier le rôle

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registerForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            nom: ["", Validators.required],
            prenom: ["", Validators.required],
            role: ["", Validators.required],
            codeProducteur: [""],
        });

        // Surveiller les changements du rôle
        this.registerForm.get("role")?.valueChanges.subscribe((role) => {
            this.isProducer = role === "PRODUCTEUR";
            if (this.isProducer) {
                this.registerForm
                    .get("codeProducteur")
                    ?.setValidators(Validators.required);
            } else {
                this.registerForm.get("codeProducteur")?.clearValidators();
            }
            this.registerForm.get("codeProducteur")?.updateValueAndValidity();
        });
    }
    get email() {
        return this.registerForm.get("email");
    }
    get password() {
        return this.registerForm.get("password");
    }
    get nom() {
        return this.registerForm.get("nom");
    }
    get prenom() {
        return this.registerForm.get("prenom");
    }
    get role() {
        return this.registerForm.get("role");
    }
    get codeProducteur() {
        return this.registerForm.get("codeProducteur");
    }

    onSubmit() {
        this.validate = true;
        if (this.registerForm.valid) {
            // Traitement du formulaire
            if (this.role!.value === "PRODUCTEUR") {
                this.authService
                    .registerProducteur(
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
                                icon: 'success',
                                title: 'Succès',
                                text: 'L\'utilisateur producteur a été enregistré avec succès!',
                                confirmButtonColor: 'var(--theme-default)',
                            });
                            console.log(data);
                        },
                        error: (error: any) => {
                            console.error(error);
                            if (error?.error?.message === "Email déjà utilisé"){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erreur',
                                    text: 'Email déjà utilisé !',
                                    confirmButtonColor: 'var(--theme-default)',
                                });
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erreur',
                                    text: 'Une erreur s\'est produite lors de l\'enregistrement.',
                                    confirmButtonColor: 'var(--theme-default)',
                                });
                            }
                        }
                    });
            } else {
                this.authService
                    .register(
                        this.email!.value,
                        this.password!.value,
                        this.nom!.value,
                        this.prenom!.value,
                        this.role!.value
                    )
                    .subscribe({
                        next: (data) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Succès',
                                text: 'L\'utilisateur a été enregistré avec succès!',
                            });
                            console.log(data);
                        },
                        error: (error: any) => {
                            console.error(error);
                            if (error?.error?.message === "Email déjà utilisé"){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erreur',
                                    text: 'Email déjà utilisé !',
                                    confirmButtonColor: 'var(--theme-default)',
                                });
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erreur',
                                    text: 'Une erreur s\'est produite lors de l\'enregistrement.',
                                    confirmButtonColor: 'var(--theme-default)',
                                });
                            }
                        }
                    });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Formulaire invalide',
                text: 'Veuillez vérifier les champs et réessayer.',
            });
            console.log("Form is invalid");
        }
    }
}
