import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
  username: string = '';
  activationCode: string = '';  
  activationMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
   
    this.username = history.state.username || 0;
  
    console.log('Score received from GameComponent:', this.username);
  }

  sendActivationCode(): void {
    if (!this.username) {
      this.activationMessage = 'Username is required!';
      return;
    }

    this.apiService.sendActivationCode(this.username).subscribe(
      (response) => {
        console.log('Activation response:', response);
        if (response === 'Activation code sent') {
          this.activationMessage = 'Activation code has been sent to your email.';
        } else {
          this.activationMessage = 'There was an error while sending activation code.';
        }
      },
      (error) => {
        console.error('Error sending activation code:', error);
        this.activationMessage = 'An error occurred while processing your request.';
      }
    );
  }

  activateUser(): void {
    if (!this.activationCode) {
      this.activationMessage = 'Please enter the activation code.';
      return;
    }

    this.apiService.activateUser(this.username, this.activationCode).subscribe(
      (response) => {
        console.log('Activation response:', response);
        if (response === 'User activated successfully') {
          this.router.navigate(['/login']); 
        } else {
          this.activationMessage = 'Invalid activation code or error activating user.';
          
        }
      },
      (error) => {
        console.error('Error activating user:', error);
        this.activationMessage = 'An error occurred during activation.';
        this.router.navigate(['/login']); 
      }
    );
  }
}
