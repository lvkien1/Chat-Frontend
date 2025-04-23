import { createReducer, on } from '@ngrx/store';
import { User, UserProfile, UserSettings, DEFAULT_USER_SETTINGS } from '../../core/models/user.model';
import { UserActions } from './user.actions';

export interface UserState {
  currentUser: UserProfile | null;
  users: User[];
  loading: boolean;
  error: string | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
}

export const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  settings: null,
  isAuthenticated: false
};

export const userReducer = createReducer(
  initialState,

  // Authentication
  on(UserActions.initAuthStatus, (state) => ({
    ...state,
    loading: true
  })),

  on(UserActions.initAuthStatusSuccess, (state, { isAuthenticated }) => ({
    ...state,
    isAuthenticated,
    loading: false
  })),

  on(UserActions.initAuthStatusFailure, (state) => ({
    ...state,
    isAuthenticated: false,
    loading: false
  })),

  on(UserActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.registerSuccess, (state, { user }) => ({
    ...state,
    currentUser: {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserProfile,
    users: [...state.users, user],
    loading: false,
    isAuthenticated: true
  })),
  
  on(UserActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),

  on(UserActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserProfile,
    loading: false,
    isAuthenticated: true
  })),
  
  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),

  on(UserActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  
  on(UserActions.logoutSuccess, (state) => ({
    ...state,
    currentUser: null,
    loading: false,
    isAuthenticated: false
  })),
  
  on(UserActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false  // Đặt isAuthenticated: false ngay cả khi logout thất bại
  })),

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
    settings: state?.settings && state.settings.theme ? { ...user.Settings, theme: state.settings.theme } : user.Settings,
    isAuthenticated: true
  })),

  on(UserActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false  // Thiết lập isAuthenticated: false khi không tải được thông tin người dùng
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
    error,
    isAuthenticated: false
  })),

  // Load User by ID
  on(UserActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    users: state.users.some(u => u.Id === user.Id)
      ? state.users.map(u => u.Id === user.Id ? user : u)
      : [...state.users, user],
    loading: false
  })),

  on(UserActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.Id === user.Id ? user : u),
    currentUser: state.currentUser?.Id === user.Id
      ? { ...state.currentUser, ...user }
      : state.currentUser,
    loading: false
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
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
      ? { ...state.currentUser, Settings: settings }
      : null,
    loading: false
  })),

  on(UserActions.updateSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),

  // Update Profile
  on(UserActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    currentUser: state.currentUser
      ? { ...state.currentUser, ...user }
      : null,
    loading: false
    // Không đặt isAuthenticated ở đây vì đây là cập nhật profile
  })),

  on(UserActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false // Thêm isAuthenticated: false
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
      user.Id === userId ? { ...user, IsOnline: isOnline } : user
    )
  })),

  // Connection Status
  on(UserActions.setConnectionStatus, (state, { isConnected }) => ({
    ...state,
    currentUser: state.currentUser
      ? { ...state.currentUser, IsOnline: isConnected }
      : null,
    users: state.users.map(user =>
      user.Id === state.currentUser?.Id
        ? { ...user, IsOnline: isConnected }
        : user
    )
  }))
);
