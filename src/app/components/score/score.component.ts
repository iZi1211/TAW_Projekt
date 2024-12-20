import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  score: number = 0;
  login: string = '';
  sendResultMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    
    this.score = history.state.score || 0;
  
    console.log('Score received from GameComponent:', this.score);
  
    // Pobranie loginu z localStorage
    this.login = localStorage.getItem('username') || 'Anonymous';
    this.sendScoreToDatabase();

  
  }

  

  sendScoreToDatabase() {
    console.log('Sending score to backend:', this.score, this.login); 
    this.apiService.sendScore(this.login, this.score).subscribe(
      (response) => {
        console.log('Score sent successfully!', response);
      },
      (error) => {
        console.error('Error sending score', error);
      }
    );
  }

  

  sendScoreToEmail(): void {
    this.apiService.sendScoreEmail(this.login, this.score).subscribe(
      (response) => {
        console.log('Response:', response); 
        if (response === 'Score sent successfully') {
          this.sendResultMessage = 'Email sent successfully with the score';
          this.navigateHome();
        } else {
          this.sendResultMessage = `Unexpected server response: ${response}`;
        }
      },
      (error) => {
        console.error('Error sending email:', error);
        this.sendResultMessage = `Error sending email: ${error.message}`;
      }
    );
  }
  
  

  navigateHome() {
    this.router.navigate(['/home']); 
  }
}
