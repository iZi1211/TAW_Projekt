import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080'; // Adres backendu

  constructor(private http: HttpClient) {}


  getRanking(): Observable<string> {
    return this.http.get(`${this.apiUrl}/ranking`, { responseType: 'text' });
  }

  
  login(username: string, password: string): Observable<string> {
    const params = new HttpParams()
      .set('login', username)
      .set('password', password);
  
    
    return this.http.get<string>(`${this.apiUrl}/login`, {
      params,
      responseType: 'text' as 'json',
    });
  }
  


  sendScore(login: string, score: number): Observable<string> {
    
    const params = new HttpParams()
      .set('login', login)  
      .set('score', score.toString());  
  
   
    return this.http.post<string>(`${this.apiUrl}/saveScore`, null, { params });
  }

  register(login: string, password: string, mail: string): Observable<string> {
    const params = new HttpParams()
      .set('login', login)
      .set('password', password)
      .set('mail', mail);

    return this.http.post<string>(`${this.apiUrl}/register`, null, { params });
  }
  
  sendActivationCode(username: string): Observable<string> {
    const params = new HttpParams().set('login', username);
    return this.http.get<string>(`${this.apiUrl}/sendActivationCode`, { params });
  }
  
  activateUser(username: string, activationCode: string): Observable<string> {
    const params = new HttpParams()
      .set('login', username)
      .set('activationCode', activationCode);
  
    return this.http.get<string>(`${this.apiUrl}/activateUser`, { params });
  }

 
  sendScoreEmail(login: string, score: number): Observable<string> {
    const params = new HttpParams()
      .set('login', login)
      .set('wynik', score.toString());

    return this.http.get<string>(`${this.apiUrl}/sendScore`, { params });
  }

  getActivationStatus(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/getActivationStatus`, {
      params: new HttpParams().set('login', username),
      responseType: 'text' as 'json' 
    });
  }
}
