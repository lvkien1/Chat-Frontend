import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    loadChildren: () => import('./features/chat/chat.routes').then(m => m.routes)
  },
  {
    path: 'messages',
    loadChildren: () => import('./features/messages/messages.routes').then(m => m.routes)
  },
  {
    path: 'files',
    loadChildren: () => import('./features/files/files.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '/chat'
  }
];
