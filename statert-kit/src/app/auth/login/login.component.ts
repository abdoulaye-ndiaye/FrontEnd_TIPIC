import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    public validate: boolean = false;
    public show: boolean = false;
    loginForm: FormGroup;
    submitted = false;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    showPassword() {
        this.show = !this.show;
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            Swal.fire({
                icon: 'warning',
                title: 'Formulaire invalide',
                text: 'Veuillez remplir tous les champs requis.',
            });
            return;
        } else {
            this.authService
                .login(
                    this.loginForm.value.email,
                    this.loginForm.value.password
                )
                .subscribe(
                    (result) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Connexion réussie',
                            text: 'Vous serez redirigé vers le tableau de bord.',
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            this.router.navigate(["/admin/dashboard"]);
                        });
                    },
                    (error) => {
                        if (error.error.text === "compte bloqué") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: 'Ce compte a été bloqué.',
                            });
                        } else if (error.error.text === "email invalide") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: 'Email et/ou mot de passe incorrect !',
                            });
                        } else if (error.error.text === "mot de passe incorrect") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: 'Email et/ou mot de passe incorrect !',
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur inconnue',
                                text: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
                            });
                        }
                    }
                );
        }
    }

    get f() {
        return this.loginForm.controls;
    }

    get value() {
        return this.loginForm.controls;
    }
}
