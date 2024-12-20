import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';  // Import the RegisterComponent
import { ApiService } from '../../services/api.service'; // Import the ApiService
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // To test HTTP requests

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a spy for the ApiService
    const apiSpy = jasmine.createSpyObj('ApiService', ['register']);
    
    // Create a spy for Router to check navigation actions
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the testing module
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,         // To handle routing in tests
        ReactiveFormsModule,         // For handling reactive forms
        FormsModule,                 // To work with forms
        HttpClientTestingModule,      // To mock Http calls
        RegisterComponent
      ],

      providers: [
        { provide: ApiService, useValue: apiSpy },   // Provide the spy version of ApiService
        { provide: Router, useValue: routerSpy }     // Provide the spy version of Router
      ],
    }).compileComponents();  // Compile components before running tests

    // Create fixture and component instances
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    // Inject the dependencies (mocked services)
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();  // Trigger change detection
  });

  // Test Cases
  it('should show an error message if the email format is invalid', () => {
    // Arrange
    component.username = 'test_user';
    component.email = 'invalid-email';  // Invalid email format
    component.password = 'test_password';
    component.repeatPassword = 'test_password';

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('Please enter a valid email address.');
  });

  it('should show an error message if passwords do not match', () => {
    // Arrange
    component.username = 'test_user';
    component.email = 'test_user@example.com';  // Valid email
    component.password = 'test_password';
    component.repeatPassword = 'different_password';  // Passwords do not match

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('Passwords do not match.');
  });



  it('should show an error message when the username already exists', () => {
    // Arrange
    component.username = 'existing_user';
    component.email = 'existing_user@example.com';
    component.password = 'test_password';
    component.repeatPassword = 'test_password';

    // Mock API response for username conflict
    apiService.register.and.returnValue(of('69'));

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('This username already exists.');
  });

  it('should show a generic error message if registration fails', () => {
    // Arrange
    component.username = 'test_user';
    component.email = 'test_user@example.com';
    component.password = 'test_password';
    component.repeatPassword = 'test_password';

    // Mock API failure response
    apiService.register.and.returnValue(of('0')); // Generic failure response

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('An unexpected error occurred during registration.');
  });

  it('should show an error message if there is an error in API response', () => {
    // Arrange
    component.username = 'test_user';
    component.email = 'test_user@example.com';
    component.password = 'test_password';
    component.repeatPassword = 'test_password';

    // Simulate API failure (e.g., network or server error)
    apiService.register.and.returnValue(throwError(() => new Error('API error')));

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('An error occurred while processing your request.');
  });



  it('should show an error message if email field is missing', () => {
    // Arrange
    component.username = 'test_user';
    component.email = '';  // Missing email
    component.password = 'test_password';
    component.repeatPassword = 'test_password';

    // Act
    component.register();
    fixture.detectChanges();

    // Assert
    expect(component.errorMessage).toBe('Please enter a valid email address.');
  });

});
