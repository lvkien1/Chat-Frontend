import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/user/user.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  console.log(`AuthGuard running for route: ${state.url}`);

  // Kiểm tra trực tiếp token trong localStorage trước
  const hasToken = localStorage.getItem('auth_token');
  console.log('Token trong localStorage:', hasToken ? 'Có' : 'Không');

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      console.log('Trạng thái isAuthenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        console.log('AuthGuard: Cho phép truy cập:', state.url);
        return true;
      } else {
        console.log('AuthGuard: Chuyển hướng đến trang đăng nhập');
        
        // Người dùng chưa đăng nhập, chuyển hướng tới trang đăng nhập
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
