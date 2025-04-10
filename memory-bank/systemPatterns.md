# System Design Patterns

## Component Structure Standards
1. File Organization:
   - Each component in its own directory
   - Consistent naming: [component-name].component.[ext]
   - Separate files for HTML, TS, and SCSS
   - Group related components by feature

2. CSS Encapsulation:
   - Mandatory :host selector for root styles
   - Avoid global styles in components
   - Use ::ng-deep sparingly for child components
   - Example:
     ```scss
     :host {
       display: block;
       .component-class {
         // Component-specific styles
       }
     }
     ```

3. Component Architecture:
   - Standalone components with explicit imports
- Feature-based folder structure
- Shared components in shared module
- Container/Presentation pattern where appropriate
- Component file organization:
  - Each component in its own directory
  - Separate files for HTML, TS, and SCSS
  - Component name as prefix for all files (e.g., `message-bubble.component.ts`)
- CSS encapsulation using `:host` selector:
  ```scss
  // Example of proper component styling
  :host {
    .component-class {
      // Styles here
    }
    
    ::ng-deep {
      // Styles for child components
    }
  }
  ```

## State Management
- NGRX store for global state
- Strong typing with interfaces
- Action creators with proper typing
- Selectors with memoization
- Effects for side effects
- Async data handling with observables

## Type Safety
1. Message Types:
   ```typescript
   type MessageType = 'text' | 'file' | 'image' | 'system';
   type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
   ```

2. File Handling:
   ```typescript
   interface FileMessage extends Message {
     type: 'file' | 'image';
     attachments: MessageAttachment[];
   }
   ```

3. Type Guards:
   ```typescript
   function isFileMessage(message: Message): message is FileMessage {
     return ['file', 'image'].includes(message.type) && 
            Array.isArray(message.attachments) && 
            message.attachments.length > 0;
   }
   ```

## UI/UX Patterns
- Material Design icons
- Consistent spacing and layout
- Responsive design principles
- Loading states for async operations
- Error boundaries and fallbacks

## Service Patterns
1. Mock Implementation:
   ```typescript
   // Mock service with delay
   return of(result).pipe(delay(100));
   ```

2. WebSocket Handling:
   ```typescript
   // Subject-based event handling
   private messages$ = new Subject<Message>();
   ```

3. File Upload:
   ```typescript
   // File handling with observables
   uploadFile(chatId: string, file: File): Observable<Message>
   ```

## Error Handling
- Type-safe error objects
- Global error boundaries
- Service-level error handling
- Action-based error management

## Testing Strategy
- Unit tests for services
- Component testing with TestBed
- E2E testing for critical flows
- Mock service patterns

## Performance Patterns
- Async pipes in templates
- OnPush change detection
- Memoized selectors
- Lazy loading for features
- Proper unsubscribe patterns

## Code Organization
- Feature modules
- Core services
- Shared components
- Model interfaces
- Store organization
  - Actions
  - Effects
  - Reducers
  - Selectors
