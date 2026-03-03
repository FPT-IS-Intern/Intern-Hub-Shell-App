export interface NotificationActionData {
  [key: string]: unknown;
}

export interface InAppNotificationResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  actionData?: NotificationActionData;
  read: boolean;
  createdAt: number;
}
