import { UtilisateurService } from './../../../services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { ApplicationModule, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-utilisateur',
  standalone: true,
  imports: [CommonModule, ApplicationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-utilisateur.component.html',
  styleUrls: ['./update-utilisateur.component.scss']
})
export class UpdateUtilisateurComponent implements OnInit {

  updateUserForm: FormGroup;
  validate = false; // Pour déclencher la validation après soumission
  isProducer: boolean = false;
  id_utilisateur: any;
  utilisateur: any;

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService) {
    this.updateUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      role: ['', Validators.required],
      codeProducteur: [''],
    });
  }

  ngOnInit(): void {
    this.id_utilisateur = localStorage.getItem('id_utilisateur');

    // Écoute les changements de la sélection du rôle pour afficher le champ 'codeProducteur'
    this.updateUserForm.get('role')?.valueChanges.subscribe(role => {
      this.isProducer = role === 'PRODUCTEUR';
      if (this.isProducer) {
        this.updateUserForm.get('codeProducteur')?.setValidators(Validators.required);
      } else {
        this.updateUserForm.get('codeProducteur')?.clearValidators();
      }
      this.updateUserForm.get('codeProducteur')?.updateValueAndValidity();
    });

    this.utilisateurService.getById(this.id_utilisateur).subscribe((data: any) => {
      console.log(data);
      this.utilisateur = data;
      this.updateUserForm.patchValue({
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
    if (this.updateUserForm.valid) {
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
                icon: 'success',
                title: 'Mise à jour réussie',
                text: 'L\'utilisateur producteur a été mis à jour avec succès!',
              });
              console.log(data);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la mise à jour.',
              });
              console.error(err);
            }
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
                icon: 'success',
                title: 'Mise à jour réussie',
                text: 'L\'utilisateur a été mis à jour avec succès!',
              });
              console.log(data);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la mise à jour.',
              });
              console.error(err);
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

  // Getter pour faciliter l'accès aux contrôles dans le template
  get email() {
    return this.updateUserForm.get('email');
  }
  get password() {
    return this.updateUserForm.get("password");
  }
  get nom() {
    return this.updateUserForm.get('nom');
  }
  get prenom() {
    return this.updateUserForm.get('prenom');
  }
  get role() {
    return this.updateUserForm.get('role');
  }
  get codeProducteur() {
    return this.updateUserForm.get('codeProducteur');
  }
}
