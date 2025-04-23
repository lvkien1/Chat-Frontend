import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  User, 
  UserProfile,
  UserSettings, 
  UpdateSettingsDto,
  DEFAULT_USER_SETTINGS,
  RegisterModel,
  LoginModel
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

  /**
   * Lưu token xác thực vào localStorage
   */
  saveAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Xóa token xác thực khỏi localStorage
   */
  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Lấy token xác thực từ localStorage
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Kiểm tra trạng thái xác thực dựa trên token
   */
  checkAuthStatus(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Đăng ký người dùng mới
   */
  register(model: RegisterModel): Observable<User> {
    // Mock implementation
    const newUser: User = {
      Id: `user-${Date.now()}`,
      FullName: model.FullName,
      Email: model.Email,
      Avatar: '',
      Settings: DEFAULT_USER_SETTINGS,
      IsOnline: true
    };
    
    this.mockUsers.set(newUser.Id, newUser);
    
    // Trong thực tế sẽ nhận token từ API backend
    return of(newUser).pipe(
      delay(300),
      tap(() => {
        // Lưu auth token giả định
        this.saveAuthToken(`mock_token_${Date.now()}`);
      })
    );
  }
  
  /**
   * Đăng nhập người dùng
   */
  login(model: LoginModel): Observable<User> {
    // Mock implementation - tìm user theo username
    // Trong thực tế sẽ gọi API backend
    const user = Array.from(this.mockUsers.values()).find(
      u => u.Email.split('@')[0] === model.Username
    );
    
    if (user) {
      const loggedInUser = {...user, IsOnline: true};
      this.mockUsers.set(loggedInUser.Id, loggedInUser);
      
      // Trả về user và lưu auth token giả định
      return of(loggedInUser).pipe(
        delay(200),
        tap(() => {
          this.saveAuthToken(`mock_token_${Date.now()}`);
        })
      );
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  /**
   * Đăng xuất người dùng
   */
  logout(): Observable<void> {
    this.removeAuthToken();
    return of(undefined).pipe(delay(100));
  }

  getCurrentUser(): Observable<UserProfile> {
    // Mock implementation
    return of<UserProfile>({
      Id: 'current-user',
      FullName: 'Current User',
      Email: 'current@example.com',
      Avatar: '',
      Settings: DEFAULT_USER_SETTINGS,
      createdAt: new Date(2025, 0, 1),
      updatedAt: new Date(),
      IsOnline: true
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
      ...user.Settings,
      ...settings,
      lastUpdated: new Date()
    };
    this.mockUsers.set(userId, { ...user, Settings: updatedSettings });
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
      Avatar: URL.createObjectURL(file)
    };
    this.mockUsers.set(userId, updatedUser);
    return of(updatedUser).pipe(delay(500));
  }

  private initializeMockData(): void {
    const mockUsers: User[] = [
      {
        Id: 'user1',
        FullName: 'User One',
        Email: 'user1@example.com',
        Avatar: '',
        IsOnline: true,
        Settings: {
          ...DEFAULT_USER_SETTINGS,
          lastUpdated: new Date(2025, 0, 1)
        }
      },
      {
        Id: 'user2',
        FullName: 'User Two',
        Email: 'user2@example.com',
        Avatar: '',
        IsOnline: false,
        Settings: {
          ...DEFAULT_USER_SETTINGS,
          theme: 'dark',
          soundEnabled: false,
          lastUpdated: new Date(2025, 0, 1)
        }
      }
    ];

    mockUsers.forEach(user => this.mockUsers.set(user.Id, user));
  }
}

function throwError(arg0: () => Error): Observable<any> {
  return new Observable(subscriber => {
    subscriber.error(arg0());
  });
}
