import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Chat, createMockChat } from '../models/chat.model';
import { Message, createTextMessage } from '../models/message.model';
import { environment } from '../../../environments/environment';
import { ChatParticipant } from '../models/user.model';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chats`;
  private mockChats: Map<string, Chat> = new Map();
  private mockMessages: Map<string, Message[]> = new Map();

  constructor(
    private http: HttpClient,
    private websocketService: WebSocketService
  ) {
    this.initializeMockData();
  }

  getChats(): Observable<Chat[]> {
    // Mock implementation
    return of(Array.from(this.mockChats.values())).pipe(delay(100));
  }

  getMessages(chatId: string): Observable<Message[]> {
    // Mock implementation
    return of(this.mockMessages.get(chatId) || []).pipe(delay(100));
  }

  sendMessage(chatId: string, content: string, attachments: string[] = []): Observable<Message> {
    const message = createTextMessage(chatId, content, 'current-user');
    this.websocketService.sendMessage(message);
    
    // Update local state
    let messages = this.mockMessages.get(chatId) || [];
    messages = [...messages, message];
    this.mockMessages.set(chatId, messages);

    // Update last message in chat
    const chat = this.mockChats.get(chatId);
    if (chat) {
      chat.lastMessage = message;
      chat.updatedAt = new Date();
      this.mockChats.set(chatId, chat);
    }

    return of(message);
  }

  uploadFile(chatId: string, file: File): Observable<Message> {
    // Mock implementation
    const message: Message = {
      id: Date.now().toString(),
      chatId,
      content: '',
      senderId: 'current-user',
      timestamp: new Date(),
      type: 'file',
      status: 'sent',
      attachments: [
        {
          id: Date.now().toString(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          size: file.size,
          mimeType: file.type,
        },
      ],
    };

    let messages = this.mockMessages.get(chatId) || [];
    messages = [...messages, message];
    // messages.push(message);
    this.mockMessages.set(chatId, messages);

    // Update last message in chat
    const chat = this.mockChats.get(chatId);
    if (chat) {
      var newChat = {
        ...chat,
        lastMessage: message,
        updatedAt: new Date()
      };
      this.mockChats.set(chatId, newChat);
    }

    return of(message).pipe(delay(500));
  }

  updateTypingStatus(chatId: string, userId: string, isTyping: boolean): Observable<void> {
    // Mock implementation
    const chat = this.mockChats.get(chatId);
    if (chat) {
      const updatedChat = {
        ...chat,
        typingUsers: isTyping 
          ? [...new Set([...chat.typingUsers, userId])]
          : chat.typingUsers.filter(id => id !== userId)
      };
      this.mockChats.set(chatId, updatedChat);
    }
    return of(undefined).pipe(delay(100));
  }

  markAsRead(chatId: string, messageIds: string[]): Observable<void> {
    // Mock implementation
    const chat = this.mockChats.get(chatId);
    if (chat) {
      chat.unreadCount = 0;
      this.mockChats.set(chatId, chat);
    }
    return of(undefined).pipe(delay(100));
  }

  private initializeMockData(): void {
    // Add mock chat
    const mockChat = createMockChat('1');
    const mockParticipant: ChatParticipant = {
      id: 'user1',
      name: 'User One',
      avatar: '',
      isOnline: true,
      role: 'member'
    };
    
    mockChat.participantsInfo = [mockParticipant];
    mockChat.lastMessage = createTextMessage('1', 'Hello', 'user1');
    this.mockChats.set('1', mockChat);

    // Add mock messages
    this.mockMessages.set('1', [
      createTextMessage('1', 'Hello', 'user1'),
      createTextMessage('1', 'Hi there!', 'current-user')
    ]);
  }
}
