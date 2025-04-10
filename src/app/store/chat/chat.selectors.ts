import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.reducer';
import { Message, isFileMessage } from '../../core/models/message.model';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectAllChats = createSelector(
  selectChatState,
  (state) => state.chats
);

export const selectCurrentChat = createSelector(
  selectChatState,
  (state) => state.chats.find(chat => chat.id === state.currentChatId)
);

export const selectCurrentChatId = createSelector(
  selectChatState,
  (state) => state.currentChatId
);

export const selectChatMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const selectCurrentChatMessages = createSelector(
  selectChatMessages,
  selectCurrentChatId,
  (messages, chatId) => messages.filter(message => message.chatId === chatId)
);

export const selectAllFileMessages = createSelector(
  selectChatMessages,
  (messages) => messages.filter(isFileMessage)
);

export const selectIsLoading = createSelector(
  selectChatState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectChatState,
  (state) => state.error
);

export const selectTypingUsers = createSelector(
  selectCurrentChat,
  (chat) => chat?.typingUsers || []
);
