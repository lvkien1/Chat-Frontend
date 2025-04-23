import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // Route mặc định redirect về auth
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  
  // Route auth - public routes
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  
  // Route chat - cần xác thực
  {
    path: 'chat',
    canActivate: [authGuard],
    loadChildren: () => import('./features/chat/chat.routes').then(m => m.routes)
  },
  
  // Route messages - cần xác thực
  {
    path: 'messages',
    canActivate: [authGuard],
    loadChildren: () => import('./features/messages/messages.routes').then(m => m.routes)
  },
  
  // Route files - cần xác thực
  {
    path: 'files',
    canActivate: [authGuard],
    loadChildren: () => import('./features/files/files.routes').then(m => m.routes)
  },
  
  // Wildcard route - chuyển hướng về chat (sẽ kích hoạt authGuard nếu chưa đăng nhập)
  {
    path: '**',
    redirectTo: '/chat'
  }
];
