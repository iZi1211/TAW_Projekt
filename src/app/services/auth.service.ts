import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private loggedInUser: string | null = null;

  constructor() {
    // Load login state from localStorage
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.loggedInUser = localStorage.getItem('loggedInUser');
  }

  setLoginState(state: boolean, username?: string): void {
    this.isLoggedIn = state;
    this.loggedInUser = state ? username || null : null;

    // Persist to localStorage
    localStorage.setItem('isLoggedIn', String(state));
    localStorage.setItem('loggedInUser', this.loggedInUser ?? '');
  }

  getLoginState(): boolean {
    return this.isLoggedIn;
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser;
  }

  logout(): void {
    this.setLoginState(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
  }
}
