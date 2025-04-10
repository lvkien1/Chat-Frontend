import { createReducer, on } from '@ngrx/store';
import { User, UserProfile, UserSettings, DEFAULT_USER_SETTINGS } from '../../core/models/user.model';
import { UserActions } from './user.actions';

export interface UserState {
  currentUser: UserProfile | null;
  users: User[];
  loading: boolean;
  error: string | null;
  settings: UserSettings | null;
}

export const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  settings: null
};

export const userReducer = createReducer(
  initialState,

  // Load Current User
  on(UserActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    settings: state?.settings && state.settings.theme ? { ...user.settings, theme: state.settings.theme } : user.settings
  })),

  on(UserActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load All Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load User by ID
  on(UserActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    users: state.users.some(u => u.id === user.id)
      ? state.users.map(u => u.id === user.id ? user : u)
      : [...state.users, user],
    loading: false
  })),

  on(UserActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    currentUser: state.currentUser?.id === user.id
      ? { ...state.currentUser, ...user }
      : state.currentUser,
    loading: false
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Settings
  on(UserActions.updateSettings, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    currentUser: state.currentUser
      ? { ...state.currentUser, settings }
      : null,
    loading: false
  })),

  on(UserActions.updateSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Theme
  on(UserActions.setTheme, (state, { theme }) => ({
    ...state,
    settings: state.settings
      ? { ...state.settings, theme }
      : { ...DEFAULT_USER_SETTINGS, theme } // Sử dụng mặc định và ghi đè theme
  })),

  // User Status
  on(UserActions.updateUserStatus, (state, { userId, isOnline }) => ({
    ...state,
    users: state.users.map(user =>
      user.id === userId ? { ...user, isOnline } : user
    )
  })),

  // Connection Status
  on(UserActions.setConnectionStatus, (state, { isConnected }) => ({
    ...state,
    currentUser: state.currentUser
      ? { ...state.currentUser, isOnline: isConnected }
      : null,
    users: state.users.map(user =>
      user.id === state.currentUser?.id
        ? { ...user, isOnline: isConnected }
        : user
    )
  }))
);
