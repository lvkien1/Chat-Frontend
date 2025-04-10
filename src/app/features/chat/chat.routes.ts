import { Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatDetailComponent } from './pages/chat-detail/chat-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: ':id',
        component: ChatDetailComponent,
      },
    ],
  },
];
