export type MessageType = 'text' | 'file' | 'image' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageAttachment {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: MessageType;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  replyTo?: string;  // ID of the message being replied to
  edited?: boolean;
  deletedAt?: Date;
  metadata?: Record<string, any>;
}

export interface FileMessage extends Message {
  type: 'file' | 'image';
  attachments: MessageAttachment[];
}

export function isFileMessage(message: Message): message is FileMessage {
  return (message.type === 'file' || message.type === 'image') && 
         Array.isArray(message.attachments) && 
         message.attachments.length > 0;
}

export function createTextMessage(chatId: string, content: string, senderId: string): Message {
  return {
    id: Date.now().toString(),
    chatId,
    content,
    senderId,
    timestamp: new Date(),
    type: 'text',
    status: 'sent'
  };
}

export function createFileMessage(chatId: string, senderId: string, file: File): FileMessage {
  return {
    id: Date.now().toString(),
    chatId,
    content: '',
    senderId,
    timestamp: new Date(),
    type: file.type.startsWith('image/') ? 'image' : 'file',
    status: 'sent',
    attachments: [{
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      mimeType: file.type
    }]
  };
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video_file';
  if (mimeType.startsWith('audio/')) return 'audio_file';
  if (mimeType.includes('pdf')) return 'picture_as_pdf';
  if (mimeType.includes('word')) return 'description';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table_chart';
  if (mimeType.includes('presentation')) return 'slideshow';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'folder_zip';
  return 'insert_drive_file';
}
