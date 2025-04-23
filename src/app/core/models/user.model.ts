export interface BaseUser {
  Id: string;
  FullName: string;
  Email: string;
  Avatar?: string;
  Settings: UserSettings;
  IsOnline: boolean;
}

export interface RegisterModel {
  Username: string;
  Email: string;
  Password: string;
  FullName: string;
}

export interface LoginModel {
  Username: string;
  Password: string;
}

export interface User extends BaseUser {
  // Additional fields specific to general users
}

export interface UserProfile extends BaseUser {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme?: 'light' | 'dark';
  enableNotifications: boolean;
  soundEnabled: boolean;
  showReadReceipts: boolean;
  showOnlineStatus: boolean;
  lastUpdated?: Date;
}

export interface UpdateSettingsDto {
  theme?: 'light' | 'dark';
  enableNotifications?: boolean;
  soundEnabled?: boolean;
  showReadReceipts?: boolean;
  showOnlineStatus?: boolean;
}

export interface UserStatus {
  userId: string; // Giữ nguyên tên để tương thích với code cũ
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export interface UserPresence {
  userId: string; // Giữ nguyên tên để tương thích với code cũ
  status: 'online' | 'away' | 'offline';
  lastActivity: Date;
}

export interface UpdateProfileDto extends Partial<BaseUser> {
  currentPassword?: string;
  newPassword?: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  enableNotifications: true,
  soundEnabled: true,
  showReadReceipts: true,
  showOnlineStatus: true
};

export interface ChatParticipant extends Pick<BaseUser, 'Id' | 'FullName' | 'Avatar'> {
  role?: 'owner' | 'admin' | 'member';
  lastSeen?: Date;
  IsOnline: boolean;
}

export const createMockUser = (id: string): User => ({
  Id: id,
  FullName: `User ${id}`,
  Email: `user${id}@example.com`,
  Avatar: '',
  IsOnline: false,
  Settings: DEFAULT_USER_SETTINGS
});
