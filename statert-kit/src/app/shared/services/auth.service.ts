import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; // Import the jwtDecode function from the 'jwt-decode' package
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    constructor(private http: HttpClient) { }

     //recuperation du token
  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token); // Use the imported jwtDecode function
    } catch (error) {
      return null;
    }
  }
  //deconnexion de l'utilisateur
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
  }
  //verification de la connexion de l'utilisateur
  isUserLoggedIn() {
    let user = sessionStorage.getItem('token');
    return !(user === null);
  }
  //authentification de l'utilisateur
  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
      .pipe(
        map((userData: any) => {
          return userData;
        })
        );
  }

  }