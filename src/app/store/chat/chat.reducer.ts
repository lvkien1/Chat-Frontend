import { createReducer, on } from '@ngrx/store';
import { Chat } from '../../core/models/chat.model';
import { Message, MessageStatus } from '../../core/models/message.model';
import { ChatActions } from './chat.actions';

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  currentChatId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ChatState = {
  chats: [],
  messages: [],
  currentChatId: null,
  loading: false,
  error: null
};

export const chatReducer = createReducer(
  initialState,

  // Load Chats
  on(ChatActions.loadChats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.loadChatsSuccess, (state, { chats }) => ({
    ...state,
    chats,
    loading: false
  })),

  on(ChatActions.loadChatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Messages
  on(ChatActions.loadMessages, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages,
    loading: false
  })),

  on(ChatActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Send Message
  on(ChatActions.sendMessage, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    chats: state.chats.map(chat => 
      chat.id === message.chatId 
        ? { ...chat, lastMessage: message, updatedAt: message.timestamp }
        : chat
    ),
    loading: false
  })),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Upload File
  on(ChatActions.uploadFile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.uploadFileSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    chats: state.chats.map(chat => 
      chat.id === message.chatId 
        ? { ...chat, lastMessage: message, updatedAt: message.timestamp }
        : chat
    ),
    loading: false
  })),

  on(ChatActions.uploadFileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Chat Selection
  on(ChatActions.setCurrentChat, (state, { chatId }) => ({
    ...state,
    currentChatId: chatId
  })),

  on(ChatActions.clearCurrentChat, (state) => ({
    ...state,
    currentChatId: null
  })),

  // Message Status
  on(ChatActions.markMessagesRead, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.markMessagesReadSuccess, (state, { chatId, messageIds }) => ({
    ...state,
    messages: state.messages.map(m => 
      messageIds.includes(m.id) && m.chatId === chatId
        ? { ...m, status: 'read' as MessageStatus }
        : m
    ),
    loading: false
  })),

  on(ChatActions.markMessagesReadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Chat Management
  on(ChatActions.createChat, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.createChatSuccess, (state, { chat }) => ({
    ...state,
    chats: [...state.chats, chat],
    currentChatId: chat.id,
    loading: false
  })),

  on(ChatActions.createChatFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ChatActions.updateChat, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.updateChatSuccess, (state, { chat }) => ({
    ...state,
    chats: state.chats.map(c => c.id === chat.id ? chat : c),
    loading: false
  })),

  on(ChatActions.updateChatFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ChatActions.deleteChat, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.deleteChatSuccess, (state, { chatId }) => ({
    ...state,
    chats: state.chats.filter(chat => chat.id !== chatId),
    currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
    loading: false
  })),

  on(ChatActions.deleteChatFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // WebSocket Events
  on(ChatActions.messageReceived, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    chats: state.chats.map(chat => 
      chat.id === message.chatId 
        ? { 
            ...chat, 
            lastMessage: message,
            updatedAt: message.timestamp,
            unreadCount: chat.id !== state.currentChatId ? (chat.unreadCount || 0) + 1 : 0
          }
        : chat
    )
  })),

  on(ChatActions.typingStatusUpdated, (state, { chatId, userId, isTyping }) => ({
    ...state,
    chats: state.chats.map(chat => 
      chat.id === chatId
        ? {
            ...chat,
            typingUsers: isTyping
              ? [...new Set([...chat.typingUsers, userId])]
              : chat.typingUsers.filter(id => id !== userId)
          }
        : chat
    )
  }))
);
