import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { User, UserSettings } from '../../core/models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);

export const selectUserSettings = createSelector(
  selectUserState,
  (state) => state.settings
);

export const selectCurrentTheme = createSelector(
  selectUserSettings,
  (settings) => settings?.theme || 'light'
);

export const selectAllUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectUserById = (userId: string) => createSelector(
  selectAllUsers,
  (users) => users.find(user => user.id === userId)
);

export const selectUsersMap = createSelector(
  selectAllUsers,
  (users) => users.reduce((map: { [key: string]: User }, user) => {
    map[user.id] = user;
    return map;
  }, {})
);
