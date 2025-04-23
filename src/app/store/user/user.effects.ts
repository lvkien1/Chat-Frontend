import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { UserService } from '../../core/services/user.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { UserActions } from './user.actions';
import { selectCurrentUser } from './user.selectors';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  // Authentication effects
  // Kiểm tra trạng thái đăng nhập khi khởi động
  initAuthStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.initAuthStatus),
      switchMap(() => {
        // Kiểm tra token trong localStorage
        const hasToken = this.userService.checkAuthStatus();
        
        if (hasToken) {
          // Nếu có token, kiểm tra token có hợp lệ không bằng cách tải thông tin người dùng
          return this.userService.getCurrentUser().pipe(
            map((user) => {
              // Nếu lấy được thông tin người dùng, token hợp lệ
              console.log('Token hợp lệ, người dùng đã đăng nhập:', user);
              return UserActions.initAuthStatusSuccess({ isAuthenticated: true });
            }),
            catchError((error) => {
              // Nếu không lấy được thông tin người dùng, token không hợp lệ
              console.log('Token không hợp lệ hoặc đã hết hạn');
              // Xóa token khỏi localStorage
              this.userService.removeAuthToken();
              return of(UserActions.initAuthStatusFailure());
            })
          );
        } else {
          // Nếu không có token, người dùng chưa đăng nhập
          console.log('Không có token, người dùng chưa đăng nhập');
          return of(UserActions.initAuthStatusFailure());
        }
      })
    )
  );
  register$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.register),
      switchMap(({ model }) => 
        this.userService.register(model).pipe(
          map(user => UserActions.registerSuccess({ user })),
          catchError(error => of(UserActions.registerFailure({ error })))
        )
      )
    )
  );

  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ model }) =>
        this.userService.login(model).pipe(
          map(user => UserActions.loginSuccess({ user })),
          catchError(error => of(UserActions.loginFailure({ error })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logout),
      switchMap(() => 
        this.userService.logout().pipe(
          map(() => UserActions.logoutSuccess()),
          catchError(error => of(UserActions.logoutFailure({ error })))
        )
      )
    )
  );
  
  // Navigation after authentication
  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginSuccess, UserActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/chat']);
      })
    ),
    { dispatch: false }
  );
  
  authFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginFailure, UserActions.registerFailure),
      tap(({ error }) => {
        console.error('Authentication error:', error);
      })
    ),
    { dispatch: false }
  );
  
  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logoutSuccess),
      tap(() => {
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

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
    private store: Store,
    private router: Router
  ) {
    // Kích hoạt kiểm tra trạng thái xác thực khi ứng dụng khởi động
    this.store.dispatch(UserActions.initAuthStatus());

    // Khởi động WebSocket
    this.webSocketService.connect(1);
    const obserConnected = this.webSocketService.getConnectionStatus();
    obserConnected.subscribe(value => {
      this.webSocketService.connectConversation();
    });
  }
}
