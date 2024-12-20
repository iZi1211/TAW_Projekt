import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  rankings: { user: string; score: number }[] = [];
  errorMessage: string = '';
  isLoggedIn: boolean = false; // Flaga logowania

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Sprawdzenie, czy użytkownik jest zalogowany
    if (this.isLoggedIn) {
      this.fetchRanking();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.getLoginState();
    console.log('Is user logged in:', this.isLoggedIn); 
  }

  fetchRanking(): void {
    this.apiService.getRanking().subscribe({
      next: (data) => {
        this.rankings = this.parseRanking(data);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching ranking data.';
        console.error('Ranking error:', error);
      }
    });
  }

  private parseRanking(data: string): { user: string; score: number }[] {
    return data
      .split(';')
      .filter((entry) => entry.trim().length > 0) // Odrzucanie pustych linii
      .map((entry) => {
        const [user, score] = entry.split('/');
        return { user, score: parseInt(score, 10) };
      });
  }
}
