export interface ChatMessage {
  userName: string;
  message?: string;
  imagePath?: string;
}

export interface ChatUserList {
  userName: string;
  userId: string;
}
