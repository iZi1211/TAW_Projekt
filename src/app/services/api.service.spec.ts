import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Teardown
    httpMock.verify();
  });

  it('should successfully communicate with the backend when fetching leaderboard data', () => {
    // Arrange integ
    const mockResponse = '1. John Doe: 200\n2. Jane Smith: 180';
    
    // Act
    service.getRanking().subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/ranking');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Send the mock response
  });

  it('should return proper status when submitting score', () => {
    // Arrange
    const username = 'testUser';
    const score = 100;
    const mockResponse = 'Score saved successfully';
  
    // Act
    service.sendScore(username, score).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/saveScore?login=${username}&score=${score}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Send the mock response
  });

  it('should return user activation status after checking with backend', () => {
    // Arrange
    const mockResponse = 'Activated';
    const username = 'testUser';
  
    // Act
    service.getActivationStatus(username).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/getActivationStatus?login=${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Send the mock response
  });



  it('should send activation code and return success', () => {
    // Arrange
    const mockResponse = 'Activation code sent';
    const username = 'test_user';
    
    // Act
    service.sendActivationCode(username).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/sendActivationCode?login=${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // send the mock response
  });

  it('should return account activation status', () => {
    // Arrange
    const mockResponse = 'Activated';
    const username = 'test_user';

    // Act
    service.getActivationStatus(username).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/getActivationStatus?login=${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // send the mock response
  });

  it('should handle error when sending activation code fails', () => {
    // Arrange
    const errorMessage = 'Server error';
    const username = 'test_user';

    // Act
    service.sendActivationCode(username).subscribe({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        // Assert
        expect(error.error).toBe(errorMessage);  // Ensure this matches the message used in the error event
      },
    });

    const req = httpMock.expectOne(`http://localhost:8080/sendActivationCode?login=${username}`);
    expect(req.request.method).toBe('GET');

    // Simulate an error response with a status code
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should log in successfully and return a token', () => {
    // Arrange   asdasdasd
    const username = 'testUser';
    const password = 'password123';
    const mockResponse = 'Login Successful';
  
    // Act
    service.login(username, password).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/login?login=${username}&password=${password}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Send the mock response
  });

  it('should send score successfully', () => {
    // Arrange   asdadadasdasd
    const username = 'testUser';
    const score = 100;
    const mockResponse = 'Score sent successfully';
  
    // Act
    service.sendScore(username, score).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/saveScore?login=${username}&score=${score}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Send the mock response
  });

  it('should send score via email', () => {
    // Arrange asdasdasdasdasd
    const username = 'testUser';
    const score = 100;
    const mockResponse = 'Score sent via email successfully';
  
    // Act
    service.sendScoreEmail(username, score).subscribe((response) => {
      // Assert
      expect(response).toBe(mockResponse);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/sendScore?login=${username}&wynik=${score}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Send the mock response
  });
  it('should handle error when sending score via email fails', () => {
    // Arrange
    const username = 'testUser';
    const score = 100;
    const errorMessage = 'Email failed to send';
  
    // Act
    service.sendScoreEmail(username, score).subscribe({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        // Assert
        expect(error.error).toBe(errorMessage);
        expect(error.status).toBe(500);  // Server error
      },
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/sendScore?login=${username}&wynik=${score}`);
    expect(req.request.method).toBe('GET');
  
    // Simulate an error response
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
    

});
