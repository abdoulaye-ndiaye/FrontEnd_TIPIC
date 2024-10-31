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

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
    public validate: boolean = false;
    public show: boolean = false;
    loginForm: FormGroup;
    submitted = false;
    message = "";

    constructor(
        private authService: AuthService,
        private formBulder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}
    showPassword() {
        this.show = !this.show;
    }

    ngOnInit(): void {
        this.loginForm = this.formBulder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;
        this.message = "";
        if (this.loginForm.invalid) {
            return;
        } else {
            this.authService
                .login(
                    this.loginForm.value.email,
                    this.loginForm.value.password
                )
                .subscribe(
                    (result) => {
                        this.router.navigate(["/admin/dashboard"]);
                    },
                    (error) => {
                        //console.log(error);
                        if (error.error.text == "compte bloqué") {
                            this.message = "Ce compte a été bloqué";
                        } else if (error.error.text == "email invalide") {
                            this.message =
                                "Email et/ou mot de passe incorrect !";
                        } else if (
                            error.error.text == "mot de passe incorrect"
                        ) {
                            this.message =
                                "Email et/ou mot de passe incorrect !";
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
