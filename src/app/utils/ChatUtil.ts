export class ChatUtil {
  /**
   * Utility method to format chat messages.
   * @param username The name of the user sending the message.
   * @param message The content of the message.
   * @returns A formatted string combining username and message.
   */
  static formatMessage(username: string, message: string): string {
    return `${username}: ${message}`;
  }

  /**
   * Utility method to check if a message is empty or only contains whitespace.
   * @param message The message to check.
   * @returns True if the message is empty or whitespace, otherwise false.
   */
  static isMessageEmpty(message: string): boolean {
    return !message.trim();
  }

  static getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  }
}
