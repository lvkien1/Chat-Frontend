import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/user/user.selectors';

/**
 * Guard for public routes like login/register
 * Redirects authenticated users to app main page
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  console.log(`PublicGuard running for route: ${state.url}`);

  // Kiểm tra trực tiếp token trong localStorage trước
  const hasToken = localStorage.getItem('auth_token');
  console.log('Token trong localStorage:', hasToken ? 'Có' : 'Không');

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      console.log('PublicGuard - Trạng thái isAuthenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        console.log('PublicGuard: Người dùng đã đăng nhập, chuyển hướng đến /chat');
        // Người dùng đã đăng nhập, chuyển hướng tới trang chính
        router.navigate(['/chat']);
        return false;
      } else {
        console.log('PublicGuard: Cho phép truy cập trang auth:', state.url);
        // Người dùng chưa đăng nhập, cho phép truy cập trang auth
        return true;
      }
    })
  );
};
