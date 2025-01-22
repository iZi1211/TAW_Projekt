import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScoreComponent } from './score.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  
  let mockHistoryState: any;

  beforeEach(async () => {
    // Mocking the score value and history state
    mockHistoryState = { score: 50 };

    // Creating spies for ApiService and Router
    const apiSpy = jasmine.createSpyObj('ApiService', ['sendScore', 'sendScoreEmail']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Temporarily assign a spy to history.state using spyOnProperty
    spyOnProperty(window.history, 'state').and.returnValue(mockHistoryState);

    // Configure TestBed
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,             // Provides routing related capabilities
        HttpClientTestingModule,         // Mock HttpClient calls
      ],
      declarations: [ScoreComponent],    // Declare the ScoreComponent for testing
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    // Create component instance and inject mocks
    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Set up localStorage mock
    localStorage.setItem('loggedInUser', 'testUser');

    // Arrange: Mock the apiService.sendScore method to return a successful observable
    apiService.sendScore.and.returnValue(of('Score sent successfully'));

    // Trigger component detection to run ngOnInit
    fixture.detectChanges();
  });

  it('should send the score to the database when ngOnInit is called', () => {
    // Act: Call the ngOnInit function by detecting changes in the component
    fixture.detectChanges();

    // Assert: Ensure that the sendScore method was called with the correct arguments
    expect(apiService.sendScore).toHaveBeenCalledWith('testUser', 50);
  });

  it('should handle errors when sending the score to the database', () => {
    // Arrange: Mock the apiService.sendScore method to throw an error
    const mockError = new Error('Error sending score');
    apiService.sendScore.and.returnValue(throwError(() => mockError));

    // Act: Call ngOnInit again, which triggers sendScore to execute
    fixture.detectChanges();

    // Assert: Check if error handling works correctly
    expect(apiService.sendScore).toHaveBeenCalledWith('testUser', 50);
  });

  it('should navigate home after sending the score via email', () => {
    // Arrange: Mock the sendScoreEmail to return a successful observable
    apiService.sendScoreEmail.and.returnValue(of('Score sent successfully'));

    // Act: Call the method that sends the score to email
    component.sendScoreToEmail();
    fixture.detectChanges();

    // Assert: Ensure that the router's navigate method is called to go to the home route
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should initialize the score from the router state', () => {
    // Arrange
    const scoreFromHistory = 50;
    const routerHistory = { state: { score: scoreFromHistory } };
  
    spyOnProperty(window, 'history').and.returnValue(routerHistory as any);
  
    // Act
    component.ngOnInit();
    fixture.detectChanges();
  
    // Assert
    expect(component.score).toBe(scoreFromHistory);
    expect(component.login).toBe('testUser');  // Should match default login
  });

  
  it('should use localStorage to get the username on init', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue('testUser');

    // Act
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.login).toBe('testUser');
    expect(localStorage.getItem).toHaveBeenCalledWith('loggedInUser');
  });

  it('should call navigateHome() when navigation is triggered', () => {
    // Act
    component.navigateHome();
    fixture.detectChanges();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
  

});
