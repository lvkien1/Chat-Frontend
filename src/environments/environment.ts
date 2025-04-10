export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000/ws',
  auth: {
    clientId: 'chat-app-client',
    issuer: 'http://localhost:3000',
    scope: 'openid profile email',
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  chat: {
    maxMessageLength: 1000,
    typingTimeout: 3000, // 3 seconds
    messagePageSize: 50,
    initialLoadMessages: 30
  },
  theme: {
    primary: '#615EF0',
    accent: '#FFC107',
    warn: '#f44336'
  },
  mockData: {
    enabled: true,
    delay: 500 // Simulated network delay in ms
  }
};
