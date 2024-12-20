import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  errorMessage: string = '';

  
  constructor(private apiService: ApiService, public router: Router) { }

  ngOnInit(): void {
  }

  // Funkcja rejestracji
  register(): void {
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }


    this.apiService.register(this.username, this.password, this.email).subscribe(
      response => {
        console.log('Registration Response:', response);
        this.router.navigate(['/activate'], { state: { username: this.username }});
        // Sprawdzanie odpowiedzi
        if (response === '420') {
          this.errorMessage = 'Registration successful! Please proceed to activate your account.';
        } else if (response === '69') {
          this.errorMessage = 'This username already exists.';
        } else if (response === '0') {
          this.errorMessage = 'An unexpected error occurred during registration.';
        }
      },
      error => {
        console.error('Error during registration:', error);
        this.errorMessage = 'An error occurred while processing your request.';
      }
    );
  }

  // Sprawdzenie, czy email jest poprawny
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }


}
