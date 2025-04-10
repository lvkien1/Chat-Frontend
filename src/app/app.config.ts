import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { chatReducer } from './store/chat/chat.reducer';
import { ChatEffects } from './store/chat/chat.effects';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore({
      chat: chatReducer,
      user: userReducer
    }),
    provideEffects([
      ChatEffects,
      UserEffects
    ])
  ]
};
