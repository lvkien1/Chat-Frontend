import { createFeature } from '@ngrx/store';
import { chatReducer, ChatState } from './chat.reducer';

export * from './chat.actions';
export * from './chat.selectors';
export type { ChatState } from './chat.reducer';

export const chatFeature = createFeature({
  name: 'chat',
  reducer: chatReducer
});
