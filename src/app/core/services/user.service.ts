import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  User, 
  UserProfile,
  UserSettings, 
  UpdateSettingsDto,
  DEFAULT_USER_SETTINGS
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private mockUsers: Map<string, User> = new Map();

  constructor(private http: HttpClient) {
    this.initializeMockData();
  }

  getCurrentUser(): Observable<UserProfile> {
    // Mock implementation
    return of<UserProfile>({
      id: 'current-user',
      name: 'Current User',
      email: 'current@example.com',
      avatar: '',
      settings: DEFAULT_USER_SETTINGS,
      createdAt: new Date(2025, 0, 1),
      updatedAt: new Date(),
      isOnline: true
    }).pipe(delay(100));
  }

  getUsers(): Observable<User[]> {
    // Mock implementation
    return of(Array.from(this.mockUsers.values())).pipe(delay(100));
  }

  getUserById(userId: string): Observable<User> {
    // Mock implementation
    const user = this.mockUsers.get(userId);
    return user 
      ? of(user).pipe(delay(100))
      : throwError(() => new Error('User not found'));
  }

  updateUser(userId: string, changes: Partial<User>): Observable<User> {
    // Mock implementation
    const user = this.mockUsers.get(userId);
    if (!user) return throwError(() => new Error('User not found'));

    const updatedUser = { ...user, ...changes };
    this.mockUsers.set(userId, updatedUser);
    return of(updatedUser).pipe(delay(100));
  }

  updateSettings(userId: string, settings: UpdateSettingsDto): Observable<UserSettings> {
    // Mock implementation
    const user = this.mockUsers.get(userId);
    if (!user) return throwError(() => new Error('User not found'));

    const updatedSettings: UserSettings = {
      ...user.settings,
      ...settings,
      lastUpdated: new Date()
    };
    this.mockUsers.set(userId, { ...user, settings: updatedSettings });
    return of(updatedSettings).pipe(delay(100));
  }

  updateProfile(userId: string, changes: Partial<User>): Observable<User> {
    // Mock implementation
    return this.updateUser(userId, changes);
  }

  uploadAvatar(userId: string, file: File): Observable<User> {
    // Mock implementation
    const user = this.mockUsers.get(userId);
    if (!user) return throwError(() => new Error('User not found'));

    const updatedUser = {
      ...user,
      avatar: URL.createObjectURL(file)
    };
    this.mockUsers.set(userId, updatedUser);
    return of(updatedUser).pipe(delay(500));
  }

  private initializeMockData(): void {
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        avatar: '',
        isOnline: true,
        settings: {
          ...DEFAULT_USER_SETTINGS,
          lastUpdated: new Date(2025, 0, 1)
        }
      },
      {
        id: 'user2',
        name: 'User Two',
        email: 'user2@example.com',
        avatar: '',
        isOnline: false,
        settings: {
          ...DEFAULT_USER_SETTINGS,
          theme: 'dark',
          soundEnabled: false,
          lastUpdated: new Date(2025, 0, 1)
        }
      }
    ];

    mockUsers.forEach(user => this.mockUsers.set(user.id, user));
  }
}

function throwError(arg0: () => Error): Observable<any> {
  return new Observable(subscriber => {
    subscriber.error(arg0());
  });
}
