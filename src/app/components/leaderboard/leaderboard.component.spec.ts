import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getRanking']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getLoginState']);

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientTestingModule, LeaderboardComponent],

      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
  });



  describe('ngOnInit', () => {
    it('should check if user is logged in and fetch ranking if logged in', () => {
      // Arrange
      mockAuthService.getLoginState.and.returnValue(true); // Simulating the user is logged in
      const rankingData = 'user1/100;user2/200'; // Mock ranking data
      mockApiService.getRanking.and.returnValue(of(rankingData)); // Mock successful API call

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(component.isLoggedIn).toBeTrue(); // The user should be logged in
      expect(mockApiService.getRanking).toHaveBeenCalled(); // Should call getRanking
      expect(component.rankings).toEqual([
        { user: 'user1', score: 100 },
        { user: 'user2', score: 200 },
      ]); // Should correctly parse the ranking data
    });

    it('should not fetch ranking if user is not logged in', () => {
      // Arrange
      mockAuthService.getLoginState.and.returnValue(false); // Simulating the user is not logged in

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(component.isLoggedIn).toBeFalse(); // The user should not be logged in
      expect(mockApiService.getRanking).not.toHaveBeenCalled(); // getRanking should not be called
    });
  });

  describe('fetchRanking', () => {
    it('should fetch ranking successfully', () => {
      // Arrange
      const mockResponse = 'user1/100;user2/200'; // Mock response from the API
      mockApiService.getRanking.and.returnValue(of(mockResponse)); // Mock API call

      // Act
      component.fetchRanking();
      fixture.detectChanges();

      // Assert
      expect(component.rankings).toEqual([
        { user: 'user1', score: 100 },
        { user: 'user2', score: 200 },
      ]); // Rankings should be parsed correctly
    });


  });

  describe('parseRanking', () => {
    it('should parse ranking data correctly', () => {
      // Arrange
      const rawData = 'user1/100;user2/200';
      
      // Act
      const parsedRankings = component['parseRanking'](rawData); // Access the private method
      
      // Assert
      expect(parsedRankings).toEqual([
        { user: 'user1', score: 100 },
        { user: 'user2', score: 200 },
      ]);
    });

    it('should ignore empty lines in ranking data', () => {
      // Arrange
      const rawData = 'user1/100;;user2/200;';
      
      // Act
      const parsedRankings = component['parseRanking'](rawData);
      
      // Assert
      expect(parsedRankings).toEqual([
        { user: 'user1', score: 100 },
        { user: 'user2', score: 200 },
      ]);
    });

    it('should return an empty array if no valid ranking data', () => {
      // Arrange
      const rawData = '';

      // Act
      const parsedRankings = component['parseRanking'](rawData);
      
      // Assert
      expect(parsedRankings).toEqual([]);
    });
  });
});
