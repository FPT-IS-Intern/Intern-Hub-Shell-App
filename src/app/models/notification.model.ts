export interface NotificationActionData {
  [key: string]: unknown;
}

export interface InAppNotificationResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  actionData?: NotificationActionData;
  isRead: boolean;
  createdAt: number;
}

