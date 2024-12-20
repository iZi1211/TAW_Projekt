import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ValidateLogin, ValidatePassword } from '../../validators';
import { returnMsgs } from '../../shared/Msgs';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  modalVisible: boolean = false;
  popupText: string = '';

  constructor(
    private apiService: ApiService,
    public router: Router,
    private authService: AuthService
  ) {}



  
  HandleLoginPress() {

    if (!this.username) {
      this.showPopup('Username is required');  // Show error if username is missing
      return;  // Don't proceed with API calls if username is missing
    }
    // Wywołanie metody sprawdzającej status aktywacji użytkownika
    this.apiService.getActivationStatus(this.username).subscribe({
      next: (response: string) => {
        console.log('Activation status response:', response);  // Sprawdzanie odpowiedzi
        if (response === 'Not Activated') {
          this.router.navigate(['/activate'], { state: { username: this.username } });
        } else if (response === 'Activated') {
          this.performLogin();
        } else {
          this.showPopup('User not found. Please check your username.');
        }
      },
      error: (err) => {
        // Logowanie szczegółów błędu
        console.error('Error occurred while checking account activation:', err);
        
        if (err.status === 200) {
          // Jeśli odpowiedź ma status 200, ale 'ok' to false, wtedy wychwytujemy
          this.showPopup('The account activation status couldn\'t be determined.');
        } else {
          this.showPopup('An error occurred while checking account activation.');
        }
      }
    });
  }
  
  

  performLogin(): void {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response: string) => {
        if (response === 'true') {
          // Use AuthService to update login state
          this.authService.setLoginState(true, this.username);
  
          // Redirect to home
          this.router.navigate(['/home']);
        } else {
          this.showPopup('Incorrect username or password.');
        }
      },
      error: () => {
        this.showPopup('An error occurred while logging in.');
      }
    });
  }

  showPopup(message: string) {
    this.popupText = message;
    this.modalVisible = true;
  }

  closePopup() {
    this.popupText = '';
    this.modalVisible = false;
  }

  onUsernameInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.username = target.value;
  }

  onPasswordInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.password = target.value;
  }
}
