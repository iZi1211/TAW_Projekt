export class UserState {
    private static user: string = '';
  
    static setUser(newUser: string): void {
      this.user = newUser;
    }
  
    static getUser(): string {
      return this.user;
    }
  }
  