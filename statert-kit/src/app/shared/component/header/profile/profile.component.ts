import { UtilisateurService } from './../../../../services/utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { FeathericonComponent } from '../../feathericon/feathericon.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FeathericonComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public show: boolean = false;
  profile: any;
  token: string;
  nom: any;
  prenom: any;
  role: any;

  constructor(private router: Router,private UtilisateurService:UtilisateurService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token") as string;
    this.profile = this.UtilisateurService.getDecodedToken(token);
    this.nom = this.profile.user.nom;
    this.prenom = this.profile.user.prenom;
    this.role = this.profile.user.role;
  }

  open() {
    this.show = !this.show
  }

  logout() {
    Swal.fire({
      title: "Voulez-vous vraiment déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3b8748",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
  }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        this.router.navigate(["/auth/login"]);
      }
  });
  }

}
