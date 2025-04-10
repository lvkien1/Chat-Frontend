import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat } from '../../core/models/chat.model';
import { Message } from '../../core/models/message.model';

export const ChatActions = createActionGroup({
  source: 'Chat',
  events: {
    // Load Chats
    'Load Chats': emptyProps(),
    'Load Chats Success': props<{ chats: Chat[] }>(),
    'Load Chats Failure': props<{ error: any }>(),

    // Load Messages
    'Load Messages': props<{ chatId: string }>(),
    'Load Messages Success': props<{ messages: Message[] }>(),
    'Load Messages Failure': props<{ error: any }>(),

    // Send Message
    'Send Message': props<{ chatId: string; content: string; attachments: string[] }>(),
    'Send Message Success': props<{ message: Message }>(),
    'Send Message Failure': props<{ error: any }>(),

    // Upload File
    'Upload File': props<{ chatId: string; file: File }>(),
    'Upload File Success': props<{ message: Message }>(),
    'Upload File Failure': props<{ error: any }>(),

    // Message Status
    'Mark Messages Read': props<{ chatId: string; messageIds: string[] }>(),
    'Mark Messages Read Success': props<{ chatId: string; messageIds: string[] }>(),
    'Mark Messages Read Failure': props<{ error: any }>(),

    // Chat Selection
    'Set Current Chat': props<{ chatId: string }>(),
    'Clear Current Chat': emptyProps(),

    // WebSocket Actions
    'Initialize WebSocket': emptyProps(),
    'Message Received': props<{ message: Message }>(),
    'Update Typing Status': props<{ chatId: string; isTyping: boolean }>(),
    'Typing Status Updated': props<{ chatId: string; userId: string; isTyping: boolean }>(),
    'Connection Status Updated': props<{ isConnected: boolean }>(),
    'Read Receipt Updated': props<{ chatId: string; userId: string; lastRead: Date }>(),

    // Chat Management
    'Create Chat': props<{ userIds: string[] }>(),
    'Create Chat Success': props<{ chat: Chat }>(),
    'Create Chat Failure': props<{ error: any }>(),

    'Update Chat': props<{ chatId: string; data: Partial<Chat> }>(),
    'Update Chat Success': props<{ chat: Chat }>(),
    'Update Chat Failure': props<{ error: any }>(),

    'Delete Chat': props<{ chatId: string }>(),
    'Delete Chat Success': props<{ chatId: string }>(),
    'Delete Chat Failure': props<{ error: any }>()
  }
});
