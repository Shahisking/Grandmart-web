
import { User } from '../types';

const DB_KEY = 'grandmart_user_db';

/**
 * Grandmart Persistent Database Service
 * Manages user records and authentication state.
 */
class UserDatabase {
  private static instance: UserDatabase;
  
  private constructor() {
    this.initialize();
  }

  public static getInstance(): UserDatabase {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
    }
    return UserDatabase.instance;
  }

  private initialize() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      // Seed initial admin account
      const admin: User & { password?: string } = {
        id: 'admin_root',
        name: 'Grandmart Administrator',
        email: 'admingrand@gmail.com',
        role: 'ADMIN',
        password: 'admin1234',
        address: 'Grandmart Headquarters, Tech Park, Mumbai',
        phone: '+91 00000 00000'
      };
      this.saveUsers([admin]);
    }
  }

  private getUsers(): (User & { password?: string })[] {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: (User & { password?: string })[]) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  }

  /**
   * Register a new user
   */
  public register(user: User & { password?: string }): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }
    
    users.push(user);
    this.saveUsers(users);
    return { success: true };
  }

  /**
   * Authenticate a user
   */
  public authenticate(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'User record not found' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Invalid password provided' };
    }

    // Return user without password for security
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser as User };
  }

  /**
   * Get all registered users (for admin analysis)
   */
  public getAllUsers(): User[] {
    return this.getUsers().map(({ password: _, ...user }) => user as User);
  }
}

export const db = UserDatabase.getInstance();
