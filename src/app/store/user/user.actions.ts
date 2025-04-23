import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserProfile, UserSettings, UpdateSettingsDto, RegisterModel, LoginModel } from '../../core/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Authentication
    'Init Auth Status': emptyProps(),
    'Init Auth Status Success': props<{ isAuthenticated: boolean }>(),
    'Init Auth Status Failure': emptyProps(),

    'Register': props<{ model: RegisterModel }>(),
    'Register Success': props<{ user: User }>(),
    'Register Failure': props<{ error: any }>(),

    'Login': props<{ model: LoginModel }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: any }>(),

    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: any }>(),

    // Load Current User
    'Load Current User': emptyProps(),
    'Load Current User Success': props<{ user: UserProfile }>(),
    'Load Current User Failure': props<{ error: any }>(),

    // Load All Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: any }>(),

    // Load User by ID
    'Load User By Id': props<{ userId: string }>(),
    'Load User By Id Success': props<{ user: User }>(),
    'Load User By Id Failure': props<{ error: any }>(),

    // Update User
    'Update User': props<{ userId: string; changes: Partial<User> }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: any }>(),

    // Update Settings
    'Update Settings': props<{ userId: string; settings: UpdateSettingsDto }>(),
    'Update Settings Success': props<{ settings: UserSettings }>(),
    'Update Settings Failure': props<{ error: any }>(),

    // Update Profile
    'Update Profile': props<{ userId: string; changes: Partial<User> }>(),
    'Update Profile Success': props<{ user: User }>(),
    'Update Profile Failure': props<{ error: any }>(),

    // Theme
    'Set Theme': props<{ theme: 'light' | 'dark' }>(),

    // Presence
    'Update Presence': props<{ status: 'online' | 'away' | 'offline' }>(),
    'Update Presence Success': props<{ status: { userId: string; status: string } }>(),
    'Update Presence Failure': props<{ error: any }>(),

    // User Status
    'Update User Status': props<{ userId: string; isOnline: boolean }>(),
    'Set Connection Status': props<{ isConnected: boolean }>(),

    // Upload Avatar
    'Upload Avatar': props<{ userId: string; file: File }>(),
    'Upload Avatar Success': props<{ user: User }>(),
    'Upload Avatar Failure': props<{ error: any }>()
  }
});
