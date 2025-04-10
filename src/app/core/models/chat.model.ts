import { Message } from './message.model';
import { ChatParticipant } from './user.model';

export type ChatType = 'direct' | 'group';
export type ChatStatus = 'active' | 'archived' | 'deleted';

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  participantsInfo: ChatParticipant[];
  participants: string[];  // User IDs
  lastMessage?: Message;
  createdBy: string;     // User ID
  createdAt: Date;
  updatedAt: Date;
  status: ChatStatus;
  avatar?: string;       // For group chats
  metadata?: Record<string, any>;
  unreadCount: number;
  typingUsers: string[]; // Array of user IDs who are currently typing
}

export interface CreateChatDto {
  name?: string;
  type: ChatType;
  participants: string[];
  avatar?: string;
}

export function createMockChat(id: string): Chat {
  return {
    id,
    name: `Chat ${id}`,
    type: 'direct',
    participantsInfo: [
      { 
        id: 'user1',
        name: 'User 1',
        avatar: '',
        isOnline: true
      }
    ],
    participants: ['user1'],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    unreadCount: 0,
    typingUsers: []
  };
}

export function getChatName(chat: Chat, currentUserId: string): string {
  if (chat.type === 'group') {
    return chat.name;
  }
  
  // For direct chats, show the other participant's name
  const otherParticipant = chat.participantsInfo.find(p => p.id !== currentUserId);
  return otherParticipant?.name || 'Unknown User';
}

export function getChatAvatar(chat: Chat, currentUserId: string): string {
  if (chat.type === 'group') {
    return chat.avatar || '';
  }

  // For direct chats, show the other participant's avatar
  const otherParticipant = chat.participantsInfo.find(
    (p) => p.id !== currentUserId
  );
  return otherParticipant?.avatar || '';
}

export function getTypingUsersText(chat: Chat, currentUserId: string): string {
  const typingUsers = chat.participantsInfo
    .filter(user => chat.typingUsers.includes(user.id) && user.id !== currentUserId)
    .map(user => user.name);

  if (typingUsers.length === 0) return '';
  if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
  if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  return 'Several people are typing...';
}
