import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { UserService } from '../../core/services/user.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { UserActions } from './user.actions';
import { selectCurrentUser } from './user.selectors';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCurrentUser),
      switchMap(() =>
        this.userService.getCurrentUser().pipe(
          map((user) => UserActions.loadCurrentUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.loadCurrentUserFailure({ error }))
          )
        )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      switchMap(({ userId }) =>
        this.userService.getUserById(userId).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByIdFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ userId, changes }) =>
        this.userService.updateUser(userId, changes).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateSettings),
      switchMap(({ userId, settings }) =>
        this.userService.updateSettings(userId, settings).pipe(
          map((settings) => UserActions.updateSettingsSuccess({ settings })),
          catchError((error) =>
            of(UserActions.updateSettingsFailure({ error }))
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ userId, changes }) =>
        this.userService.updateProfile(userId, changes).pipe(
          map((user) => UserActions.updateProfileSuccess({ user })),
          catchError((error) => of(UserActions.updateProfileFailure({ error })))
        )
      )
    )
  );

  uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.uploadAvatar),
      switchMap(({ userId, file }) =>
        this.userService.uploadAvatar(userId, file).pipe(
          map((user) => UserActions.uploadAvatarSuccess({ user })),
          catchError((error) => of(UserActions.uploadAvatarFailure({ error })))
        )
      )
    )
  );

  updatePresence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updatePresence),
      switchMap(({ status }) =>
        this.webSocketService.updateStatus(status).pipe(
          map((response) =>
            UserActions.updatePresenceSuccess({ status: response })
          ),
          catchError((error) =>
            of(UserActions.updatePresenceFailure({ error }))
          )
        )
      )
    )
  );

  setTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.setTheme),
        tap(({ theme }) => {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private userService: UserService,
    private webSocketService: WebSocketService,
    private store: Store
  ) {}
}
