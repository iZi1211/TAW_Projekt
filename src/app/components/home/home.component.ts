import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, public authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.getLoginState(); // Check login state
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  handleLogout(): void {
    this.authService.setLoginState(false); // Log the user out
    localStorage.clear(); // Clear session data if stored
    this.router.navigate(['/home']); // Redirect to home
  }

}
