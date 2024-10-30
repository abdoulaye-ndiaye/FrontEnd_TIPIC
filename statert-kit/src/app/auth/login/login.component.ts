import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
    public validate: boolean = false;
    public show: boolean = false;
  
    constructor() {
    }
    showPassword() {
      this.show = !this.show;
    }
  
    // Simple Login
  
    login() {
      this.validate = true;
      
    }


}
