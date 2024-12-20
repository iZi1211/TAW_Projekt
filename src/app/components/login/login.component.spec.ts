import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getActivationStatus', 'login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ],

    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if username is missing', () => {
    // Arrange
    const loginData = { username: '', password: 'test_pass' };

    // Act: Call the login method (HandleLoginPress)
    component.username = loginData.username;
    component.password = loginData.password;
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update

    // Assert
    expect(component.popupText).toBe('Username is required');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to activation screen if account is not activated', () => {
    // Arrange
    const mockResponse = 'Not Activated';
    apiService.getActivationStatus.and.returnValue(of(mockResponse));
    spyOn(component, 'showPopup'); // To ensure no popup is shown here
    
    component.username = 'test_user';
    
    // Act
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update
    
    // Assert
    expect(apiService.getActivationStatus).toHaveBeenCalledWith('test_user');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/activate'], { state: { username: 'test_user' } });
    expect(component.showPopup).not.toHaveBeenCalled(); // No popup triggered for "Not Activated"
  });

  it('should login successfully if account is activated', () => {
    // Arrange
    const mockActivationStatus = 'Activated';
    const mockLoginResponse = 'true'; // Successful login
    apiService.getActivationStatus.and.returnValue(of(mockActivationStatus));
    apiService.login.and.returnValue(of(mockLoginResponse));

    component.username = 'test_user';
    component.password = 'test_password';
    
    // Act
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update
    
    // Assert
    expect(apiService.getActivationStatus).toHaveBeenCalledWith('test_user');
    expect(apiService.login).toHaveBeenCalledWith('test_user', 'test_password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.popupText).toBe(''); // Popup should be empty for successful login
  });

  it('should show error message if login fails', () => {
    // Arrange
    const mockActivationStatus = 'Activated';
    const mockLoginResponse = 'false'; // Failed login attempt
    apiService.getActivationStatus.and.returnValue(of(mockActivationStatus));
    apiService.login.and.returnValue(of(mockLoginResponse));
    
    component.username = 'test_user';
    component.password = 'test_password';

    // Act
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update

    // Assert
    expect(component.popupText).toBe('Incorrect username or password.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();  // No navigation to home on failed login
  });

  it('should show error message if account activation fails', () => {
    // Arrange
    const activationError = new Error('Error while checking activation');
    apiService.getActivationStatus.and.returnValue(throwError(() => activationError));

    component.username = 'test_user';
    
    // Act
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update
    
    // Assert
    expect(component.popupText).toBe('An error occurred while checking account activation.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should show error message if login fails due to server issue', () => {
    // Arrange
    const mockActivationStatus = 'Activated';
    const loginError = new Error('Server error');
    apiService.getActivationStatus.and.returnValue(of(mockActivationStatus));
    apiService.login.and.returnValue(throwError(() => loginError));

    component.username = 'test_user';
    component.password = 'test_password';
    
    // Act
    component.HandleLoginPress();
    fixture.detectChanges(); // Trigger view update
    
    // Assert
    expect(component.popupText).toBe('An error occurred while logging in.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });



  
});
