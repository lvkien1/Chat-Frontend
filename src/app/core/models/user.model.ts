export interface BaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  settings: UserSettings;
  isOnline: boolean;
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
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export interface UserPresence {
  userId: string;
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

export interface ChatParticipant extends Pick<BaseUser, 'id' | 'name' | 'avatar'> {
  role?: 'owner' | 'admin' | 'member';
  lastSeen?: Date;
  isOnline: boolean;
}

export const createMockUser = (id: string): User => ({
  id,
  name: `User ${id}`,
  email: `user${id}@example.com`,
  avatar: '',
  isOnline: false,
  settings: DEFAULT_USER_SETTINGS
});
