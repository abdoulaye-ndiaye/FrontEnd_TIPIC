import { CommonModule } from '@angular/common';
import { ApplicationModule, Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-formulaire-identite',
  standalone: true,
  imports: [CommonModule, ApplicationModule, FormsModule ],
  templateUrl: './formulaire-identite.component.html',
  styleUrl: './formulaire-identite.component.scss'
})
export class FormulaireIdentiteComponent {

  currentStep: number = 0;
  user = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    cardHolderName: '',
    cardNumber: '',
    cvc: '',
    expiryMonth: '',
    expiryYear: ''
  };
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i);

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit() {
    // Traitement lors de la soumission finale
    console.log('User Data:', this.user);
    alert('Form submitted successfully!');
  }
}
